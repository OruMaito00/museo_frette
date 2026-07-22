import React from 'react';
import Carousel from './Carousel';
import type { SceneData } from '../types';

interface SceneProps {
  data: SceneData;
  onTitleClick: (e: React.MouseEvent<HTMLHeadingElement>) => void;
}

const Scene: React.FC<SceneProps> = ({ data, onTitleClick }) => {
  return (
    <div className="scene" data-radius={data.radius}>
      <h2
        className="scene__title"
        data-speed="0.7"
        onClick={onTitleClick}
      >
        <a href={`#${data.id}`}>
          <span>{data.title}</span>
        </a>
      </h2>
      <Carousel images={data.images} />
    </div>
  );
};

export default Scene;
