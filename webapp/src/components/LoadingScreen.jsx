import React from "react";
import { TypeAnimation } from "react-type-animation";
import Background from "./Background";

const DOT_TIME = 200;

const LoadingScreen = () => {
  return (
    <Background>
      <div className="flex justify-center items-center text-lg text-white drop-shadow-game-title mt-10 mb-10 w-full h-[50vh] flex-row">
        <div className="text-[50px] ml-[75px]">LOADING</div>
        <TypeAnimation
          sequence={[
            "",
            DOT_TIME,
            ".",
            DOT_TIME,
            "..",
            DOT_TIME,
            "...",
            DOT_TIME,
            "..",
            DOT_TIME,
            ".",
            DOT_TIME,
            "",
            DOT_TIME,
          ]}
          repeat={Infinity}
          cursor={false}
          className="text-[50px] min-w-[150px]"
          speed={30}
        />
      </div>
    </Background>
  );
};

export default React.memo(LoadingScreen);
