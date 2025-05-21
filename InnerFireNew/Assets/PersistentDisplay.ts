@component
export class PersistentDisplay extends BaseScriptComponent {
    @input
    @hint("Text component to update")
    textComponent!: Component;

    @input
    @hint("Key used to look up the saved value in persistent storage")
    storageKey: string = "sliderSelection";

    @input
    @hint("Refresh interval in seconds")
    refreshIntervalSeconds: number = 2;

    private timeElapsed: number = 0;

    onStart(): void {
        if (!this.textComponent || this.textComponent.getTypeName() !== "Component.Text") {
            throw new Error("❌ Provided component is not a valid Text component.");
        }

        // Do initial update immediately
        this.updateDisplay();

        // Set up update loop
        this.createEvent("UpdateEvent").bind(this.onUpdate);
    }

    private onUpdate = (eventData: any): void => {
        const deltaTime = eventData.getDeltaTime();
        this.timeElapsed += deltaTime;

        if (this.timeElapsed >= this.refreshIntervalSeconds) {
            this.updateDisplay();
            this.timeElapsed = 0;
        }
    };

    private updateDisplay(): void {
        const store = global.persistentStorageSystem.store;
        const value = store.getInt(this.storageKey);

        const textComp = this.textComponent as any;
        if (value === 0) {
            textComp.text = "No saved value yet";
            print(`ℹ️ '${this.storageKey}' is 0 or not set.`);
        } else {
            textComp.text = `Saved Value: ${value}`;
            print(`🔁 Refreshed text: Saved Value: ${value}`);
        }
    }
}
