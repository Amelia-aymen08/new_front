/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 950: "#031B17", 900: "#05241F", 800: "#08342D" },
        gold: { 500: "#E1BB7F", 600: "#CFA96E" },
        ink: "#0B0F10",
      },

      // dans theme.extend
keyframes: {
  ledOn: {
    "0%": { opacity: "0" },
    "10%": { opacity: "0.15" },
    "18%": { opacity: "0.05" },
    "30%": { opacity: "0.35" },
    "45%": { opacity: "0.18" },
    "65%": { opacity: "0.75" },
    "85%": { opacity: "0.55" },
    "100%": { opacity: "1" },
  },
  glowBreath: {
    "0%, 100%": { opacity: "0.14" },
    "50%": { opacity: "0.28" },
  },
  textReveal: {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  subReveal: {
    "0%": { opacity: "0", transform: "translateY(14px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  introCurtainUp: {
    "0%": { transform: "translateY(0)" },
    "100%": { transform: "translateY(-110%)" },
  },
  infoPulse: {
    "0%, 100%": { transform: "scale(1)", opacity: "0.75" },
    "50%": { transform: "scale(1.08)", opacity: "1" },
  },
 menuSlideIn: {
    "0%": { transform: "translateX(-40px)", opacity: "0" },
    "100%": { transform: "translateX(0)", opacity: "1" },
  },
   infoBlink: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.25" },
    },
    infoGlow: {
      "0%, 100%": {
        boxShadow: "0 0 0 rgba(225,187,127,0.0)",
      },
      "50%": {
        boxShadow: "0 0 22px rgba(225,187,127,0.65)",
      },
    },
    attnBlink: {
    "0%, 100%": { opacity: "0.15", boxShadow: "0 0 0 0 rgba(225,187,127,.0)" },
    "35%":      { opacity: "0.85", boxShadow: "0 0 0 10px rgba(225,187,127,.18)" },
    "55%":      { opacity: "0.35", boxShadow: "0 0 0 16px rgba(225,187,127,.08)" },
  },
},
animation: {
  ledOn: "ledOn 900ms ease-out forwards",
  glowBreath: "glowBreath 1.8s ease-in-out infinite",
  textReveal: "textReveal 700ms cubic-bezier(.2,.9,.2,1) forwards",
  subReveal: "subReveal 760ms cubic-bezier(.2,.9,.2,1) forwards",
  introCurtainUp: "introCurtainUp 900ms cubic-bezier(.2,.9,.2,1) forwards",
   menuSlideIn: "menuSlideIn 380ms cubic-bezier(.22,1,.36,1) both",
   infoPulse: "infoPulse 1.4s ease-in-out infinite",
   infoBlink: "infoBlink 1.2s ease-in-out infinite",
    infoGlow: "infoGlow 1.2s ease-in-out infinite",
    attnBlink: "attnBlink 1.25s ease-in-out infinite",
},

    },
  },
  plugins: [],
};
