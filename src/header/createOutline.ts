import { Sprite } from "pixi.js";
import { loadTextureForScreenSize } from "./loadTextureForScreenSize";

export default async function createOutline() {
  const texture = await loadTextureForScreenSize("showdown-off");
  texture.source.autoGenerateMipmaps = true;
  const sprite = new Sprite({ texture });

  return { sprites: [sprite] };
}
