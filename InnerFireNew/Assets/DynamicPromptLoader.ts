@component
export class DisplaySelectedPrompt extends BaseScriptComponent {
    @input targetTextObject!: SceneObject;

    @input sliderKey: string = "sliderSelection";
    @input promptKey: string = "promptChoice";

    onAwake(): void {

        if (!this.targetTextObject) {
            print("❌ No targetTextObject assigned.");
            return;
        }

        const textComponent = this.targetTextObject.getComponent("Component.Text") as Text;
        if (!textComponent) {
            print("❌ Target object has no Text component.");
            return;
        }

        let sliderVal = 1;
        let promptIndex = 0;

        try {
            sliderVal = global.persistentStorageSystem.store.getInt(this.sliderKey);
            promptIndex = global.persistentStorageSystem.store.getInt(this.promptKey);
        } catch (e) {
            print(`⚠️ Could not retrieve saved values: ${e}`);
            return;
        }

        print(`📦 sliderSelection = ${sliderVal}, promptChoice = ${promptIndex}`);

        // Determine group index (0–4)
        let group = 0;
        if (sliderVal <= 2) group = 0;
        else if (sliderVal <= 4) group = 1;
        else if (sliderVal <= 6) group = 2;
        else if (sliderVal <= 8) group = 3;
        else group = 4;

        // Clamp prompt index to 0–2
        const i = Math.min(2, Math.max(0, Math.round(promptIndex)));
        print(`📊 Group: ${group}, Prompt Index: ${i}`);

        const prompts = [
            [ // Group 0: 1–2
                "What’s one thing that felt especially hard today,\nand how did that experience affect you?",
                "Even in today’s difficulty, was there a moment\nwhen you showed strength by just continuing?",
                "If someone else were feeling this way,\nwhat would you want them to hear or know?"
            ],
            [ // Group 1: 3–4
                "What small moment offered you a brief pause,\nor comfort today—even if it was fleeting?",
                "What’s something you wish had gone differently,\nand how might you approach it next time?",
                "Is there someone you could talk to or check in with,\nnot to fix things, just to feel less alone?"
            ],
            [ // Group 2: 5–6
                "What helped you stay grounded or feel okay\nduring the course of today?",
                "Was there a moment that could’ve tipped either way—\nwhat helped it stay steady or joyful?",
                "Who or what helped you stay emotionally balanced,\nand how might you acknowledge that support?"
            ],
            [ // Group 3: 7–8
                "What brought you a sense of joy or ease today,\nand what made that feel meaningful?",
                "What part of yourself contributed most to that feeling—\nkindness, courage, focus, or something else?",
                "How could you share today’s insight or momentum\nwith someone else in your life?"
            ],
            [ // Group 4: 9–10
                "What’s one thing that made you smile today,\nand why did it feel meaningful to you?",
                "How might you share this joy or light\nwith someone else in your world?",
                "What strengths or qualities in yourself\nhelped create your happiness today?"
            ]
        ];

        const selectedPrompt = prompts[group][i];

        textComponent.text = selectedPrompt;
        print(`📝 Loaded ${selectedPrompt}`);
    }
}
