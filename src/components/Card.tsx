import React from 'react';

interface CardProps {
  image: string;
}

const Card: React.FC<CardProps> = ({ image }) => {
  return (
    <div className="card" style={{ '--img': `url(${image})` } as React.CSSProperties}>
      <div className="card__face card__face--front" />
      <div className="card__face card__face--back" />
    </div>
  );
};

export default Card;
