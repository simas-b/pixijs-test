import { Assets, Container, Sprite, Texture, Ticker } from "pixi.js";
import config from "../config";
import showDialog from "./dialogController";

const { PI } = Math;

// Safety margin to keep away from zone dividers (radians)
const SAFETY_MARGIN = 0.1;

// wheel regions and their min/max rotation values
let regions = [
  { color: "blue", min: 0, max: PI / 2 },
  { color: "green", min: PI / 2, max: PI },
  { color: "purple", min: PI, max: (3 / 2) * PI },
  { color: "orange", min: (3 / 2) * PI, max: 2 * PI },
];

regions = regions.map((region) => ({
  color: region.color,
  min: region.min + SAFETY_MARGIN,
  max: region.max - SAFETY_MARGIN,
}));

export default async function createWheelGame() {
  // ------------- WHEEL SPRITE

  const wheelTexture = await Assets.load<Texture>("/img/wheel@2x.png");
  wheelTexture.source.autoGenerateMipmaps = true;
  const wheelSprite = new Sprite({
    texture: wheelTexture,
    anchor: { x: 0.5, y: 0.5 },
  });

  wheelSprite.y = wheelSprite.height / 2 + 20;
  wheelSprite.x = wheelSprite.width / 2;

  // ------------- MARKER SPRITE

  const markerTexture = await Assets.load<Texture>("/img/marker@2x.png");
  markerTexture.source.autoGenerateMipmaps = true;
  const markerSprite = new Sprite({
    texture: markerTexture,
    anchor: { x: 0.5, y: 0.5 },
  });
  markerSprite.x = wheelSprite.width / 2;
  markerSprite.y = markerSprite.height / 2;

  // ------------- BUTTON SPRITE

  const buttonTexture = await Assets.load<Texture>("/img/btn-spin@2x.png");
  buttonTexture.source.autoGenerateMipmaps = true;
  const buttonSprite = new Sprite({
    texture: buttonTexture,
    anchor: { x: 0.5, y: 1 },
  });

  buttonSprite.y = wheelSprite.height + 70;
  buttonSprite.x = wheelSprite.width / 2;

  buttonSprite.eventMode = "static";
  buttonSprite.cursor = "pointer";

  let isButtonEnabled = true;

  // ------------- BUTTON CLICK HANDLER

  buttonSprite.on("pointerdown", async () => {
    if (!isButtonEnabled) return;
    isButtonEnabled = false;
    buttonSprite.alpha = 0.3;

    // Fetch position from API
    let position: number | undefined = undefined;
    try {
      const response = await fetch("/api/position");
      if (!response.ok) throw Error();

      position = (await response.json<{ POSITION: number }>()).POSITION;
    } catch {
      alert("Oops, the wheel is out of order. Please try again later.");
      return enableButton();
    }

    console.log(
      `API responded with position ${position}. Wheel will stop at ${
        regions[position!].color
      } region.`
    );
    spin(position!);
  });

  function enableButton() {
    buttonSprite.alpha = 1;
    isButtonEnabled = true;
  }

  // ------------- SPIN FUNCTION

  function spin(desiredPosition: number) {
    const ticker = new Ticker();

    // Normalize current rotation value so it's always between 0 and 2*PI
    wheelSprite.rotation = wheelSprite.rotation %= 2 * Math.PI;

    // Pick random place in desired position
    const desiredRotation = numberBetween(
      regions[desiredPosition].min,
      regions[desiredPosition].max
    );

    // Decide how many full circles to go this time
    const randomRotations = (3 + Math.ceil(Math.random()) * 7) * 2 * PI;

    // Take into account current wheel rotation and calculate rotation left
    let rotationLeft = desiredRotation + randomRotations - wheelSprite.rotation;

    ticker.add(({ deltaTime }) => {
      const rotationAmount =
        deltaTime * (rotationLeft / 100) * config.wheelSpinSpeed;

      // Stop the wheel if it has come close enough to desired position
      if (rotationLeft < SAFETY_MARGIN / 2) {
        handleGameEnd(desiredPosition);
        return ticker.destroy();
      }

      // Emergency stop if we risk overshooting target
      // This can only happen with very extreme deltaTime
      if (rotationLeft < rotationAmount) {
        wheelSprite.rotation = desiredRotation;
        handleGameEnd(desiredPosition);
        return ticker.destroy();
      }

      wheelSprite.rotation += rotationAmount;
      rotationLeft -= rotationAmount;
    });

    ticker.start();
  }

  // ------------- GAME END HANDLER

  async function handleGameEnd(position: number) {
    try {
      const response = await fetch("/api/dadjoke");
      if (!response.ok) throw Error();

      const { joke } = (await response.json()) as { joke: string };
      showDialog(
        joke,
        regions[position].color as "blue" | "purple" | "green" | "orange"
      );
    } catch {
      // fail silently if we unable to get joke from API
      return;
    } finally {
      enableButton();
    }
  }

  // Assemble the wheel game to single container
  const container = new Container();
  container.addChild(wheelSprite, markerSprite, buttonSprite);

  return container;
}

function numberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
