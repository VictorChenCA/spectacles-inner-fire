@component
export class NewScript extends BaseScriptComponent {
    @input
    @hint("SceneObject with a Text component")
    textObject!: SceneObject;

    @input
    @hint("Object to enable after breathing cycle")
    targetToEnable!: SceneObject;

    @input
    @hint("Object to disable after breathing cycle")
    targetToDisable!: SceneObject;

    private textComponent: Text | undefined;
    private phase = 0;
    private timer = 0.0;
    private currentLoop = 0;
    private readonly totalLoops = 3;

    private readonly states = [
        { label: "Inhale through your nose", duration: 4 },
        { label: "Hold", duration: 4 },
        { label: "Exhale through your mouth", duration: 4 },
    ];

    onAwake(): void {
        if (!this.textObject) {
            throw new Error("Missing textObject");
        }

        this.textComponent = this.textObject.getComponent("Component.Text") as Text;
        if (!this.textComponent) {
            throw new Error("textObject does not have a Text component");
        }

        this.textComponent.text = "Ready?";
        this.timer = 0;

        this.createEvent("UpdateEvent").bind(this.onUpdate);
    }

    private onUpdate = (): void => {
        const dt = getDeltaTime();
        this.timer += dt;

        if (!this.textComponent) return;

        if (this.currentLoop === 0 && this.phase === 0 && this.timer < 2) {
            return; // Still showing "Ready?"
        }

        if (this.currentLoop === 0 && this.phase === 0 && this.timer >= 2) {
            this.phase = 0;
            this.timer = 0;
            this.textComponent.text = this.states[0].label;
            return;
        }

        const state = this.states[this.phase];

        if (this.timer >= state.duration) {
            this.phase++;
            this.timer = 0;

            if (this.phase >= this.states.length) {
                this.phase = 0;
                this.currentLoop++;
                if (this.currentLoop >= this.totalLoops) {
                    this.finishCycle();
                    return;
                }
            }

            this.textComponent.text = this.states[this.phase].label;
        }
    };

    private finishCycle(): void {
        if (this.textComponent) {
            this.textComponent.text = "";
        }

        if (this.targetToEnable) {
            this.targetToEnable.enabled = true;
        }

        if (this.targetToDisable) {
            this.targetToDisable.enabled = false;
        }
    }
}
