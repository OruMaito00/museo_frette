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
let previewRoot: HTMLElement | null = null;
let raycaster: THREE.Raycaster | null = null;
const pointer = new THREE.Vector2();
let focusedCard: THREE.Mesh | null = null;
let activeTag: string | null = null;
let isBusy = false;
let cameraTweenTarget: gsap.core.Tween | null = null;
let cameraTweenPos: gsap.core.Tween | null = null;

const CARD_WIDTH = 2.2;
const CARD_HEIGHT = 2.75;
const DEFAULT_CAMERA_Z = 18;
const FOV = 60;

// Click-to-focus / restore transition timing. Slow, symmetric ease-in-out so
// the camera settles instead of snapping.
const FOCUS_CAMERA_DURATION = 1.6;
const FOCUS_FADE_DURATION = 1.4;
const FOCUS_EASE = 'power2.inOut';

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

function generateClusterPositions(count: number): THREE.Vector3[] {
  const cols = Math.ceil(Math.sqrt(count));
  const spacing = 3.2;
  const positions: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = (seededRandom(i * 3) - 0.5) * 0.4;
    const jitterY = (seededRandom(i * 5 + 1) - 0.5) * 0.4;
    const jitterZ = (seededRandom(i * 7 + 2) - 0.5) * 0.6;
    const x = (col - (cols - 1) / 2) * spacing + jitterX;
    const y = -(row - (Math.ceil(count / cols) - 1) / 2) * spacing + jitterY;
    const z = jitterZ;
    positions.push(new THREE.Vector3(x, y, z));
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

function syncControlMode(): void {
  if (!controls) return;
  if (focusedCard) {
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
  } else if (activeTag) {
    // Left-drag must map to PAN — default LEFT is ROTATE, so enablePan alone does nothing
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
  } else {
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
  }
}

function killCameraTweens(): void {
  cameraTweenTarget?.kill();
  cameraTweenPos?.kill();
  cameraTweenTarget = null;
  cameraTweenPos = null;
}

function dispatchPreviewEvent(name: string, detail?: unknown): void {
  if (!previewRoot) return;
  previewRoot.dispatchEvent(
    new CustomEvent(`preview:${name}`, { detail, bubbles: true })
  );
}

let pointerDownPos = { x: 0, y: 0 };
let isDragging = false;

function handlePointerDown(e: PointerEvent): void {
  if (isBusy || !renderer) return;
  pointerDownPos = { x: e.clientX, y: e.clientY };
  isDragging = false;
  renderer.domElement.addEventListener('pointermove', handlePointerMove);
  renderer.domElement.addEventListener('pointerup', handlePointerUp);
}

function handlePointerMove(e: PointerEvent): void {
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  if (Math.sqrt(dx * dx + dy * dy) > 5) {
    isDragging = true;
  }
}

function handlePointerUp(e: PointerEvent): void {
  if (!renderer || !raycaster || !camera) return;
  renderer.domElement.removeEventListener('pointermove', handlePointerMove);
  renderer.domElement.removeEventListener('pointerup', handlePointerUp);

  if (isDragging || isBusy) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cards);

  if (intersects.length > 0) {
    const hit = intersects[0].object as THREE.Mesh;
    const mat = hit.material as THREE.MeshBasicMaterial;
    if (mat.opacity < 0.25) return;

    if (activeTag) {
      const item = hit.userData.item as GridItemData;
      if (!item.tags.includes(activeTag)) return;
    }

    focusCard(hit);
  } else if (focusedCard) {
    clearCardFocus();
  }
}

