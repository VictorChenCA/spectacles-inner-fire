@component
export class BreathingScaleGuide extends BaseScriptComponent {
    @input
    textObject1!: SceneObject; // main guide text
    @input
    textObject2!: SceneObject; // countdown / "Ready?"

    @input
    targetObject!: SceneObject;

    @input
    originalScale: vec3 = new vec3(0.3, 0.3, 0.3);
    @input
    targetScale: vec3 = new vec3(0.9, 0.9, 0.9);

    @input
    duration: number = 4;
    @input
    pauseDuration: number = 4;

    @input
    targetToEnable!: SceneObject;
    @input
    targetToDisable!: SceneObject;

    private primaryText!: Text;
    private secondaryText!: Text;
    private transform!: Transform;

    private timer = 0;
    private phase = 0; // 0: inhale, 1: hold1, 2: exhale, 3: hold2
    private currentLoop = 0;
    private readonly totalLoops = 3;

    private countdownNumbers: string[] = [];
    private lastCountdownIndex: number = -1;
    private readyShown = false;

    private readonly labels = [
        "Inhale through your nose",
        "Hold",
        "Exhale through your mouth",
        "Hold"
    ];

    onAwake(): void {
        this.primaryText = this.textObject1.getComponent("Component.Text") as Text;
        this.secondaryText = this.textObject2.getComponent("Component.Text") as Text;
        this.transform = this.targetObject.getTransform();

        if (!this.primaryText || !this.secondaryText || !this.transform) {
            throw new Error("Missing required components");
        }

        this.primaryText.text = "Let's start with a deep breath";
        this.secondaryText.text = "";
        this.transform.setLocalScale(this.originalScale);

        this.createEvent("UpdateEvent").bind(this.onUpdate);
    }

    private onUpdate = (): void => {
        const dt = getDeltaTime();
        this.timer += dt;

        // Scale handling
        if (this.phase === 0) {
            // Inhale (scale up)
            const t = this.smoothstep(this.timer / this.duration);
            this.transform.setLocalScale(vec3.lerp(this.originalScale, this.targetScale, t));
        } else if (this.phase === 2) {
            // Exhale (scale down)
            const t = this.smoothstep(this.timer / this.duration);
            this.transform.setLocalScale(vec3.lerp(this.targetScale, this.originalScale, t));
        }

        // Countdown handling for loops after the first
        if (this.currentLoop > 0) {
            const phaseDuration = this.getPhaseDuration(this.phase);
            const countdown = this.getCountdownSequence(phaseDuration);
            const slice = phaseDuration / countdown.length;
            const index = Math.floor(this.timer / slice);

            if (index !== this.lastCountdownIndex && index < countdown.length) {
                this.secondaryText.text = countdown[index];
                this.lastCountdownIndex = index;
            }
        }

        const currentDuration = this.getPhaseDuration(this.phase);

        // Phase transition
        if (this.timer >= currentDuration) {
            this.timer = 0;
            this.phase++;
            this.lastCountdownIndex = -1;

            // End of full loop
            if (this.phase >= 4) {
                this.currentLoop++;
                this.phase = 0;
                this.readyShown = false;

                if (this.currentLoop >= this.totalLoops) {
                    this.finishCycle();
                    return;
                }
            }

            if (this.currentLoop === 0) {
                // During the first full cycle, keep the primary text fixed
                this.primaryText.text = "Let's start with a deep breath";
                this.secondaryText.text = ""; // Clear countdown between phases
            } else {
                this.primaryText.text = this.labels[this.phase];
                this.secondaryText.text = ""; // Clear countdown between phases
            }
            
        }

        // Special case: show "Ready?" once, after hold1 of first cycle
        if (
            this.currentLoop === 0 &&
            this.phase === 2 && // exhale
            !this.readyShown
        ) {
            this.secondaryText.text = "Ready?";
            this.readyShown = true;
        }
    };

    private getPhaseDuration(phase: number): number {
        return (phase === 0 || phase === 2) ? this.duration : this.pauseDuration;
    }

    private getCountdownSequence(duration: number): string[] {
        return duration >= 4 ? ["4", "3", "2", "1"] : ["3", "2", "1"];
    }

    private finishCycle(): void {
        this.primaryText.text = "";
        this.secondaryText.text = "";

        if (this.targetToEnable) this.targetToEnable.enabled = true;
        if (this.targetToDisable) this.targetToDisable.enabled = false;
    }

    private smoothstep(x: number): number {
        const t = MathUtils.clamp(x, 0, 1);
        return t * t * (3 - 2 * t);
    }
}
