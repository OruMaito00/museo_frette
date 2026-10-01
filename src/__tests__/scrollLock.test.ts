import { describe, it, expect, vi, afterEach } from 'vitest';
import { lockUserScroll, unlockUserScroll } from '../animations/scrollLock';

describe('scrollLock', () => {
  afterEach(() => {
    unlockUserScroll();
    vi.restoreAllMocks();
  });

  it('lockUserScroll registers wheel, touchmove and keydown listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');

    lockUserScroll();

    expect(addSpy).toHaveBeenCalledWith('wheel', expect.any(Function), { passive: false });
    expect(addSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false });
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function), false);
  });

  it('unlockUserScroll removes wheel, touchmove and keydown listeners', () => {
    lockUserScroll();
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    unlockUserScroll();

    expect(removeSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('prevents default on wheel events while locked, not after unlocking', () => {
    lockUserScroll();
    const lockedEvent = new Event('wheel', { cancelable: true });
    window.dispatchEvent(lockedEvent);
    expect(lockedEvent.defaultPrevented).toBe(true);

    unlockUserScroll();
    const unlockedEvent = new Event('wheel', { cancelable: true });
    window.dispatchEvent(unlockedEvent);
    expect(unlockedEvent.defaultPrevented).toBe(false);
  });
});
