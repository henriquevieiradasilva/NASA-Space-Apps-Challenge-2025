import * as THREE from "three";

export default function initClickPlanet({ domElement, camera, earthMesh, glowMesh, controls } = {}) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isPointerDown = false;
    let lastPointerDownTime = 0;
    const clickThresholdMs = 200;
    let isDragging = false;

    if (typeof earthMesh.userData.rotating === "undefined") earthMesh.userData.rotating = true;
    if (typeof earthMesh.userData.rotationLocked === "undefined") earthMesh.userData.rotationLocked = false;

    if (glowMesh) {
        if (typeof glowMesh.userData.rotating === "undefined") glowMesh.userData.rotating = earthMesh.userData.rotating;
        if (typeof glowMesh.userData.rotationLocked === "undefined") glowMesh.userData.rotationLocked = earthMesh.userData.rotationLocked;
    }

    function syncLockAndRotating(toRotating, toLocked) {
        earthMesh.userData.rotating = toRotating;
        earthMesh.userData.rotationLocked = toLocked;
        if (glowMesh) {
            glowMesh.userData.rotating = toRotating;
            glowMesh.userData.rotationLocked = toLocked;
        }
    }

    function updatePointer(event) {
        const rect = domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerMove(event) {
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(earthMesh, true);
        if (intersects.length > 0) {
            domElement.style.cursor = "pointer";
        } else {
            domElement.style.cursor = "";
        }
    }

    function onPointerDown(event) {
        isPointerDown = true;
        lastPointerDownTime = performance.now();
    }

    function onPointerUp(event) {
        const now = performance.now();
        const dt = now - lastPointerDownTime;
        isPointerDown = false;

        if (isDragging) {
            return;
        }

        if (dt > clickThresholdMs) return;

        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(earthMesh, true);
        if (intersects.length > 0) {
            if (earthMesh.userData.rotating && !earthMesh.userData.rotationLocked) {
                syncLockAndRotating(false, true);
            }
        }
    }

    function onControlsStart() {
        isDragging = true;
        if (earthMesh.userData.rotating && !earthMesh.userData.rotationLocked) {
            syncLockAndRotating(false, true);
        }
    }

    function onControlsEnd() {
        isDragging = false;
    }

    domElement.addEventListener("pointermove", onPointerMove, { passive: true });
    domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
    domElement.addEventListener("pointerup", onPointerUp, { passive: true });

    if (controls && typeof controls.addEventListener === "function") {
        controls.addEventListener("start", onControlsStart);
        controls.addEventListener("end", onControlsEnd);
    }

    function dispose() {
        domElement.removeEventListener("pointermove", onPointerMove);
        domElement.removeEventListener("pointerdown", onPointerDown);
        domElement.removeEventListener("pointerup", onPointerUp);
        if (controls && typeof controls.removeEventListener === "function") {
            controls.removeEventListener("start", onControlsStart);
            controls.removeEventListener("end", onControlsEnd);
        }
        domElement.style.cursor = "";
    }

    return { dispose };
}