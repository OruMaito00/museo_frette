import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

export const splitMap = new Map<Element, SplitText>();

export const initTextsSplit = (): void => {
  document
    .querySelectorAll('.scene__title span, .preview__title span, .preview__close')
    .forEach((span) => {
      const split = SplitText.create(span as HTMLElement, {
        type: 'chars',
        charsClass: 'char',
        autoSplit: true,
      });
      splitMap.set(span, split);
    });
};

export const revertAllSplits = (): void => {
  splitMap.forEach((split) => split.revert());
  splitMap.clear();
};

export const animateChars = (
  chars: HTMLElement[],
  direction: 'in' | 'out' = 'in',
  opts: gsap.TweenVars = {}
): void => {
  const base: gsap.TweenVars = {
    autoAlpha: direction === 'in' ? 1 : 0,
    duration: 0.02,
    ease: 'none',
    stagger: { each: 0.04, from: direction === 'in' ? 'start' : 'end' },
    ...opts,
  };
  gsap.fromTo(chars, { autoAlpha: direction === 'in' ? 0 : 1 }, base);
};

export const animatePreviewTexts = (
  preview: Element,
  direction: 'in' | 'out' = 'in',
  selector = '.preview__title span, .preview__close'
): void => {
  preview.querySelectorAll(selector).forEach((el) => {
    const chars = (splitMap.get(el)?.chars || []) as HTMLElement[];
    animateChars(chars, direction);
  });
};
