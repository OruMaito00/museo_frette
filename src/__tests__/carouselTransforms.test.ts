import { describe, it, expect } from 'vitest';
import { getCarouselCellTransforms } from '../animations/carousel';

describe('getCarouselCellTransforms', () => {
  it('returns correct number of transforms', () => {
    const transforms = getCarouselCellTransforms(4, 500);
    expect(transforms).toHaveLength(4);
  });

  it('starts at 0deg and steps by 360/count', () => {
    const transforms = getCarouselCellTransforms(4, 500);
    expect(transforms[0]).toBe('rotateY(0deg) translateZ(500px)');
    expect(transforms[1]).toBe('rotateY(90deg) translateZ(500px)');
    expect(transforms[2]).toBe('rotateY(180deg) translateZ(500px)');
    expect(transforms[3]).toBe('rotateY(270deg) translateZ(500px)');
  });

  it('uses the provided radius', () => {
    const transforms = getCarouselCellTransforms(3, 650);
    transforms.forEach((t) => {
      expect(t).toContain('translateZ(650px)');
    });
  });

  it('handles 6 cells correctly', () => {
    const transforms = getCarouselCellTransforms(6, 500);
    expect(transforms[1]).toBe('rotateY(60deg) translateZ(500px)');
    expect(transforms[5]).toBe('rotateY(300deg) translateZ(500px)');
  });
});
