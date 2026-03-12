import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050A0E",
        accent: "#00E5A0",
      },
      fontFamily: {
        space: ["var(--font-space-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
