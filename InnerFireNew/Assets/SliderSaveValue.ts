@component
export class SliderSaveValue extends BaseScriptComponent {
    @input
    @hint("SceneObject with the Slider script attached")
    sliderObject!: SceneObject;

    @input
    @hint("SceneObject with the Interactable (e.g. the knob)")
    interactableObject!: SceneObject;

    @input
    @hint("Object to enable after selection is made")
    targetToEnable!: SceneObject;

    @input
    @hint("Object to disable after selection is made (optional)")
    targetToDisable!: SceneObject;

    @input
    @hint("Persistent storage key name")
    storageKey: string = "sliderSelection";

    private sliderComponent: any;
    private hasSaved: boolean = false;
    private triggerBound: boolean = false;

    onAwake(): void {
        this.sliderComponent = this.sliderObject.getComponent("Component.ScriptComponent");

        if (!this.sliderComponent || typeof this.sliderComponent.onValueUpdate?.add !== "function") {
            print("❌ Slider script not found or missing onValueUpdate event.");
            return;
        }

        this.sliderComponent.onValueUpdate.add(this.onSliderChanged);
        print("✅ SliderSaveValue initialized and listening for value changes.");
    }

    private onSliderChanged = (value: number): void => {
        if (this.triggerBound || this.hasSaved) return;

        const interactable = this.interactableObject.getComponent("Component.ScriptComponent");
        if (!interactable || typeof interactable["onTriggerEnd"]?.add !== "function") {
            print("❌ Interactable script missing or onTriggerEnd not found.");
            return;
        }

        interactable["onTriggerEnd"].add(this.handleSliderRelease);
        this.triggerBound = true;
        print("✅ Bound to onTriggerEnd of knob.");
    };

    private handleSliderRelease = (): void => {
        if (this.hasSaved) return;

        const value = this.sliderComponent.currentValue ?? this.sliderComponent.startValue;
        const min = this.sliderComponent.minValue;
        const max = this.sliderComponent.maxValue;

        const t = MathUtils.clamp((value - min) / (max - min), 0, 1);
        const scaledValue = Math.round(1 + 9 * t);

        try {
            global.persistentStorageSystem.store.putInt(this.storageKey, scaledValue);
            print(`✅ Stored value ${scaledValue} under key "${this.storageKey}".`);
        } catch (e) {
            print(`❌ Storage failed for key "${this.storageKey}": ${e}`);
        }

        if (this.targetToEnable) {
            this.targetToEnable.enabled = true;
            print("✅ targetToEnable has been enabled.");
        } else {
            print("⚠️ targetToEnable is not assigned.");
        }

        if (this.targetToDisable) {
            this.targetToDisable.enabled = false;
            print("✅ targetToDisable has been disabled.");
        } else {
            print("⚠️ targetToDisable is not assigned.");
        }

        this.hasSaved = true;
    };
}
