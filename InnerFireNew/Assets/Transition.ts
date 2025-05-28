@component
export class Transition extends BaseScriptComponent {
    @input
    private enableObjectA?: SceneObject;

    @input
    private enableObjectB?: SceneObject;

    @input
    private disableObjectA?: SceneObject;

    @input
    private disableObjectB?: SceneObject;

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
            if (this.enableObjectA) this.enableObjectA.enabled = true;
            if (this.enableObjectB) this.enableObjectB.enabled = true;
            if (this.disableObjectA) this.disableObjectA.enabled = false;
            if (this.disableObjectB) this.disableObjectB.enabled = false;
        } catch (e) {
            print("Transition error: " + e);
        }
    };
}
