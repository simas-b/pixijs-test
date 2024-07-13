import { Application, Sprite, Ticker } from "pixi.js";
import createLetters from "./createLetters";
import createBolt from "./createBolt";
import config from "../config";
import createNeonBanner from "./createNeonBanner";
import createOutline from "./createOutline";

// Start preparing as soon as possible
const setupPromise = setup();

window.addEventListener("load", async () => {
  // Wait for setup to finish if it hasn't yet.
  const { app, startAnimation } = await setupPromise;

  const rootElement = document.querySelector(
    config.showdownRootElementSelector
  ) as HTMLElement;

  await app.init({ resizeTo: rootElement, backgroundAlpha: 0 });
  rootElement.appendChild(app.canvas);

  // Calculate correct position initially
  // And on every window resize
  const initialStageHeight = app.stage.height;
  scaleAndCenter(app, initialStageHeight);

  window.addEventListener("resize", () => {
    setTimeout(() => scaleAndCenter(app, initialStageHeight));
  });

  // Reveal stage and start animation
  const ticker = new Ticker();
  ticker.add(({ deltaTime }) => {
    app.stage.alpha += deltaTime / 30;
    if (app.stage.alpha >= 1) {
      startAnimation();
      ticker.destroy();
    }
  });

  ticker.start();
  // app.stage.alpha = 1;
  // startAnimation();
});

async function setup() {
  const app = new Application();
  app.stage.alpha = 0;

  type Component = {
    sprites: Sprite[];
    start?: () => void;
  };

  // Create all components for the animation
  const components = await Promise.all<Component>([
    createOutline(),
    createLetters(),
    createBolt(),
    createNeonBanner({
      textureName: "vegas-slots",
      delayStart: config.vegasSlots.delayStart,
      blackouts: config.vegasSlots.blackouts,
      alphaSpeed: config.vegasSlots.alphaSpeed,
    }),
    createNeonBanner({
      textureName: "must-drop",
      delayStart: config.mustDropJackpots.delayStart,
      blackouts: config.mustDropJackpots.blackouts,
      alphaSpeed: config.mustDropJackpots.alphaSpeed,
    }),
  ]);

  app.stage.addChild(...components.flatMap((component) => component.sprites));

  function startAnimation() {
    for (const component of components) {
      component.start?.();
    }
  }

  return {
    app,
    startAnimation,
  };
}

function scaleAndCenter(app: Application, initialStageHeight: number) {
  /**
   * Try to guess best animation/texture size for initial screen, but scale to accomodate all breakpoints.
   *
   * Initial stage height will be either 150px or 500px, depending on screen size web page was opened at.
   * So when animation's root HTML container (and subsequently app.screen.height) is 150px with
   * small textures loaded or 500px with big textures loaded Scale will be 1 and animation will look best.
   *
   * See also loadTextureForScreenSize() in utils.ts and header element properties in index.css for context.
   */

  app.stage.scale = app.screen.height / initialStageHeight;

  app.stage.x = (app.screen.width - app.stage.width) / 2;
  app.stage.y = (app.screen.height - app.stage.height) / 2;
}
