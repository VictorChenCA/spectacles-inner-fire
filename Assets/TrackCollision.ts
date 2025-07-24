@component
export class NewScript extends BaseScriptComponent {
    @input objectA!: SceneObject;
    @input objectB!: SceneObject;
    @input collisionDistance: number = 0.1;

    @input enableObject1!: SceneObject;
    @input enableObject2!: SceneObject;
    @input disableObject1!: SceneObject;
    @input disableObject2!: SceneObject;

    @input particle1!: SceneObject;
    @input particle2!: SceneObject;
    @input particle3!: SceneObject;
    @input particle4!: SceneObject;
    @input particle5!: SceneObject;

    @input flickerTarget!: SceneObject;
    @input baseScale: number = 1.0;
    @input flickerAmplitude: number = 0.3;
    @input flickerFrequency: number = 8.0;

    private hasCollided: boolean = false;
    private triggeredOnce: boolean = false; // ✅ NEW FLAG
    private flickerStartTime: number = 0;
    private maxDuration: number = 10.0;

    private scaleInt: number = 1;
    private currentSecond: number = -1;

    private scalePattern: number[] = [1, 4, 10, 9, 8, 7, 6, 5, 3, 1];
    private particles: SceneObject[] = [];
    private initialRotation!: quat; // Add this up top

    
    onAwake(): void {
        this.particles = [
            this.particle1,
            this.particle2,
            this.particle3,
            this.particle4,
            this.particle5
        ];

        if (this.flickerTarget) {
            this.initialRotation = this.flickerTarget.getTransform().getLocalRotation();
        }

        this.createEvent("UpdateEvent").bind(() => {
            // Detect collision ONCE
            if (!this.hasCollided && !this.triggeredOnce && this.objectA && this.objectB) {
                const posA = this.objectA.getTransform().getWorldPosition();
                const posB = this.objectB.getTransform().getWorldPosition();
                const distance = posA.distance(posB);

                if (distance <= this.collisionDistance) {
                    this.hasCollided = true;
                    this.triggeredOnce = true; // ✅ Only once
                    this.flickerStartTime = getTime();
                    this.currentSecond = -1;

                    if (this.enableObject1) this.enableObject1.enabled = true;
                    if (this.enableObject2) this.enableObject2.enabled = true;
                    if (this.disableObject1) this.disableObject1.enabled = false;
                    if (this.disableObject2) this.disableObject2.enabled = false;

                    print("💥 Collision detected — effects active.");
                }
            }

            if (this.hasCollided) {
                const t = getTime() - this.flickerStartTime;

                if (t <= this.maxDuration) {
                    const sec = Math.floor(t);
                    if (sec !== this.currentSecond && sec < this.scalePattern.length) {
                        this.currentSecond = sec;
                        this.scaleInt = this.scalePattern[sec];
                        print("📈 scaleInt = " + this.scaleInt);
                    }

                    if (this.flickerTarget) {
                        const transform = this.flickerTarget.getTransform();

                        // 🔥 Flicker scale (0.9 → 1.2), easing to 1.1
                        const sine = Math.sin(t * this.flickerFrequency);
                        const flickerScale = 1.1 + 0.3 * sine; // 1.1 ± 0.3 = [0.8, 1.4]
                        const finalT = Math.min(t / this.maxDuration, 1);
                        const easedT = finalT * finalT * (3 - 2 * finalT);
                        const blendedScale = flickerScale * (1 - easedT) + 1.1 * easedT;
                        transform.setLocalScale(new vec3(blendedScale, blendedScale, blendedScale));

                        // 🔁 Spin 360° once, relative to original rotation
                        const spinT = Math.min(t, 1.0);
                        const spinAngleRad = spinT * Math.PI * 2;                // 0 → 2π radians
                        const spinQuat = quat.angleAxis(spinAngleRad, vec3.up());            // create spin
                        const finalQuat = this.initialRotation.multiply(spinQuat);           // instance method
                        transform.setLocalRotation(finalQuat);
                 }
                         

                    const activationThreshold = 1.0 - (this.scaleInt / 10.0);
                    for (let i = 0; i < this.particles.length; i++) {
                        const obj = this.particles[i];
                        if (!obj) continue;

                        const rand = Math.random();
                        if (rand > activationThreshold) {
                            obj.enabled = true;
                        } else if (rand <= 0.5) {
                            obj.enabled = false;
                        }
                    }

                } else {
                    this.hasCollided = false; // Stops effect loop

                    if (this.flickerTarget) {
                        const resetScale = new vec3(this.baseScale, this.baseScale, this.baseScale);
                        this.flickerTarget.getTransform().setLocalScale(resetScale);
                    }

                    for (let i = 0; i < this.particles.length; i++) {
                        const obj = this.particles[i];
                        if (obj) obj.enabled = false;
                    }

                    print("⏹ Effects ended after 10 seconds.");
                }
            }
        });
    }
}
