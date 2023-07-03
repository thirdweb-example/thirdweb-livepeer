import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  to?: string;
  onClick?: () => void;
}

const Button = ({ children, className, to, onClick }: ButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={to ? undefined : handleClick}
      className="relative inline-flex mt-10 group hover:cursor-pointer mr-10"
    >
      <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-primary rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
      <p
        className={`${className} relative inline-flex items-center justify-center px-5 py-3 text-md font-medium text-white transition-all duration-200 bg-gray-900 rounded-xl`}
      >
        {children}
      </p>
    </div>
  );
};

export default Button;
