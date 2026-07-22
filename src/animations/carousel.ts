import gsap from 'gsap';
import { splitMap } from './chars';

const timelineMap = new Map<Element, gsap.core.Timeline>();

export const getCarouselCellTransforms = (
  count: number,
  radius: number
): string[] => {
  const angleStep = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const angle = i * angleStep;
    return `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
};

export const setupCarouselCells = (carousel: Element): void => {
  const wrapper = carousel.closest('.scene');
  if (!wrapper) return;
  const radius =
    parseFloat(wrapper.getAttribute('data-radius') || '') || 500;
  const cells = carousel.querySelectorAll('.carousel__cell');
  const transforms = getCarouselCellTransforms(cells.length, radius);
  cells.forEach((cell, i) => {
    (cell as HTMLElement).style.transform = transforms[i];
  });
};

export const getInterpolatedRotation = (progress: number) => ({
  rotationY: gsap.utils.interpolate(0, -180, progress),
  rotationX: gsap.utils.interpolate(3, -3, progress),
  rotationZ: gsap.utils.interpolate(3, -3, progress),
});

export const createScrollAnimation = (
  carousel: Element
): gsap.core.Timeline => {
  const wrapper = carousel.closest('.scene');
  if (!wrapper) throw new Error('Carousel wrapper .scene not found');

  const cards = carousel.querySelectorAll('.card');
  const titleSpan = wrapper.querySelector('.scene__title span');
  const chars = titleSpan ? splitMap.get(titleSpan)?.chars || [] : [];

  const tl = gsap.timeline({
    defaults: { ease: 'sine.inOut' },
    scrollTrigger: {
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  tl.fromTo(carousel, { rotationY: 0 }, { rotationY: -180 }, 0)
    .fromTo(
      carousel,
      { rotationZ: 3, rotationX: 3 },
      { rotationZ: -3, rotationX: -3 },
      0
    )
    .fromTo(
      cards,
      { filter: 'brightness(250%)' },
      { filter: 'brightness(80%)', ease: 'power3' },
      0
    )
    .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0);

  if (chars.length > 0) {
    // animateChars will be imported from chars.ts; we'll import it there or keep separate
    // To avoid circular deps, chars.ts imports from this module for getInterpolatedRotation only.
    // For calling animateChars, pass it in or import. We'll import animateChars inside chars.ts
    // and call it from App. Here we leave a hook: App will call animateChars after.
    // Actually we can just attach a ScrollTrigger on chars in createScrollAnimation.
    gsap.fromTo(
      chars,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: 'start' },
        scrollTrigger: {
          trigger: wrapper,
          start: 'top center',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  timelineMap.set(carousel, tl);
  return tl;
};

export const getCarouselTimeline = (carousel: Element): gsap.core.Timeline | undefined =>
  timelineMap.get(carousel);

export const killCarouselTimeline = (carousel: Element): void => {
  const tl = timelineMap.get(carousel);
  if (tl) {
    tl.kill();
    timelineMap.delete(carousel);
  }
};

export const killAllCarousels = (): void => {
  timelineMap.forEach((tl) => tl.kill());
  timelineMap.clear();
};
