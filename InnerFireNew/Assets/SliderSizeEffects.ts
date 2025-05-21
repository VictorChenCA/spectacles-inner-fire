@component
export class SliderSizeEffects extends BaseScriptComponent {
    /**
     * The object to resize based on the slider value.
     */
    @input
    @hint("SceneObject to scale based on the slider's value.")
    targetObject!: SceneObject

    /**
     * The SceneObject that has the Slider script attached.
     */
    @input
    @hint("SceneObject with the Slider script attached.")
    sliderObject!: SceneObject

    /**
     * Minimum scale of the target object.
     */
    @input
    minScale: number = 0.5

    /**
     * Maximum scale of the target object.
     */
    @input
    maxScale: number = 2.0

    private transform!: Transform
    private slider: any // No static typing here since we're not importing the class

    onAwake(): void {
        this.transform = this.targetObject.getTransform()

        // Dynamically fetch the Slider script (assumes only one script is attached)
        this.slider = this.sliderObject.getFirstComponent("Component.ScriptComponent")

        if (!this.slider || typeof this.slider.onValueUpdate?.add !== "function") {
            throw new Error("Slider script with onValueUpdate event not found on the provided SceneObject.")
        }

        this.createEvent("OnStartEvent").bind(() => {
            const value = this.slider.currentValue ?? this.slider.startValue
            this.handleSliderUpdate(value)
            this.slider.onValueUpdate.add(this.handleSliderUpdate)
        })
    }

    private handleSliderUpdate = (value: number): void => {
        const min = this.slider.minValue
        const max = this.slider.maxValue
        const t = MathUtils.clamp((value - min) / (max - min), 0, 1)
        const scale = (this.minScale + (this.maxScale - this.minScale) * t) * 20
        this.transform.setLocalScale(new vec3(scale, scale, scale))
    }
}
