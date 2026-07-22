import React, { useEffect } from 'react';
import Scene from './components/Scene';
import Preview from './components/Preview';
import { scenes } from './data/scenes';
import { preloadImages } from './utils/preloadImages';
import {
  setupCarouselCells,
  createScrollAnimation,
  killAllCarousels,
} from './animations/carousel';
import {
  initTextsSplit,
  revertAllSplits,
} from './animations/chars';
import {
  activatePreviewFromCarousel,
  deactivatePreviewToCarousel,
  resetIsAnimating,
} from './animations/transitions';
import { smoother } from './animations/gsapSetup';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const App: React.FC = () => {
  useEffect(() => {
    let cancelled = false;
    const onResize = () => ScrollTrigger.refresh();

    const init = () => {
      if (cancelled) return;
      initTextsSplit();
      document.querySelectorAll('.carousel').forEach((carousel) => {
        setupCarouselCells(carousel);
        createScrollAnimation(carousel);
      });
      window.addEventListener('resize', onResize);
    };

    preloadImages('.grid__item-image').then(() => {
      document.body.classList.remove('loading');
      init();
    });

    return () => {
      cancelled = true;
      revertAllSplits();
      killAllCarousels();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      smoother.kill();
      resetIsAnimating();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div id="smooth-wrapper">
        <main id="smooth-content">
          <div className="scene-wrapper">
            {scenes.map((scene) => (
              <Scene
                key={scene.id}
                data={scene}
                onTitleClick={activatePreviewFromCarousel}
              />
            ))}
          </div>
        </main>
      </div>
      <div className="preview-wrapper">
        {scenes.map((scene) => (
          <Preview
            key={scene.id}
            data={scene}
            onClose={deactivatePreviewToCarousel}
          />
        ))}
      </div>
    </>
  );
};

export default App;
