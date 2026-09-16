import * as THREE from 'three';
import type { SimulationState } from './simulation';

export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#eff5f2');
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 20);
  camera.position.z = 8;

  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-3, 4, 5);
  scene.add(light);

  const geometry = new THREE.IcosahedronGeometry(0.42, 1);
  const material = new THREE.MeshStandardMaterial({ color: '#f05244', roughness: 0.6, flatShading: true });
  const object = new THREE.Mesh(geometry, material);
  scene.add(object);

  const anchorGeometry = new THREE.SphereGeometry(0.065, 16, 12);
  const anchorMaterial = new THREE.MeshBasicMaterial({ color: '#186d67' });
  const anchor = new THREE.Mesh(anchorGeometry, anchorMaterial);
  anchor.position.y = 0.8;
  scene.add(anchor);

  const tetherGeometry = new THREE.BufferGeometry();
  const endpoints = new Float32Array([0, 0.8, 0, 0, 0, 0]);
  tetherGeometry.setAttribute('position', new THREE.BufferAttribute(endpoints, 3));
  const tetherMaterial = new THREE.LineBasicMaterial({ color: '#186d67' });
  scene.add(new THREE.Line(tetherGeometry, tetherMaterial));

  return {
    resize(width: number, height: number, pixelRatio: number) {
      if (width <= 0 || height <= 0) return;
      const aspect = width / height;
      const halfHeight = Math.max(2.6, 2.6 / aspect);
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(pixelRatio, 2));
      renderer.setSize(width, height, false);
    },
    render(state: SimulationState) {
      object.position.set(state.x / 100, 0.8 - state.y / 100, 0);
      object.rotation.z = state.angle;
      endpoints[3] = object.position.x;
      endpoints[4] = object.position.y;
      tetherGeometry.attributes.position.needsUpdate = true;
      tetherGeometry.computeBoundingSphere();
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      anchorGeometry.dispose();
      anchorMaterial.dispose();
      tetherGeometry.dispose();
      tetherMaterial.dispose();
      renderer.dispose();
    },
  };
}
