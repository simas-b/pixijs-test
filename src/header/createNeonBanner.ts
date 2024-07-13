import { Sprite, Ticker } from "pixi.js";
import { loadTextureForScreenSize } from "./loadTextureForScreenSize";

type Props = {
  blackouts: { begin: number; end: number }[];
  alphaSpeed: number;
  textureName: string;
  delayStart: number;
};

export default async function createNeonBanner({
  blackouts,
  alphaSpeed,
  textureName,
  delayStart,
}: Props) {
  const texture = await loadTextureForScreenSize(textureName);
  texture.source.autoGenerateMipmaps = true;
  const sprite = new Sprite({
    texture,
    visible: false,
    alpha: 0,
  });

  function start() {
    const ticker = new Ticker();
    sprite.visible = true;
    let isOn = true;
    let elapsed = 0;

    ticker.add(({ elapsedMS, deltaTime }) => {
      elapsed += elapsedMS;

      // Destroy ticker if we're past last blackout
      if (elapsed > blackouts[blackouts.length - 1].end && sprite.alpha >= 1)
        ticker.destroy();

      isOn = true;
      for (const blackout of blackouts) {
        if (elapsed > blackout.begin && elapsed < blackout.end) isOn = false;
      }

      // Adjust alpha for smooth on/off
      if (isOn && sprite.alpha < 1) {
        sprite.alpha += deltaTime * alphaSpeed;
      }
      if (!isOn && sprite.alpha > 0) {
        sprite.alpha -= deltaTime * alphaSpeed;
      }
    });

    setTimeout(() => ticker.start(), delayStart);
  }

  return { sprites: [sprite], start };
}
