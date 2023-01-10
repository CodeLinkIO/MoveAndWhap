import { memo } from "react";
import rightTalkBoxSrc from "../assets/rightTalkBox.png";
import birdSrc from "../assets/bird.png";

const OurWebsiteLink = () => {
  return (
    <a
      href="https://www.codelink.io/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex flex-col items-center justify-end"
    >
      <img
        src={rightTalkBoxSrc}
        alt="rightTalkBox"
        className="mr-[70px] w-[105px] h-[70px]"
      />
      <p className="absolute z-10 text-black text-xs top-[8px] left-[8px] w-[86px] text-center text-[10px]">
        Visit CodeLink
      </p>
      <img src={birdSrc} alt="bird" className="w-[81px] h-[64px] self-end" />
    </a>
  );
};

export default memo(OurWebsiteLink);
