import { AnimatedSprite } from "pixi.js";
import config from "../config";
import { loadTextureForScreenSize } from "./loadTextureForScreenSize";

export default async function createBolt() {
  const boltTextures = await Promise.all(
    ["bolt-off", "bolt-on"].map(loadTextureForScreenSize)
  );

  for (const texture of boltTextures) {
    texture.source.autoGenerateMipmaps = true;
  }

  const boltPattern = [0, 1, 0, 1, 0, 0, 1, 0, 1];
  const sprite = new AnimatedSprite(boltPattern.map((i) => boltTextures[i]));
  sprite.animationSpeed = 0.3;
  sprite.visible = false;
  sprite.loop = false;

  function start() {
    setTimeout(() => {
      sprite.visible = true;
      sprite.play();
    }, config.bolt.delayStart);

    // Flicker every 10 seconds
    setInterval(() => sprite.gotoAndPlay(0), config.bolt.flickerInterval);
  }

  return { sprites: [sprite], start };
}
