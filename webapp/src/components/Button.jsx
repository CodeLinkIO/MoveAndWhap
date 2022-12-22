const Button = ({ children, className, ...prop }) => {
  return (
    <button
      className={`
        flex justify-center 
        bg-[#e07025] shadow-button 
        hover:bg-[#495df8] 
        active:bg-[#5425e0] active:shadow-none
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
