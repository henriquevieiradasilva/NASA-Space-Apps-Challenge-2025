import * as THREE from "three";

export function addPulseMarkerLoop(earthMesh, latDeg, lonDeg, opts = {}) {
    const color = opts.color ?? 0xff3333;
    const baseOuter = opts.baseOuter ?? 0.18;
    const minScale = opts.minScale ?? 0;
    const maxScale = opts.maxScale ?? 1;
    const period = opts.period ?? 250;
    const edge = opts.edge ?? 0.06;
    const flipLongitude = opts.flipLongitude !== undefined ? opts.flipLongitude : true;

    if (earthMesh.geometry && !earthMesh.geometry.boundingSphere)
        earthMesh.geometry.computeBoundingSphere();

    const baseRadius =
        earthMesh.geometry && earthMesh.geometry.boundingSphere
            ? earthMesh.geometry.boundingSphere.radius
            : 1;

    const worldScale = earthMesh.scale?.x ?? 1;
    const radius = baseRadius * worldScale + 0.001;

    const lat = THREE.MathUtils.degToRad(latDeg);
    const correctedLonDeg = flipLongitude ? -lonDeg : lonDeg;
    const lon = THREE.MathUtils.degToRad(correctedLonDeg);

    const x = radius * Math.cos(lat) * Math.cos(lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lon);
    const desiredWorldPos = new THREE.Vector3(x, y, z);

    const localPos = earthMesh.worldToLocal(desiredWorldPos.clone());
    const normalLocal = localPos.clone().normalize();

    const markerGroup = new THREE.Group();
    markerGroup.position.copy(localPos);

    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normalLocal);
    markerGroup.quaternion.copy(quat);

    earthMesh.add(markerGroup);

    const uniforms = {
        u_color: { value: new THREE.Color(color) },
        u_inner: { value: 0.0 },
        u_outer: { value: baseOuter },
        u_edge: { value: edge },
        u_opacity: { value: 1.0 },
    };

    const vs = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fs = `
    uniform vec3 u_color;
    uniform float u_inner;
    uniform float u_outer;
    uniform float u_edge;
    uniform float u_opacity;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv - vec2(0.5);
      float d = length(uv) * 2.0;
      float e = max(0.0001, u_edge);

      float outerMask = 1.0 - smoothstep(u_outer - e, u_outer + e, d);
      float innerMask;
      if (u_inner <= 0.0001) {
        innerMask = 1.0;
      } else {
        innerMask = smoothstep(u_inner - e, u_inner + e, d);
      }
      float alpha = outerMask * innerMask;
      if (alpha < 0.001) discard;
      gl_FragColor = vec4(u_color, alpha * u_opacity);
    }
  `;

    const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
    });
    const geom = new THREE.PlaneGeometry(1, 1, 1, 1);
    const mesh = new THREE.Mesh(geom, mat);

    mesh.rotateX(-Math.PI / 2);
    mesh.position.z = 0.0005;
    markerGroup.add(mesh);

    let disposed = false;
    let rafId = null;
    const startTime = performance.now();

    function loop(now) {
        if (disposed) return;
        const elapsed = now - startTime;
        const t = (elapsed % period) / period;

        const progress = 0.5 - 0.5 * Math.cos(2.0 * Math.PI * t);
        const innerFrac = Math.sin(Math.PI * t);
        const innerVal = innerFrac * 0.85 * baseOuter;

        const s = minScale + (maxScale - minScale) * progress;
        const opacity = 1.0 - 0.4 * progress;

        uniforms.u_inner.value = innerVal;
        uniforms.u_outer.value = baseOuter;
        uniforms.u_opacity.value = opacity;
        mesh.scale.set(s, s, s);

        rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    function dispose() {
        disposed = true;
        if (rafId) cancelAnimationFrame(rafId);
        mesh.geometry.dispose();
        mesh.material.dispose();
        markerGroup.removeFromParent();
    }

    return { group: markerGroup, dispose };
}
