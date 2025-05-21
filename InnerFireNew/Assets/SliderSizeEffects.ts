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

    @input
    @hint("Override starting value of the slider. Leave blank to use slider default.")
    startValue: number = NaN

    private transform!: Transform
    private sliderComponent: any
    private originalY: number = 0

    onAwake(): void {
        this.transform = this.targetObject.getTransform()
        this.originalY = this.transform.getLocalPosition().y

        this.sliderComponent = this.sliderObject.getComponent("Component.ScriptComponent")

        if (!this.sliderComponent || typeof this.sliderComponent.onValueUpdate?.add !== "function") {
            throw new Error("Slider script with onValueUpdate event not found on the provided SceneObject.")
        }

        this.createEvent("OnStartEvent").bind(() => {
            const value = isNaN(this.startValue)
                ? this.sliderComponent.currentValue ?? this.sliderComponent.startValue
                : this.startValue

            this.handleSliderUpdate(value)
            this.sliderComponent.onValueUpdate.add(this.handleSliderUpdate)
        })
    }

    private handleSliderUpdate = (value: number): void => {
        const min = this.sliderComponent.minValue
        const max = this.sliderComponent.maxValue
        const t = MathUtils.clamp((value - min) / (max - min), 0, 1)

        const scale = (this.minScale + (this.maxScale - this.minScale) * t) * 20
        this.transform.setLocalScale(new vec3(scale, scale, scale))

        const offsetY = 4 * t
        const pos = this.transform.getLocalPosition()
        this.transform.setLocalPosition(new vec3(pos.x, this.originalY + offsetY, pos.z))
    }
}
