import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = 'inline-flex justify-center items-center font-medium rounded-xl transition-all duration-300';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-accent shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-slate-800 hover:bg-amber-400 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-slate-100',
  };
  
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-6 py-3',
  };
  
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;
  
  const disabledStyle = (props.disabled || props.isLoading) ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${disabledStyle} ${className}`}
      disabled={props.disabled || props.isLoading}
      {...props}
    >
      {props.isLoading && !props.icon && <span className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>}
      {props.icon && <props.icon className={`mr-2 ${props.isLoading ? 'animate-spin' : ''}`} />}
      {children}
    </button>
  );
};

export default Button;
