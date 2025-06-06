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
            p1.text = "What’s one thing that felt especially hard today,\nand how did it affect you?";
            p2.text = "Even in today’s difficulty, was there a moment\nwhere you showed strength just by continuing?";
            p3.text = "If someone else were feeling the way you are,\nwhat would you want them to hear or know?";
        } else if (value <= 4) {
            p1.text = "What small moment offered you a brief pause or comfort today,\neven if it was fleeting?";
            p2.text = "What’s something you wish had gone differently today—\nand how might you approach it next time?";
            p3.text = "Is there someone you could talk to or check in with,\nnot to fix things, but just to feel less alone?";
        } else if (value <= 6) {
            p1.text = "What kept you feeling grounded or okay today?";
            p2.text = "Was there a moment that could have tipped toward joy or frustration—\nwhat made the difference?";
            p3.text = "Who or what helped sustain your emotional balance,\nand how might you acknowledge that support?";
        } else if (value <= 8) {
            p1.text = "What brought you a sense of joy or ease today,\nand what made it meaningful?";
            p2.text = "What part of yourself contributed most to your happiness—\nkindness, effort, courage?";
            p3.text = "How could you share today’s joy, insight,\nor momentum with someone else in your life?";
        } else {
            p1.text = "What’s one thing that made you smile today,\nand why did it feel meaningful?";
            p2.text = "How can you share this joy or light\nwith someone else in your life?";
            p3.text = "What strengths or qualities in yourself\ncontributed to your happiness today?";
        }
    }
}
