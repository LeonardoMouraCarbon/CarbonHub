import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00d2c7",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f5f5f5",
          foreground: "#000000",
        },
        black: "#000000",
        grey: "#e5e5e5",
        cyano: "#00d2c7",
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#6b6b6b",
        },
        accent: {
          DEFAULT: "#00d2c7",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "fadeUp": {
          from: { transform: "translateY(30px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fadeIn": {
          from: { opacity: "0", scale: "1.2" },
          to: { opacity: "1", scale: "1.05" },
        },
        "marqueeScroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          from: { transform: "translateX(-20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 210, 199, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 210, 199, 0.6)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "blur-in": {
          from: { filter: "blur(10px)", opacity: "0" },
          to: { filter: "blur(0)", opacity: "1" },
        },
        "zoom-in": {
          from: { transform: "scale(0.8)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "slide-left": "slide-left 0.5s ease-out",
        "slide-right": "slide-right 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "rotate-slow": "rotate-slow 10s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "blur-in": "blur-in 0.6s ease-out",
        "zoom-in": "zoom-in 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
