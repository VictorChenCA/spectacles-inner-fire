@component
export class DisplaySavedText extends BaseScriptComponent {
    @input
    targetTextObject!: SceneObject;

    @input
    sliderKey: string = "sliderSelection";

    @input
    promptIndexKey: string = "savedNumber";

    // External scripts can call this via: someObject.getComponent("Component.ScriptComponent")?.api.showPrompt()
    public showPrompt(): void {
        if (!this.targetTextObject) {
            print("❌ No targetTextObject assigned.");
            return;
        }

        const textComponent = this.targetTextObject.getComponent("Component.Text") as Text;
        if (!textComponent) {
            print("❌ Target object has no Text component.");
            return;
        }

        let sliderValue: number;
        let promptIndex: number;

        try {
            sliderValue = global.persistentStorageSystem.store.getInt(this.sliderKey);
            promptIndex = global.persistentStorageSystem.store.getInt(this.promptIndexKey);
        } catch (e) {
            print(`❌ Failed to retrieve saved data: ${e}`);
            textComponent.text = "Journal Prompt: [Error reading saved data]";
            return;
        }

        const idx = MathUtils.clamp(promptIndex - 1, 0, 2);

        let tier = 0;
        if (sliderValue <= 2) tier = 0;
        else if (sliderValue <= 4) tier = 1;
        else if (sliderValue <= 6) tier = 2;
        else if (sliderValue <= 8) tier = 3;
        else tier = 4;

        const prompts = [
            [
                "What’s one thing that felt especially hard today, and how did that experience affect you?",
                "Even in today’s difficulty, was there a moment when you showed strength by just continuing?",
                "If someone else were feeling this way, what would you want them to hear or know?"
            ],
            [
                "What small moment offered you a brief pause, or comfort today—even if it was fleeting?",
                "What’s something you wish had gone differently, and how might you approach it next time?",
                "Is there someone you could talk to or check in with, not to fix things, just to feel less alone?"
            ],
            [
                "What helped you stay grounded or feel okay during the course of today?",
                "Was there a moment that could’ve tipped either way—what helped it stay steady or joyful?",
                "Who or what helped you stay emotionally balanced, and how might you acknowledge that support?"
            ],
            [
                "What brought you a sense of joy or ease today, and what made that feel meaningful?",
                "What part of yourself contributed most to that feeling—kindness, courage, focus, or something else?",
                "How could you share today’s insight or momentum with someone else in your life?"
            ],
            [
                "What’s one thing that made you smile today, and why did it feel meaningful to you?",
                "How might you share this joy or light with someone else in your world?",
                "What strengths or qualities in yourself helped create your happiness today?"
            ]
        ];

        const prompt = prompts[tier]?.[idx] ?? "[No matching prompt found]";
        textComponent.text = `Journal Prompt: "${prompt}"`;
        print(`📝 Displayed saved journal prompt from tier ${tier + 1}, index ${idx + 1}: "${prompt}"`);
    }
}
