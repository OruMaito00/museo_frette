import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

let smoother: ScrollSmoother | null = null;

/**
 * Creates the ScrollSmoother instance. Must be called only after the
 * #smooth-wrapper / #smooth-content elements exist in the DOM (i.e. after
 * React has rendered), otherwise ScrollSmoother falls back to
 * document.body.children[0] and smooth scrolling breaks.
 */
export const createSmoother = (): ScrollSmoother => {
  if (!smoother) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });
  }
  return smoother;
};

export const getSmoother = (): ScrollSmoother => {
  if (!smoother) {
    throw new Error(
      'ScrollSmoother accessed before initialization. Call createSmoother() first.'
    );
  }
  return smoother;
};

export const killSmoother = (): void => {
  smoother?.kill();
  smoother = null;
};

export { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText };
