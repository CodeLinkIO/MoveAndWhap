/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "game-tile": "url(./assets/tile_water.png)",
      },
      fontFamily: {
        game: ["PressStart2P", "sans-serif"],
      },
      dropShadow: {
        "game-title": "3px 3px 2px #000",
      },
      boxShadow: {
        button: "2px 2px 1px #000;",
      },
    },
  },
  plugins: [],
};
