import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F6F8",
        surface: "#FFFFFF",
        ink: "#0F1A20",
        muted: "#5B6B73",
        line: "#E4E8EA",
        brand: "#0E7C66",
        brandSoft: "#E6F2EE",
        expense: "#D14343",
        ai: "#6D5DD3",
        aiSoft: "#EFEBFB",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,26,32,0.04), 0 1px 3px rgba(15,26,32,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
