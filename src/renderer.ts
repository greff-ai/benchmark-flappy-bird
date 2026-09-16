import * as THREE from 'three';
import { COURSE, type SimulationState } from './simulation';

export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor('#86dce5');
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-300, 900, 380, -380, 1, 3000);
  camera.position.set(0, 0, 1000);
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const material = (color: string, roughness = 0.7) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness });
    materials.add(value);
    return value;
  };
  const yellow = material('#ffce39');
  const wingColor = material('#f4a923');
  const white = material('#fffef0');
  const ink = material('#173a3c');
  const coral = material('#f36e55');
  const green = material('#39a85e');
  const rimGreen = material('#70ca69');
  const darkGreen = material('#278651');
  const skyCloud = material('#d7f4ee');
  const distant = material('#73cbd0');
  const near = material('#52b9b1');
  const grass = material('#95d47c');
  const soil = material('#368c77');
  scene.add(new THREE.HemisphereLight('#ffffff', '#389688', 2.6));
  const sun = new THREE.DirectionalLight('#fff3c9', 3.1);
  sun.position.set(-300, 600, 800);
  scene.add(sun);

  function mesh(geometry: THREE.BufferGeometry, surface: THREE.Material, parent: THREE.Object3D,
    x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
    geometries.add(geometry);
    const item = new THREE.Mesh(geometry, surface);
    item.position.set(x, y, z);
    item.scale.set(sx, sy, sz);
    parent.add(item);
    return item;
  }
  const sphere = new THREE.SphereGeometry(1, 24, 16);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 40);
  const bird = new THREE.Group();
  scene.add(bird);
  mesh(sphere, yellow, bird, 0, 0, 0, 22, 19, 14);
  mesh(sphere, white, bird, 13, 7, 11, 9, 10, 5);
  mesh(sphere, ink, bird, 16, 8, 15, 3.4, 4.3, 2);
  mesh(sphere, white, bird, 15, 10, 17, 1.1, 1.2, 0.7);
  mesh(sphere, coral, bird, 25, -1, 3, 11, 5, 7);
  const wing = mesh(sphere, wingColor, bird, -6, -3, 14, 12, 7, 3);
  const tail = mesh(new THREE.ConeGeometry(8, 19, 4), yellow, bird, -25, 0, 0);
  tail.rotation.z = Math.PI / 2;
  mesh(sphere, yellow, bird, -4, 20, 0, 4, 10, 4).rotation.z = -0.4;
  mesh(sphere, yellow, bird, 3, 19, -1, 3, 8, 3).rotation.z = -0.2;

  const scenery = new THREE.Group();
  scene.add(scenery);
  for (let i = 0; i < 16; i++) {
    const x = -1600 + i * 250;
    const y = 190 + Math.sin(i * 3) * 90;
    const cloud = new THREE.Group();
    cloud.position.set(x, y, -230);
    scenery.add(cloud);
    for (let j = 0; j < 3; j++) mesh(sphere, skyCloud, cloud, j * 25, Math.sin(j * 2) * 9, 0, 34, 17 + j * 4, 12);
    mesh(sphere, distant, scenery, x + 80, -240, -160, 200, 130 + Math.sin(i) * 40, 30);
    mesh(sphere, near, scenery, x, -305, -100, 170, 90 + Math.cos(i) * 35, 24);
  }
  mesh(box, soil, scene, 400, -650, -5, 5000, 660, 100);
  mesh(box, grass, scene, 400, 380 - COURSE.floor - 6, 0, 5000, 12, 130);
  mesh(box, distant, scene, 400, 380 - COURSE.ceiling + 5, -10, 5000, 10, 50);
  for (let i = -30; i < 60; i++) {
    mesh(box, darkGreen, scene, i * 50, -343, 52, 20, 3, 1);
  }
  const pipeMeshes = new Map<number, THREE.Group>();
  function createPipe(center: number) {
    const group = new THREE.Group();
    const upper = center - COURSE.gap / 2;
    const lower = center + COURSE.gap / 2;
    for (const [top, bottom, lipY] of [
      [COURSE.ceiling - 600, upper, upper - 8],
      [lower, COURSE.floor + 600, lower + 8],
    ]) {
      mesh(cylinder, green, group, 0, 380 - (top + bottom) / 2, 0, 33, bottom - top, 33);
      mesh(cylinder, darkGreen, group, 0, 380 - lipY, 0, 38, 18, 38);
      mesh(cylinder, rimGreen, group, 0, 380 - lipY + 3, 0, 38, 12, 38);
    }
    scene.add(group);
    return group;
  }
  let bounds = { left: 0, right: 0, top: 0, bottom: 0 };
  return {
    resize(width: number, height: number, pixelRatio: number) {
      if (width <= 0 || height <= 0) return;
      const aspect = width / height;
      const viewHeight = Math.max(760, 480 / aspect);
      const viewWidth = viewHeight * aspect;
      camera.left = 300 - viewWidth / 2;
      camera.right = 300 + viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      bounds = { left: camera.left, right: camera.right, top: camera.top, bottom: camera.bottom };
      renderer.setPixelRatio(Math.min(pixelRatio, 2));
      renderer.setSize(width, height, false);
    },
    render(state: SimulationState, now = 0) {
      bird.position.set(state.bird.x, 380 - state.bird.y, 60);
      bird.rotation.z = -state.bird.angle;
      if (state.phase !== 'paused') wing.rotation.z = Math.sin(now * 0.025) * (state.phase === 'crashed' ? 0 : 0.4);
      if (state.phase === 'ready') bird.position.y += Math.sin(now * 0.0025) * 5;
      const ids = new Set(state.gates.map((gate) => gate.id));
      for (const [id, group] of pipeMeshes) {
        if (!ids.has(id)) { scene.remove(group); pipeMeshes.delete(id); }
      }
      for (const gate of state.gates) {
        let group = pipeMeshes.get(gate.id);
        // Restart reuses IDs, so center is part of the mesh's visual identity.
        if (group && group.userData.center !== gate.center) {
          scene.remove(group);
          pipeMeshes.delete(gate.id);
          group = undefined;
        }
        if (!group) {
          group = createPipe(gate.center);
          group.userData.center = gate.center;
          pipeMeshes.set(gate.id, group);
        }
        group.position.x = gate.x;
      }
      renderer.render(scene, camera);
    },
    getBounds() { return { ...bounds }; },
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      for (const surface of materials) surface.dispose();
      renderer.dispose();
    },
  };
}
