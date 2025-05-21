@component
export class PersistentDisplay extends BaseScriptComponent {
    @input
    @hint("Key used to look up the saved value in persistent storage")
    storageKey: string = "sliderSelection";

    onStart(): void {
        const text = this.getSceneObject().getComponent("Component.Text");
        if (!text) {
            print("PersistentDisplay error: Text component not found on object.");
            return;
        }

        const store = global.persistentStorageSystem.store;
        const value = store.getInt(this.storageKey);
        text.text = `Saved Value: ${value}`;
        print(`PersistentDisplay loaded value: ${value}`);
    }
}
