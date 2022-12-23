const Button = ({ children, className, ...prop }) => {
  return (
    <button
      className={`
        flex justify-center 
        bg-button shadow-button-box 
        hover:bg-button-hover 
        active:bg-button-active active:shadow-none
        transition-shadow duration-200
        px-8 py-4 
        text-2xl  
        cursor-pointer 
        rounded-[32px] 
        ${className}
      `}
      {...prop}
    >
      {children}
    </button>
  );
};

export default Button;
