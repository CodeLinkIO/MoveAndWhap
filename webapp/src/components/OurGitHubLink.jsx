import { memo } from "react";
import leftTalkBoxSrc from "../assets/leftTalkBox.png";
import whaleSrc from "../assets/whale.png";

const OurGitHubLink = () => {
  return (
    <a
      href="https://github.com/CodeLinkIO/MoveAndWhap"
      target="_blank"
      rel="noopener noreferrer"
      className="relative"
    >
      <img
        src={leftTalkBoxSrc}
        alt="leftTalkBox"
        className="ml-[70px] w-[105px] h-[70px]"
      />
      <p className="absolute z-10 text-black text-xs top-[8px] left-[80px] w-[86px] text-center text-[10px]">
        Our GitHub
      </p>
      <img src={whaleSrc} alt="whale" className="w-[81px] h-[64px]" />
    </a>
  );
};

export default memo(OurGitHubLink);
