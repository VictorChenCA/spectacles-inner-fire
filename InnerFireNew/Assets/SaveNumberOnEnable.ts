@component
export class SaveNumberOnEnable extends BaseScriptComponent {
    @input
    valueToStore: number = 0;

    @input
    storageKey: string = "savedNumber";

    @input
    targetToEnable?: SceneObject;

    onEnable(): void {
        print("▶️ SaveNumberOnEnable.onEnable() running");

        if (typeof this.valueToStore !== "number" || isNaN(this.valueToStore)) {
            print(`❌ Invalid number input: ${this.valueToStore}`);
            return;
        }

        const value = Math.floor(this.valueToStore);

        try {
            global.persistentStorageSystem.store.putInt(this.storageKey, value);
            print(`✅ Stored number ${value} under key "${this.storageKey}"`);
        } catch (e) {
            print(`❌ Failed to store number: ${e}`);
            return;
        }

        if (this.targetToEnable) {
            this.targetToEnable.enabled = true;
            print(`✅ Enabled target object: ${this.targetToEnable.name}`);
        } else {
            print("⚠️ No targetToEnable assigned.");
        }
    }
}