function focusCard(card: THREE.Mesh): void {
  if (isBusy || !controls || !camera) return;
  isBusy = true;
  focusedCard = card;
  syncControlMode();

  const item = card.userData.item as GridItemData;

  cards.forEach((c) => {
    const targetOpacity = c === card ? 1 : 0.08;
    gsap.to(c.material as THREE.MeshBasicMaterial, {
      opacity: targetOpacity,
      duration: FOCUS_FADE_DURATION,
      ease: FOCUS_EASE,
    });
  });

  const targetPos = (card.position as THREE.Vector3).clone();
  const camPos = targetPos.clone().add(new THREE.Vector3(0, 0.3, 3.5));

  killCameraTweens();

  cameraTweenTarget = gsap.to(controls.target, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: FOCUS_CAMERA_DURATION,
    ease: FOCUS_EASE,
  });

  cameraTweenPos = gsap.to(camera.position, {
    x: camPos.x,
    y: camPos.y,
    z: camPos.z,
    duration: FOCUS_CAMERA_DURATION,
    ease: FOCUS_EASE,
    onComplete: () => {
      isBusy = false;
    },
  });

  dispatchPreviewEvent('focus', item);
}

function clearCardFocus(): void {
  if (!focusedCard || isBusy || !controls || !camera) return;
  isBusy = true;
  focusedCard = null;
  syncControlMode();

  cards.forEach((c) => {
    const item = c.userData.item as GridItemData;
    let targetOpacity = 1;
    if (activeTag && !item.tags.includes(activeTag)) {
      targetOpacity = 0.05;
    }
    gsap.to(c.material as THREE.MeshBasicMaterial, {
      opacity: targetOpacity,
      duration: FOCUS_FADE_DURATION,
      ease: FOCUS_EASE,
    });
  });

  let targetPos: THREE.Vector3;
  let camPos: THREE.Vector3;

  if (activeTag) {
    const tag = activeTag;
    const matching = cards.filter((c) =>
      (c.userData.item as GridItemData).tags.includes(tag)
    );
    const box = new THREE.Box3();
    matching.forEach((c) => box.expandByObject(c));
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) + 2;
    const distance = Math.max(
      maxDim / (2 * Math.tan((Math.PI / 180) * FOV * 0.35)),
      5
    );
    targetPos = center;
    camPos = center.clone().add(new THREE.Vector3(0, 0.5, distance));
  } else {
    targetPos = new THREE.Vector3(0, 0, 0);
    camPos = new THREE.Vector3(0, 0, DEFAULT_CAMERA_Z);
  }

  killCameraTweens();

  cameraTweenTarget = gsap.to(controls.target, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: FOCUS_CAMERA_DURATION,
    ease: FOCUS_EASE,
  });

  cameraTweenPos = gsap.to(camera.position, {
    x: camPos.x,
    y: camPos.y,
    z: camPos.z,
    duration: FOCUS_CAMERA_DURATION,
    ease: FOCUS_EASE,
    onComplete: () => {
      isBusy = false;
    },
  });

  dispatchPreviewEvent('blur');
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && focusedCard) {
    clearCardFocus();
  }
}

