import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

export const smoother = ScrollSmoother.create({
  smooth: 1,
  effects: true,
  normalizeScroll: true,
});

export { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText };
