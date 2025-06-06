@component
export class BreathingScaleGuide extends BaseScriptComponent {
    @input textObject1!: SceneObject;
    @input textObject2!: SceneObject;
    @input targetObject!: SceneObject;

    @input originalScale: vec3 = new vec3(0.3, 0.3, 0.3);
    @input targetScale: vec3 = new vec3(0.9, 0.9, 0.9);

    @input duration: number = 4;
    @input pauseDuration: number = 3;

    @input targetToEnable1!: SceneObject;
    @input targetToEnable2!: SceneObject;
    @input targetToDisable1!: SceneObject;
    @input targetToDisable2!: SceneObject;

    private primaryText!: Text;
    private secondaryText!: Text;
    private transform!: Transform;

    private timer = 0;
    private phase = 0;
    private currentLoop = 0;
    private readonly totalLoops = 3;

    private lastCountdownIndex = -1;
    private readyShown = false;
    private textFrozen = false;
    private transitionDone = false;

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

        this.transform.setLocalScale(this.originalScale);
        this.primaryText.text = "Let's start with a few deep breaths.";
        this.secondaryText.text = "";

        this.createEvent("UpdateEvent").bind(this.onUpdate);
    }

    private onUpdate = (): void => {
        const dt = getDeltaTime();
        this.timer += dt;

        const isFinalRound = this.currentLoop === this.totalLoops - 1;
        const stillInIntro = this.currentLoop === 0 && this.phase < 4;

        // --- Scaling ---
        if (this.phase === 0) {
            const t = this.smoothstep(this.timer / this.duration);
            this.transform.setLocalScale(vec3.lerp(this.originalScale, this.targetScale, t));
        } else if (this.phase === 2) {
            const t = this.smoothstep(this.timer / this.duration);
            this.transform.setLocalScale(vec3.lerp(this.targetScale, this.originalScale, t));
        }

        // --- Countdown + "Ready?" Logic ---
        const phaseDuration = this.getPhaseDuration(this.phase);
        const countdown = this.getCountdownSequence(phaseDuration);
        const slice = phaseDuration / countdown.length;
        const index = Math.floor(this.timer / slice);

        if (index !== this.lastCountdownIndex && index < countdown.length) {
            this.lastCountdownIndex = index;

            if (stillInIntro) {
                if (this.phase === 2 && !this.readyShown) {
                    this.secondaryText.text = "Ready?";
                    this.readyShown = true;
                } else if (this.phase === 3) {
                    // Show countdown in 1.4 only
                    this.secondaryText.text = countdown[index];
                } else if (this.phase < 2) {
                    // No text during 1.1 and 1.2
                    this.secondaryText.text = "";
                }
                // Do NOT update text during 1.3 if "Ready?" was just shown
            } else {
                this.secondaryText.text = countdown[index];
            }
        }

        // --- Phase Transition ---
        if (this.timer >= phaseDuration) {
            if (!this.transitionDone && isFinalRound && this.phase === 3) {
                this.finishCycle();
                this.transitionDone = true;
                return;
            }

            this.timer = 0;
            this.phase++;
            this.lastCountdownIndex = -1;

            // Don't erase "Ready?" in 1.3 until the end of that phase
            if (!(stillInIntro && this.phase === 3)) {
                this.secondaryText.text = "";
            }

            this.readyShown = false;

            if (this.phase >= 4) {
                this.currentLoop++;
                this.phase = 0;
            }

            if (!this.textFrozen) {
                if (this.currentLoop === 0 && this.phase < 4) {
                    this.primaryText.text = "Let's start with a few deep breaths.";
                } else {
                    this.primaryText.text = this.labels[this.phase];
                }
            }
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
        this.textFrozen = true;

        if (this.targetToEnable1) this.targetToEnable1.enabled = true;
        if (this.targetToEnable2) this.targetToEnable2.enabled = true;
        if (this.targetToDisable1) this.targetToDisable1.enabled = false;
        if (this.targetToDisable2) this.targetToDisable2.enabled = false;
    }

    private smoothstep(x: number): number {
        const t = MathUtils.clamp(x, 0, 1);
        return t * t * (3 - 2 * t);
    }
}
