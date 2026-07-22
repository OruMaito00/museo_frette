import React from 'react';
import PreviewGridItem from './PreviewGridItem';
import type { SceneData } from '../types';

interface PreviewProps {
  data: SceneData;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Preview: React.FC<PreviewProps> = ({ data, onClose }) => {
  return (
    <div className="preview" id={data.id}>
      <header className="preview__header">
        <h2 className="preview__title">
          <span>{data.title}</span>
        </h2>
        <button className="preview__close" onClick={onClose}>
          Close ×
        </button>
      </header>
      <div className="grid">
        {data.gridItems.map((item, i) => (
          <PreviewGridItem
            key={i}
            image={item.image}
            caption={item.caption}
            captionId={`caption-${data.id}-${i}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Preview;
