// js/tailwind-config.js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        navybg: "#041c44",
        navblue: "#041c44",
        cyanaccent: "#00a8ff",
        searchbg: "#0c2759",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
};
