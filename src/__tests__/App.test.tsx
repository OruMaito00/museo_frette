import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { scenes } from '../data/scenes';

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

vi.mock('../animations/previewScene', () => ({
  disposeActiveScene: vi.fn(),
  setTagFilter: vi.fn(),
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { getAll: vi.fn(() => []), refresh: vi.fn() },
}));

describe('App', () => {
  it('renders all 6 scenes with titles', () => {
    render(<App />);
    expect(scenes).toHaveLength(6);
    // Each title appears twice: once in the carousel scene, once in its preview
    scenes.forEach((scene) => {
      expect(screen.getAllByText(scene.title)).toHaveLength(2);
    });
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
    // Every scene lists the same seven plaids, so each caption appears once per scene
    expect(screen.getAllByText('Deco 001 — Blu Notte')).toHaveLength(
      scenes.length
    );
    expect(screen.getAllByText('Modernism — Tortora')).toHaveLength(
      scenes.length
    );
  });
});
