@component
export class SaveTextOnEnable extends BaseScriptComponent {
    @input
    targetTextObject!: SceneObject;

    @input
    storageKey: string = "savedText";

    onEnable(): void {
        const textComponent = this.targetTextObject.getComponent("Component.Text") as Text;

        if (!textComponent) {
            print("❌ Target object has no Text component.");
            return;
        }

        const textToSave = textComponent.text ?? "";
        try {
            global.persistentStorageSystem.store.putString(this.storageKey, textToSave);
            print(`✅ Saved text to storage under key "${this.storageKey}": ${textToSave}`);
        } catch (e) {
            print(`❌ Failed to save text: ${e}`);
        }
    }
}
