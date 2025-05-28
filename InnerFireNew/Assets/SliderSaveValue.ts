@component
export class SliderSaveValue extends BaseScriptComponent {
    @input
    @hint("SceneObject with the Slider script attached")
    sliderObject!: SceneObject;

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
    private tapBound: boolean = false;

    onAwake(): void {
        this.sliderComponent = this.sliderObject.getComponent("Component.ScriptComponent");

        if (!this.sliderComponent || typeof this.sliderComponent.onValueUpdate?.add !== "function") {
            throw new Error("Slider script with onValueUpdate event not found.");
        }

        // Wait for first interaction
        this.sliderComponent.onValueUpdate.add(this.onSliderChanged);
    }

    private onSliderChanged = (value: number): void => {
        if (this.tapBound || this.hasSaved) return;

        // Bind to TapEvent instead of TouchEndEvent
        this.createEvent("TapEvent").bind(this.handleSliderRelease);
        print("TapEvent listener bound.");
        this.tapBound = true;
    }

    private handleSliderRelease = (): void => {
        if (this.hasSaved) return;

        const value = this.sliderComponent.currentValue ?? this.sliderComponent.startValue;
        const min = this.sliderComponent.minValue;
        const max = this.sliderComponent.maxValue;

        const t = MathUtils.clamp((value - min) / (max - min), 0, 1);
        const scaledValue = Math.round(1 + 9 * t);

        try {
            global.persistentStorageSystem.store.putInt(this.storageKey, scaledValue);
        } catch (e) {
            print(`Storage failed: ${e}`);
        }

        if (this.targetToDisable) {
            this.targetToDisable.enabled = false;
        }

        if (this.targetToEnable) {
            this.targetToEnable.enabled = true;
        }

        this.hasSaved = true;
    }
}
