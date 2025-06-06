@component
export class DisplaySavedText extends BaseScriptComponent {
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

        let saved = "";
        try {
            saved = global.persistentStorageSystem.store.getString(this.storageKey);
        } catch (e) {
            print(`❌ Failed to retrieve saved text: ${e}`);
            return;
        }

        if (saved && saved.trim() !== "") {
            textComponent.text = `Journal Prompt: "${saved}"`;
            print(`📝 Displayed saved journal prompt: "${saved}"`);
        } else {
            textComponent.text = "Journal Prompt: [No saved prompt found]";
            print("⚠️ No saved text found in storage.");
        }
    }
}
