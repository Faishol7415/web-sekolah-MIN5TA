import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false,
  ...props 
}) => {
  const baseStyle = 'bg-white rounded-2xl p-6 shadow-sm border border-slate-100';
  const hoverStyle = hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';
  const glassStyle = glass ? 'bg-white/70 backdrop-blur-md border-white/20 shadow-lg' : '';
  
  return (
    <div 
      className={`${baseStyle} ${hoverStyle} ${glassStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
