const OPTION_KEYS = [
  "x",
  "y",
  "vx",
  "vy",
  "width",
  "height",
  "scale",
  "rotation",
  "angle",
];
const OPTIONS_WITH_SET_FN = ["scale"];

export const addConfig = ({ pixiObject, config = {} }) => {
  for (let i = 0; i < OPTION_KEYS.length; i++) {
    const key = OPTION_KEYS[i];
    if (!config[key]) {
      continue;
    }

    if (OPTIONS_WITH_SET_FN.includes(key)) {
      pixiObject[key].set(config[key]);
      continue;
    }

    pixiObject[key] = config[key];
  }
};
