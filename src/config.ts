export default {
  // HEADER CONFIG
  showdownRootElementSelector: "#header-root",
  vegasSlots: {
    delayStart: 300,
    alphaSpeed: 0.4,
    blackouts: [
      { begin: 450, end: 510 },
      { begin: 690, end: 740 },
    ],
  },
  showdown: {
    delayStart: 700,
    alphaSpeed: 0.09,
    revealInterval: 180,
  },
  bolt: {
    delayStart: 1400,
    flickerInterval: 10 * 1000,
  },
  mustDropJackpots: {
    alphaSpeed: 0.4,
    delayStart: 3000,
    blackouts: [
      { begin: 250, end: 300 },
      { begin: 480, end: 520 },
    ],
  },

  // WHEEL CONFIG
  wheelRootElementSelector: "#wheel-root",
  wheelSpinSpeed: 1,
};
