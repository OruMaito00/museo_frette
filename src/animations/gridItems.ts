import gsap from 'gsap';

interface ItemData {
  el: Element;
  dx: number;
  dy: number;
  dist: number;
  isLeft: boolean;
}

const animateGridItemIn = (
  el: Element,
  dx: number,
  dy: number,
  rotationY: number,
  delay: number
): void => {
  gsap.fromTo(
    el,
    {
      transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
      autoAlpha: 0,
      y: dy * 0.5,
      scale: 0.5,
      rotationY,
    },
    {
      y: 0,
      scale: 1,
      rotationY: 0,
      autoAlpha: 1,
      duration: 0.4,
      ease: 'sine',
      delay: delay + 0.1,
    }
  );

  gsap.fromTo(
    el,
    { z: -3500 },
    { z: 0, duration: 0.3, ease: 'expo', delay }
  );
};

const animateGridItemOut = (
  el: Element,
  dx: number,
  dy: number,
  rotationY: number,
  delay: number,
  isLast: boolean,
  onComplete?: () => void
): void => {
  gsap.to(el, {
    startAt: {
      transformOrigin: `50% 50% ${dx > 0 ? -dx * 0.8 : dx * 0.8}px`,
    },
    y: dy * 0.4,
    rotationY,
    scale: 0.4,
    autoAlpha: 0,
    duration: 0.4,
    ease: 'sine.in',
    delay,
  });

  gsap.to(el, {
    z: -3500,
    duration: 0.4,
    ease: 'expo.in',
    delay: delay + 0.9,
    onComplete: isLast ? onComplete : undefined,
  });
};

export const animateGridItems = ({
  items,
  centerX,
  centerY,
  direction = 'in',
  onComplete,
}: {
  items: NodeListOf<Element>;
  centerX: number;
  centerY: number;
  direction?: 'in' | 'out';
  onComplete?: () => void;
}): void => {
  const itemData: ItemData[] = Array.from(items).map((el) => {
    const rect = el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;
    const dx = centerX - elCenterX;
    const dy = centerY - elCenterY;
    const dist = Math.hypot(dx, dy);
    const isLeft = elCenterX < centerX;
    return { el, dx, dy, dist, isLeft };
  });

  const maxDist = Math.max(...itemData.map((d) => d.dist));
  const totalStagger = 0.025 * (itemData.length - 1);

  let latest: { delay: number; el: Element | null } = { delay: -1, el: null };

  itemData.forEach(({ el, dx, dy, dist, isLeft }) => {
    const norm = maxDist ? dist / maxDist : 0;
    const exponential = Math.pow(
      direction === 'in' ? 1 - norm : norm,
      1
    );
    const delay = exponential * totalStagger;
    const rotationY = isLeft ? 100 : -100;

    if (direction === 'in') {
      animateGridItemIn(el, dx, dy, rotationY, delay);
    } else {
      if (delay > latest.delay) {
        latest = { delay, el };
      }
      animateGridItemOut(el, dx, dy, rotationY, delay, false, onComplete);
    }
  });

  if (direction === 'out' && latest.el) {
    const match = itemData.find((d) => d.el === latest.el);
    if (match) {
      const { el, dx, dy, isLeft } = match;
      const rotationY = isLeft ? 100 : -100;
      animateGridItemOut(el, dx, dy, rotationY, latest.delay, true, onComplete);
    }
  }
};

export const animatePreviewGridIn = (preview: Element): void => {
  const items = preview.querySelectorAll('.grid__item');
  gsap.set(items, { clearProps: 'all' });
  animateGridItems({
    items,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    direction: 'in',
  });
};

export const animatePreviewGridOut = (preview: Element): void => {
  const items = preview.querySelectorAll('.grid__item');
  const onComplete = () =>
    gsap.set(preview, { pointerEvents: 'none', autoAlpha: 0 });
  animateGridItems({
    items,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    direction: 'out',
    onComplete,
  });
};
