import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class EnableObjectOnTriggerEnd extends BaseScriptComponent {
    @input
    targetToEnable!: SceneObject;

    private interactable: Interactable;

    onAwake() {
        this.interactable = this.sceneObject.getComponent(Interactable.getTypeName());

        if (!this.interactable) {
            throw new Error("❌ No Interactable component found on this object.");
        }

        this.interactable.onTriggerEnd.add(() => {
            if (this.targetToEnable) {
                this.targetToEnable.enabled = true;
                print(`✅ Enabled object: ${this.targetToEnable.name}`);
            } else {
                print("⚠️ targetToEnable is not assigned.");
            }
        });
    }
}
