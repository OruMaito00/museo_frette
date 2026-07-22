import React from 'react';
import Card from './Card';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <div className="carousel">
      {images.map((img, i) => (
        <div className="carousel__cell" key={i}>
          <Card image={img} />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
