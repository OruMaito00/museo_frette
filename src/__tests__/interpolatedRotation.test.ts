import { describe, it, expect } from 'vitest';
import { getInterpolatedRotation } from '../animations/carousel';

describe('getInterpolatedRotation', () => {
  it('returns original start values at progress 0', () => {
    const result = getInterpolatedRotation(0);
    expect(result.rotationY).toBeCloseTo(0, 5);
    expect(result.rotationX).toBeCloseTo(3, 5);
    expect(result.rotationZ).toBeCloseTo(3, 5);
  });

  it('returns mid values at progress 0.5', () => {
    const result = getInterpolatedRotation(0.5);
    expect(result.rotationY).toBeCloseTo(-90, 5);
    expect(result.rotationX).toBeCloseTo(0, 5);
    expect(result.rotationZ).toBeCloseTo(0, 5);
  });

  it('returns end values at progress 1', () => {
    const result = getInterpolatedRotation(1);
    expect(result.rotationY).toBeCloseTo(-180, 5);
    expect(result.rotationX).toBeCloseTo(-3, 5);
    expect(result.rotationZ).toBeCloseTo(-3, 5);
  });
});
