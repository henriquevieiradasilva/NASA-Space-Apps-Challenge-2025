import * as THREE from "three";

export function initFocusOnMarker(camera, controls, earthMesh, markerGroup, duration = 1000) {

    let isAnimating = false;

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "t") {
            if (!isAnimating) {
                if (earthMesh.userData.rotating && !earthMesh.userData.rotationLocked) {
                    earthMesh.userData.rotating = false;
                    earthMesh.userData.rotationLocked = true;
                    if (earthMesh.parent) {
                        earthMesh.parent.children.forEach(child => {
                            if (child !== earthMesh && child.userData) {
                                child.userData.rotating = false;
                                child.userData.rotationLocked = true;
                            }
                        });
                    }
                }
                focusSmooth();
            }
        }
    });

    function focusSmooth() {
        isAnimating = true;

        const targetWorldPos = new THREE.Vector3();
        markerGroup.getWorldPosition(targetWorldPos);

        const center = new THREE.Vector3();
        earthMesh.getWorldPosition(center);

        const dir = targetWorldPos.clone().sub(center).normalize();
        const camOffset = camera.position.clone().sub(center);
        const distance = camOffset.length();

        const finalPos = center.clone().add(dir.multiplyScalar(distance));
        const startPos = camera.position.clone();
        const startTime = performance.now();

        function animate() {
            const now = performance.now();
            const t = Math.min((now - startTime) / duration, 1);
            const ease = t * t * (3 - 2 * t);

            camera.position.lerpVectors(startPos, finalPos, ease);
            controls.target.copy(center);
            controls.update();

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                isAnimating = false;
            }
        }

        requestAnimationFrame(animate);
    }
}
