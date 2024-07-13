import { Sprite, Ticker } from "pixi.js";
import config from "../config";
import { loadTextureForScreenSize } from "./loadTextureForScreenSize";

const { revealInterval, alphaSpeed } = config.showdown;

export default async function createLetters() {
  const letterTextures = await Promise.all(
    ["s", "h", "o1", "w1", "d", "o2", "w2", "n"].map(loadTextureForScreenSize)
  );

  const sprites: Sprite[] = [];

  for (const texture of letterTextures) {
    texture.source.autoGenerateMipmaps = true;
    const sprite = new Sprite({ texture, visible: false, alpha: 0 });
    sprites.push(sprite);
  }

  function start() {
    const ticker = new Ticker();
    let elapsed = 0;

    ticker.add(({ elapsedMS, deltaTime }) => {
      elapsed += elapsedMS;

      // Destroy ticker if we're past last letter
      if (sprites[sprites.length - 1].alpha >= 1) ticker.destroy();

      for (let i = 0; i < sprites.length; i++) {
        if (elapsed > (i + 1) * revealInterval) sprites[i].visible = true;

        if (sprites[i].visible && sprites[i].alpha < 1) {
          sprites[i].alpha += deltaTime * alphaSpeed;
        }
      }
    });

    setTimeout(() => ticker.start(), config.showdown.delayStart);
  }

  return { sprites, start };
}
