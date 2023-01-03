import { useEffect, useRef } from "react";
import {
  AnimatedSprite,
  Application,
  Sprite,
  Texture,
  Ticker,
  TilingSprite,
} from "pixi.js";
import { Group, Tween } from "tweedle.js";
import tileWater from "../assets/tile_water.png";
import Boat2_water_frame1 from "../assets/Boat2_water_frame1.png";
import Boat2_water_frame2 from "../assets/Boat2_water_frame2.png";
import Boat2_water_frame3 from "../assets/Boat2_water_frame3.png";
import Boat2_water_frame4 from "../assets/Boat2_water_frame4.png";
import Cannon2_color3_1 from "../assets/Cannon2_color3_1.png";
import React from "react";

const ANIMATION_SPEED = 0.198;

const BOAT_FRAMES = [
  Boat2_water_frame1,
  Boat2_water_frame2,
  Boat2_water_frame3,
  Boat2_water_frame4,
];

const WIDTH = 140;
const HEIGHT = 140;

const Background = ({
  children,
  hasBoatAnimation = true,
  className,
  withBoat = true,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!withBoat) return;

    const background = new Application({
      width: WIDTH,
      height: HEIGHT,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    setTimeout(() => {
      // Add Background match with screen Bg
      const tile = new TilingSprite(Texture.from(tileWater), WIDTH, HEIGHT);
      background.stage && background.stage.addChild(tile);

      // Boat
      const boat = new AnimatedSprite(
        BOAT_FRAMES.map((stringy) => Texture.from(stringy))
      );
      boat.animationSpeed = ANIMATION_SPEED;
      boat.width = WIDTH;
      boat.height = HEIGHT;
      boat.play();

      // Canon
      const cannon = Sprite.from(Cannon2_color3_1);
      boat.addChild(cannon);

      // Animation
      if (hasBoatAnimation) {
        Ticker.shared.add(() => {
          Group.shared.update();
        });
        const oscillationAnimation1 = new Tween(boat);
        oscillationAnimation1.to({ x: 0, y: 20 }, 1000);
        oscillationAnimation1.start().yoyo().repeat();
      }

      background.stage && background.stage.addChild(boat);

      try {
        ref.current.appendChild(background.view);
      } catch (error) {
        // prevent canvas not initialized error
      }
    }, 200);

    return () => {
      console.log("Unmounting Loading");
      // On unload completely destroy the application and all of it's children
      clearTimeout();
      background && background.destroy(true, false);
    };
  }, [hasBoatAnimation, withBoat]);

  return (
    <div
      className={`bg-game-tile flex-col bg-repeat min-h-screen w-full min-w-[100vw] flex items-center relative pt-12 pb-10 ${className}`}
    >
      <div ref={ref} className={`h-[150px]`} />
      {children}
    </div>
  );
};

export default React.memo(Background);
