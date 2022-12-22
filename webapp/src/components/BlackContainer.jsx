import React from "react";

const BlackContainer = ({ children, className }) => {
  return (
    <div
      className={`pt-6 pb-6 pr-10 pl-10 bg-[#11202e] border rounded-lg border-white max-w-[500px] ${className}`}
    >
      {children}
    </div>
  );
};

export default React.memo(BlackContainer);
