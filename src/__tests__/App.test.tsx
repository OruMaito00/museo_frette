import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../animations/gsapSetup', () => ({
  createSmoother: vi.fn(() => ({ kill: vi.fn(), paused: vi.fn() })),
  getSmoother: vi.fn(() => ({ kill: vi.fn(), paused: vi.fn() })),
  killSmoother: vi.fn(),
}));

vi.mock('../utils/preloadImages', () => ({
  preloadImages: () => Promise.resolve(),
}));

vi.mock('../animations/carousel', async () => {
  return {
    setupCarouselCells: vi.fn(),
    createScrollAnimation: vi.fn(),
    killAllCarousels: vi.fn(),
  };
});

vi.mock('../animations/chars', async () => {
  return {
    initTextsSplit: vi.fn(),
    revertAllSplits: vi.fn(),
    splitMap: new Map(),
  };
});

vi.mock('../animations/transitions', async () => {
  return {
    activatePreviewFromCarousel: vi.fn(),
    deactivatePreviewToCarousel: vi.fn(),
    resetIsAnimating: vi.fn(),
  };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { getAll: vi.fn(() => []), refresh: vi.fn() },
}));

describe('App', () => {
  it('renders all 6 scenes with titles', () => {
    render(<App />);
    expect(screen.getAllByText('Haute Couture Nights — Paris')).toHaveLength(2);
    expect(
      screen.getAllByText('Vogue Evolution — New York City')
    ).toHaveLength(2);
    expect(
      screen.getAllByText('Glamour in the Desert — Dubai')
    ).toHaveLength(2);
    expect(
      screen.getAllByText('Chic Couture Runway — Milan')
    ).toHaveLength(2);
    expect(screen.getAllByText('Style Showcase — London')).toHaveLength(2);
    expect(
      screen.getAllByText('Future Fashion Forward — Tokyo')
    ).toHaveLength(2);
  });

  it('renders 6 preview sections', () => {
    render(<App />);
    const previews = document.querySelectorAll('.preview');
    expect(previews).toHaveLength(6);
  });

  it('renders correct total carousel cells (4×5 + 6 = 26)', () => {
    render(<App />);
    const cells = document.querySelectorAll('.carousel__cell');
    expect(cells).toHaveLength(26);
  });

  it('renders a grid caption', () => {
    render(<App />);
    expect(screen.getByText('Kai Vega')).toBeInTheDocument();
    expect(screen.getByText('Rylan Ash')).toBeInTheDocument();
  });
});
