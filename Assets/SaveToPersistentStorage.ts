@component
export class SaveToPersistentStorage extends BaseScriptComponent {
    @input
    valueToSave: number = 0;

    @input
    storageKey: string = "promptChoice";

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => {
            const component = this.getSceneObject().getFirstComponent("Component.ScriptComponent");
            if (!component || typeof component["onTriggerEnd"]?.add !== "function") {
                throw new Error("No valid Interactable component with onTriggerEnd event found.");
            }

            component["onTriggerEnd"].add(this.handleTriggerEnd);
        });
    }

    private handleTriggerEnd = (): void => {
        try {
            global.persistentStorageSystem.store.putInt(this.storageKey, this.valueToSave);
            print(`💾 Saved ${this.valueToSave} to persistent storage with key "${this.storageKey}"`);
        } catch (e) {
            print("❌ Error saving to persistent storage: " + e);
        }
    };
}
