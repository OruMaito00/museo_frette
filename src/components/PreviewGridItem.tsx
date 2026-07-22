import React from 'react';

interface PreviewGridItemProps {
  image: string;
  caption: string;
  captionId: string;
}

const PreviewGridItem: React.FC<PreviewGridItemProps> = ({
  image,
  caption,
  captionId,
}) => {
  return (
    <figure
      aria-labelledby={captionId}
      className="grid__item"
      role="img"
    >
      <div
        className="grid__item-image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <figcaption className="grid__item-caption" id={captionId}>
        <h3>{caption}</h3>
      </figcaption>
    </figure>
  );
};

export default PreviewGridItem;
