@component
export class SliderSizeEffects extends BaseScriptComponent {
    @input
    @hint("SceneObject to scale based on the slider's value.")
    targetObject!: SceneObject

    @input
    @hint("SceneObject with the Slider script attached.")
    sliderObject!: SceneObject

    @input
    minScale: number = 0.5

    @input
    maxScale: number = 2.0

    private transform!: Transform
    private slider: any
    private originalY: number = 0

    onAwake(): void {
        this.transform = this.targetObject.getTransform()
        this.originalY = this.transform.getLocalPosition().y

        this.slider = this.sliderObject.getComponent("Component.ScriptComponent")

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

        const offsetY = 4 * t
        const pos = this.transform.getLocalPosition()
        this.transform.setLocalPosition(new vec3(pos.x, this.originalY + offsetY, pos.z))
    }
}
