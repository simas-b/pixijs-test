import { Assets, Texture } from "pixi.js";

// Load texture optimized for screen width
export function loadTextureForScreenSize(name: string) {
  const isSmallScreen = window.innerWidth < 640 || isMobileLandscape();
  const url = `/img${isSmallScreen ? "/small" : ""}/${name}@2x.png`;

  return Assets.load<Texture>(url);
}

function isMobileLandscape() {
  return window.innerHeight < 600 && window.innerWidth > window.innerHeight;
}
