import React from "react";
import { TypeAnimation } from "react-type-animation";

import BlackContainer from "./BlackContainer";

const HowToPlay = () => {
  return (
    <BlackContainer className="flex flex-col items-center w-[500px] min-h-[190px] mt-14">
      <h2 className=" underline mb-4">HOW TO PLAY</h2>
      <TypeAnimation
        className="text-xs"
        sequence={[
          "You can move up/down/left/right by clicking on the arrow until you encounter an enemy's battleship.",
          500,
          "You can move up/down/left/right by clicking on the arrow until you encounter an enemy's battleship. If it is not head to head with yours,you can fire and destroy it.",
        ]}
        cursor={false}
        speed={55}
      />
    </BlackContainer>
  );
};

export default React.memo(HowToPlay);
