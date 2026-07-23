import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getSmoother } from './gsapSetup';
import { splitMap, animatePreviewTexts } from './chars';
import { getInterpolatedRotation, getCarouselTimeline } from './carousel';
import { showPreviewScene, hidePreviewScene } from './previewScene';
import { scenes } from '../data/scenes';
import { lockUserScroll, unlockUserScroll } from './scrollLock';

let isAnimating = false;

const sceneWrapper = (): Element | null =>
  document.querySelector('.scene-wrapper');

const getSceneElementsFromTitle = (
  titleEl: Element
): {
  wrapper: Element | null;
  carousel: Element | null;
  cards: NodeListOf<Element>;
  span: Element | null;
  chars: HTMLElement[];
} => {
  const wrapper = titleEl.closest('.scene');
  const carousel = wrapper?.querySelector('.carousel') ?? null;
  const cards = carousel?.querySelectorAll('.card') ?? (document.querySelectorAll('nothing') as NodeListOf<Element>);
  const span = titleEl.querySelector('span');
  const chars = (span ? splitMap.get(span)?.chars || [] : []) as HTMLElement[];
  return { wrapper, carousel, cards, span, chars };
};

const getSceneElementsFromPreview = (
  previewEl: Element
): {
  wrapper: Element | null;
  carousel: Element | null;
  cards: NodeListOf<Element>;
  span: Element | null;
  chars: HTMLElement[];
  titleEl: Element | null;
} => {
  const previewId = `#${previewEl.id}`;
  const titleLink = document.querySelector(
    `.scene__title a[href="${previewId}"]`
  );
  const titleEl = titleLink?.closest('.scene__title') ?? null;
  return { ...getSceneElementsFromTitle(titleEl!), titleEl };
};

export const activatePreviewFromCarousel = (
  e: React.MouseEvent<HTMLHeadingElement>
): void => {
  e.preventDefault();
  if (isAnimating) return;
  isAnimating = true;

  const titleEl = e.currentTarget;
  const { wrapper, carousel, cards, chars } = getSceneElementsFromTitle(titleEl);

  if (!wrapper || !carousel) {
    isAnimating = false;
    return;
  }

  const offsetTop =
    wrapper.getBoundingClientRect().top + window.scrollY;
  const targetY =
    offsetTop - window.innerHeight / 2 + (wrapper as HTMLElement).offsetHeight / 2;

  ScrollTrigger.getAll().forEach((t) => t.disable(false));

  const tl = gsap.timeline({
    defaults: { duration: 1.5, ease: 'power2.inOut' },
    onComplete: () => {
      isAnimating = false;
      ScrollTrigger.getAll().forEach((t) => t.enable());
      const ct = getCarouselTimeline(carousel);
      ct?.scrollTrigger?.scroll(targetY);
    },
  });

  tl.to(window, {
    onStart: () => {
      lockUserScroll();
    },
    onComplete: () => {
      unlockUserScroll();
      getSmoother().paused(true);
    },
    scrollTo: { y: targetY, autoKill: true },
  })
    .to(
      chars,
      {
        autoAlpha: 0,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: 'end' },
      },
      0
    )
    .to(carousel, { rotationX: 90, rotationY: -360, z: -2000 }, 0)
    .to(
      carousel,
      {
        duration: 2.5,
        ease: 'power3.inOut',
        z: 1500,
        rotationZ: 270,
        onComplete: () => {
          const sw = sceneWrapper();
          if (sw) gsap.set(sw, { autoAlpha: 0 });
        },
      },
      0.7
    )
    .to(cards, { rotationZ: 0 }, 0)
    .add(() => {
      const previewSelector = titleEl.querySelector('a')?.getAttribute('href');
      if (!previewSelector) return;
      const preview = document.querySelector(previewSelector);
      if (!preview) return;
      gsap.set(preview, { pointerEvents: 'auto', autoAlpha: 1 });
      const stage = preview.querySelector('.preview__stage') as HTMLElement | null;
      const sceneData = scenes.find((s) => s.id === preview.id);
      if (stage && sceneData) {
        showPreviewScene(stage, sceneData.gridItems);
      }
      animatePreviewTexts(preview, 'in');
    }, '<+=1.9');
};

export const deactivatePreviewToCarousel = async (
  e: React.MouseEvent<HTMLButtonElement>
): Promise<void> => {
  if (isAnimating) return;
  isAnimating = true;

  const preview = e.currentTarget.closest('.preview');
  if (!preview) return;

  const { carousel, cards, chars } = getSceneElementsFromPreview(preview);

  if (!carousel) {
    isAnimating = false;
    return;
  }

  animatePreviewTexts(preview, 'out');
  await hidePreviewScene();
  gsap.set(preview, { pointerEvents: 'none', autoAlpha: 0 });

  const sw = sceneWrapper();
  if (sw) gsap.set(sw, { autoAlpha: 1 });

  // BUG: progress should always be 0.5 but for some reason it's 0 sometimes
  const progress = 0.5;

  const { rotationX, rotationY, rotationZ } = getInterpolatedRotation(progress);

  gsap
    .timeline({
      delay: 0.7,
      defaults: { duration: 1.3, ease: 'expo' },
      onComplete: () => {
        getSmoother().paused(false);
        isAnimating = false;
      },
    })
    .fromTo(
      chars,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: 'start' },
      }
    )
    .fromTo(
      carousel,
      {
        z: -550,
        rotationX,
        rotationY: -720,
        rotationZ,
        yPercent: 300,
      },
      {
        rotationY,
        yPercent: 0,
      },
      0
    )
    .fromTo(cards, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.3);
};

export const resetIsAnimating = (): void => {
  isAnimating = false;
};
