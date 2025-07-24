@component
export class NewScript extends BaseScriptComponent {
    @input prompt1!: SceneObject;
    @input prompt2!: SceneObject;
    @input prompt3!: SceneObject;

    @input storageKey: string = "sliderSelection";

    onAwake() {
        const p1 = this.prompt1.getComponent("Component.Text") as Text;
        const p2 = this.prompt2.getComponent("Component.Text") as Text;
        const p3 = this.prompt3.getComponent("Component.Text") as Text;

        if (!p1 || !p2 || !p3) {
            print("❌ Error: One or more Text components are missing.");
            return;
        }

        let value: number;

        try {
            value = global.persistentStorageSystem.store.getInt(this.storageKey);
        } catch (e) {
            print(`⚠️ Could not retrieve slider value: ${e}`);
            return;
        }

        print(`📦 Retrieved sliderSelection: ${value}`);

        if (value <= 2) {
            p1.text = "What’s one thing that felt especially hard today,\nand how did that experience affect you?";
            p2.text = "Even in today’s difficulty, was there a moment\nwhen you showed strength by just continuing?";
            p3.text = "If someone else were feeling this way,\nwhat would you want them to hear or know?";
        } else if (value <= 4) {
            p1.text = "What small moment offered you a brief pause,\nor comfort today—even if it was fleeting?";
            p2.text = "What’s something you wish had gone differently,\nand how might you approach it next time?";
            p3.text = "Is there someone you could talk to or check in with,\nnot to fix things, just to feel less alone?";
        } else if (value <= 6) {
            p1.text = "What helped you stay grounded or feel okay\nduring the course of today?";
            p2.text = "Was there a moment that could’ve tipped either way—\nwhat helped it stay steady or joyful?";
            p3.text = "Who or what helped you stay emotionally balanced,\nand how might you acknowledge that support?";
        } else if (value <= 8) {
            p1.text = "What brought you a sense of joy or ease today,\nand what made that feel meaningful?";
            p2.text = "What part of yourself contributed most to that feeling—\nkindness, courage, focus, or something else?";
            p3.text = "How could you share today’s insight or momentum\nwith someone else in your life?";
        } else {
            p1.text = "What’s one thing that made you smile today,\nand why did it feel meaningful to you?";
            p2.text = "How might you share this joy or light\nwith someone else in your world?";
            p3.text = "What strengths or qualities in yourself\nhelped create your happiness today?";
        }        
    }
}