export function showPreviewScene(
  el: HTMLElement,
  gridItems: GridItemData[]
): Promise<void> {
  return new Promise((resolve) => {
    disposeActiveScene();

    container = el;
    previewRoot = el.closest('.preview') as HTMLElement;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0f0e0e, 1);
    el.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 100);
    camera.position.z = DEFAULT_CAMERA_Z;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 40;

    raycaster = new THREE.Raycaster();

    const positions = generatePositions(gridItems.length);
    const textureLoader = new THREE.TextureLoader();

    cards = gridItems.map((item, i) => {
      const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
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
        item,
        homePosition: positions[i].clone(),
        targetScale: 1,
      };

      scene!.add(mesh);
      return mesh;
    });

    animateLoop();

    const maxDist = Math.max(
      ...cards.map((c) => c.userData.homePosition.length())
    );
    const tl = gsap.timeline({
      onComplete: () => {
        isBusy = false;
        syncControlMode();
        resolve();
      },
    });

    cards.forEach((card) => {
      const dist = card.userData.homePosition.length();
      const norm = maxDist > 0 ? dist / maxDist : 0;
      const delay = norm * 0.35;

      tl.to(
        card.position,
        {
          x: card.userData.homePosition.x,
          y: card.userData.homePosition.y,
          z: card.userData.homePosition.z,
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

    isBusy = true;
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
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

    isBusy = true;
    const maxDist = Math.max(
      ...cards.map((c) => c.userData.homePosition.length())
    );

    const tl = gsap.timeline({
      onComplete: () => {
        disposeActiveScene();
        resolve();
      },
    });

    cards.forEach((card) => {
      const dist = card.userData.homePosition.length();
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

export function setTagFilter(tag: string): Promise<void> {
  return new Promise((resolve) => {
    if (!cards.length || isBusy || !camera || !controls) {
      resolve();
      return;
    }

    isBusy = true;

    if (activeTag === tag) {
      activeTag = null;
      focusedCard = null;
      syncControlMode();

      cards.forEach((c) => {
        const home = c.userData.homePosition as THREE.Vector3;
        gsap.to(c.position, {
          x: home.x,
          y: home.y,
          z: home.z,
          duration: 0.9,
          ease: 'power3.out',
        });
        gsap.to(c.material as THREE.MeshBasicMaterial, {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        });
      });

      killCameraTweens();
      cameraTweenTarget = gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
      cameraTweenPos = gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: DEFAULT_CAMERA_Z,
        duration: 0.9,
        ease: 'power3.out',
        onComplete: () => {
          isBusy = false;
          resolve();
        },
      });

      dispatchPreviewEvent('tag', null);
    } else {
      activeTag = tag;
      focusedCard = null;
      syncControlMode();

      const matching: THREE.Mesh[] = [];
      const nonMatching: THREE.Mesh[] = [];
      cards.forEach((c) => {
        const item = c.userData.item as GridItemData;
        if (item.tags.includes(tag)) matching.push(c);
        else nonMatching.push(c);
      });

      const clusterPos = generateClusterPositions(matching.length);
      matching.forEach((c, i) => {
        gsap.to(c.position, {
          x: clusterPos[i].x,
          y: clusterPos[i].y,
          z: clusterPos[i].z,
          duration: 0.9,
          ease: 'power3.out',
        });
        gsap.to(c.material as THREE.MeshBasicMaterial, {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        });
      });

      nonMatching.forEach((c) => {
        gsap.to(c.material as THREE.MeshBasicMaterial, {
          opacity: 0.05,
          duration: 0.7,
          ease: 'power2.out',
        });
      });

      const clusterCenter = new THREE.Vector3();
      clusterPos.forEach((p) => clusterCenter.add(p));
      clusterCenter.divideScalar(clusterPos.length || 1);

      const maxDim =
        Math.max(
          ...clusterPos.map((p) =>
            clusterPos.reduce(
              (max, q) => Math.max(max, p.distanceTo(q)),
              0
            )
          )
        ) + 3;
      const distance = Math.max(
        maxDim / (2 * Math.tan((Math.PI / 180) * FOV * 0.35)),
        5
      );

      killCameraTweens();
      cameraTweenTarget = gsap.to(controls.target, {
        x: clusterCenter.x,
        y: clusterCenter.y,
        z: clusterCenter.z,
        duration: 0.9,
        ease: 'power3.out',
      });
      cameraTweenPos = gsap.to(camera.position, {
        x: clusterCenter.x,
        y: clusterCenter.y + 0.5,
        z: clusterCenter.z + distance,
        duration: 0.9,
        ease: 'power3.out',
        onComplete: () => {
          isBusy = false;
          resolve();
        },
      });

      dispatchPreviewEvent('tag', tag);
    }
  });
}

export function disposeActiveScene(): void {
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', handleResize);
  renderer?.domElement.removeEventListener('pointerdown', handlePointerDown);
  window.removeEventListener('keydown', handleKeyDown);

  killCameraTweens();
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
  previewRoot = null;
  raycaster = null;
  focusedCard = null;
  activeTag = null;
  isBusy = false;
}
