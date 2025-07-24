// -----JS CODE-----
// AttachToObjectTracking.js
// Version: 0.0.2
// Event: Initialized
// Description: Attach a 3D object to an Object or Image Tracking object with tunable depth

// @input Component.Camera perspectiveCamera
// @input Component.Component objectTracking  // now accepts either ObjectTracking or ImageTracking
// @input SceneObject objectToAttach
// @input float baseDepthFactor = 250
// @input bool applyRotation = true

var screenTransform = null;

// Support both ObjectTracking and ImageTracking
if (script.objectTracking && script.objectTracking.screenTransform) {
    screenTransform = script.objectTracking.screenTransform;
} else if (script.objectTracking.getSceneObject) {
    screenTransform = script.objectTracking.getSceneObject().getFirstComponent("ScreenTransform");
}

if (!screenTransform) {
    print("Error: Could not find valid ScreenTransform from tracking component.");
    return;
}

function anchorSpaceToScreenSpace(point) {
    return new vec2(
        (point.x * 0.5) + 0.5,
        (-point.y * 0.5) + 0.5
    );
}

function onUpdate() {
    if (script.objectTracking.isTracking()) {
        script.objectToAttach.enabled = true;

        var anchors = screenTransform.anchors;
        var center = anchors.getCenter();
        var size = anchors.getSize();
        var rotation = screenTransform.rotation;

        var screenPos = anchorSpaceToScreenSpace(center);

        var lenSquared = size.length + 1;
        lenSquared = lenSquared * lenSquared;
        lenSquared -= 1;

        var depth = script.baseDepthFactor / lenSquared;

        var worldPos = script.perspectiveCamera.screenSpaceToWorldSpace(screenPos, depth);

        script.objectToAttach.getTransform().setWorldPosition(worldPos);

        if (script.applyRotation) {
            script.objectToAttach.getTransform().setWorldRotation(rotation);
        }
    } else {
        script.objectToAttach.enabled = false;
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
