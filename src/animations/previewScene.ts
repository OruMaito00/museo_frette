import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import type { GridItemData } from '../types';

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let cards: THREE.Mesh[] = [];
let rafId = 0;
let container: HTMLElement | null = null;

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generatePositions(count: number, spread = 6): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const minDist = 3;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let pos: THREE.Vector3;

    do {
      const sx = seededRandom(i * 7 + attempts);
      const sy = seededRandom(i * 13 + attempts + 1);
      const sz = seededRandom(i * 19 + attempts + 2);
      pos = new THREE.Vector3(
        (sx - 0.5) * spread * 2,
        (sy - 0.5) * spread * 1.5,
        (sz - 0.5) * spread * 1.8
      );
      attempts++;
    } while (
      positions.some((p) => p.distanceTo(pos) < minDist) && attempts < 50
    );

    positions.push(pos);
  }

  return positions;
}

function billboardCards(): void {
  if (!camera) return;
  cards.forEach((card) => {
    card.quaternion.copy(camera!.quaternion);
  });
}

function animateLoop(): void {
  rafId = requestAnimationFrame(animateLoop);
  controls?.update();
  billboardCards();
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function handleResize(): void {
  if (!container || !camera || !renderer) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

export function showPreviewScene(
  el: HTMLElement,
  gridItems: GridItemData[]
): Promise<void> {
  return new Promise((resolve) => {
    disposeActiveScene();

    container = el;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0f0e0e, 1);
    el.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 18;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 40;

    const positions = generatePositions(gridItems.length);
    const textureLoader = new THREE.TextureLoader();
    const cardWidth = 2.2;
    const cardHeight = 2.75;

    cards = gridItems.map((item, i) => {
      const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const texture = textureLoader.load(item.image);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.scale.set(0, 0, 0);
      mesh.userData = {
        targetPosition: positions[i],
        targetScale: 1,
      };

      scene!.add(mesh);
      return mesh;
    });

    animateLoop();

    const maxDist = Math.max(
      ...cards.map((c) => c.userData.targetPosition.length())
    );
    const tl = gsap.timeline({
      onComplete: () => {
        resolve();
      },
    });

    cards.forEach((card) => {
      const dist = card.userData.targetPosition.length();
      const norm = maxDist > 0 ? dist / maxDist : 0;
      const delay = norm * 0.35;

      tl.to(
        card.position,
        {
          x: card.userData.targetPosition.x,
          y: card.userData.targetPosition.y,
          z: card.userData.targetPosition.z,
          duration: 0.9,
          ease: 'power3.out',
        },
        delay
      );

      tl.to(
        card.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.9,
          ease: 'power3.out',
        },
        delay
      );

      tl.to(
        card.material as THREE.MeshBasicMaterial,
        {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        },
        delay + 0.05
      );
    });

    window.addEventListener('resize', handleResize);
  });
}

export function hidePreviewScene(): Promise<void> {
  return new Promise((resolve) => {
    if (!cards.length) {
      disposeActiveScene();
      resolve();
      return;
    }

    const maxDist = Math.max(
      ...cards.map((c) => c.userData.targetPosition.length())
    );

    const tl = gsap.timeline({
      onComplete: () => {
        disposeActiveScene();
        resolve();
      },
    });

    cards.forEach((card) => {
      const dist = card.userData.targetPosition.length();
      const norm = maxDist > 0 ? dist / maxDist : 0;
      const delay = (1 - norm) * 0.3;

      tl.to(
        card.position,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.7,
          ease: 'power3.in',
        },
        delay
      );

      tl.to(
        card.scale,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.7,
          ease: 'power3.in',
        },
        delay
      );

      tl.to(
        card.material as THREE.MeshBasicMaterial,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        },
        delay
      );
    });
  });
}

export function disposeActiveScene(): void {
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', handleResize);
  controls?.dispose();

  cards.forEach((card) => {
    card.geometry.dispose();
    const mat = card.material as THREE.MeshBasicMaterial;
    mat.map?.dispose();
    mat.dispose();
  });
  cards = [];

  renderer?.dispose();
  if (
    renderer?.domElement &&
    container &&
    renderer.domElement.parentNode === container
  ) {
    container.removeChild(renderer.domElement);
  }

  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  container = null;
}
