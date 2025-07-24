@component
export class PersistentDisplay extends BaseScriptComponent {
    @input
    @hint("Reference to parent TS script that exposes controls SceneObject")
    parentScript!: any; // replace with 'SizeControlUI' type if defined

    @input
    @hint("Key used to look up the saved value in persistent storage")
    storageKey: string = "sliderSelection";

    @input
    @hint("Refresh interval in seconds")
    refreshIntervalSeconds: number = 2;

    private textComponent: any;
    private timeElapsed: number = 0;

    onStart(): void {
        const controls = this.parentScript?.controls;
        if (!controls || controls.getTypeName() !== "SceneObject") {
            throw new Error("❌ Could not access controls SceneObject from parent script.");
        }

        const persistentObj = controls.getChild("Persistent");
        if (!persistentObj) {
            throw new Error("❌ 'Persistent' child not found in controls.");
        }

        this.textComponent = persistentObj.getComponent("Component.Text") as any;
        if (!this.textComponent) {
            throw new Error("❌ 'Persistent' does not have a valid Text component.");
        }

        this.updateDisplay();
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

        if (value === 0) {
            this.textComponent.text = "No saved value yet";
            print(`ℹ️ '${this.storageKey}' is 0 or not set.`);
        } else {
            this.textComponent.text = `Saved Value: ${value}`;
            print(`🔁 Refreshed text: Saved Value: ${value}`);
        }
    }
}
