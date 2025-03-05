/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      bordergray: "#20212d",
      darkgray: "#141920",
      gray: "#202633",
      lightgray: "#2E3543",
      gold: "#FFBF00",
      whitegrey: "#9FA0A3",
      white: "#FEFEFE",
      green: "#3CBC76",
      red: "#CC3E3E",
      blue: "#0096ff",
      dark: {
        DEFAULT: "#13141B",
        100: "#BEC2D1",
        200: "#BEC2D1",
        250: "#2B2C35",
        260: "#21222F",
        300: "#373A46",
        350: "#5C6070",
        400: "#515666",
        450: "#535662",
        460: "#181A21",
        500: "#13141B",
        600: "#1A1C24",
        700: "#111318",
        800: "#27292E",
      },
      primary: {
        DEFAULT: "#FFA843",
        50: "#FFFDFB",
        100: "#FFF4E6",
        200: "#FFE1BD",
        300: "#FFCE95",
        400: "#FFBB6C",
        500: "#FFA843",
        600: "#FF8E0B",
        700: "#D27100",
        800: "#9A5300",
        900: "#623400",
        950: "#462500",
      },
      secondary: {
        DEFAULT: "#28B761",
        50: "#AAECC5",
        100: "#99E9B9",
        200: "#78E1A2",
        300: "#56DA8B",
        400: "#35D374",
        500: "#28B761",
        600: "#1E8949",
        700: "#145B30",
        800: "#0A2D18",
        900: "#000000",
        950: "#000000",
      },
    },
    extend: {
      colors: {
        main: "#111318",
        primary: "#E7A000",
        primaryTag: "rgba(231, 160, 0, .35)",
        placeHolder: "#808080",
        border: "#252936",
        card: "#181A21",
        textOpacity: "rgba(255,255,255,.5)",
      },
      width: {
        container: "1440px",
      },
      height: {
        input: "50px",
      },
      maxWidth: {
        container: "1440px",
      },
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }
        "lg-mid": "1120px",
        // => @media (min-width: 1120px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      // {
      //   "animation": {
      //     shimmer: "shimmer 2s linear infinite"
      //   },
      //   "keyframes": {
      //     shimmer: {
      //       from: {
      //         "backgroundPosition": "0 0"
      //       },
      //       to: {
      //         "backgroundPosition": "-200% 0"
      //       }
      //     }
      //   }
      // }
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        wave: {
          "0%": {
            transform: "translate(-50%, -50%) rotate(0deg)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-50%, -50%) rotate(360deg)",
            opacity: "0",
          },
        },
        yticker: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(0, -50%)" },
        },
        ytickerInv: {
          "0%": { transform: "translate(0, -50%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        xticker: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-100%, 0)" },
        },
        xtickerInv: {
          "0%": { transform: "translate(-100%, 0)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "spin-wave": "wave 2s linear 1 forwards",
        yticker: "yticker 10s linear infinite",
        "yticker-inv": "ytickerInv 10s linear infinite",
        xticker: "xticker 10s linear infinite",
        "xticker-inv": "xtickerInv 10s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "game-coinflip": "url(/game_images/coinflip.webp)",
        "game-jackpot": "url(/game_images/jackpot.webp)",
        "game-rockps": "url(/game_images/rockps.webp)",
        "game-poker": "url(/game_images/poker.webp)",
      },
      spacing: {
        4: "1rem",
        6: "1.5625rem",
        7: "1.875rem",
        16: "3.75rem",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        "4xl": "2rem",
        "3xl": "2.375rem",
        "2xl": "1.125rem",
        xl: "15px",
        lg: "10px",
        sm: "6px",
      },
      fontSize: {
        "3xl": "2.25rem",
        "4xl": "2.5rem",
        "5xl": "2.875rem",
      },
    },
  },
  plugins: [],
};
