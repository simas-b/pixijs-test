import { Application, Ticker } from "pixi.js";
import createWheelGame from "./createWheelGame";
import config from "../config";

// Start preparing as soon as possible
const setupPromise = setup();

window.addEventListener("load", async () => {
  // Wait for setup to finish if it hasn't yet.
  const { app } = await setupPromise;

  const rootElement = document.querySelector(
    config.wheelRootElementSelector
  ) as HTMLElement;

  await app.init({ resizeTo: rootElement, backgroundAlpha: 0 });
  rootElement.appendChild(app.canvas);

  // Calculate correct position initially
  // And on every window resize
  const initialStageWidth = app.stage.width;
  centerStage(app, initialStageWidth);

  app.renderer.addListener("resize", () => {
    centerStage(app, initialStageWidth);
  });

  // Launch game with fade-in
  const revealTicker = new Ticker();
  revealTicker.add(({ deltaTime }) => {
    if (app.stage.alpha >= 1) {
      revealTicker.destroy();
    }
    app.stage.alpha += deltaTime / 100;
  });

  setTimeout(() => revealTicker.start(), 0);
});

async function setup() {
  const app = new Application();
  app.stage.alpha = 0;

  const wheelGame = await createWheelGame();
  app.stage.addChild(wheelGame);

  return { app };
}

function centerStage(app: Application, initialStageWidth: number) {
  // Recenter
  app.stage.x = (app.screen.width - initialStageWidth) / 2;
}
