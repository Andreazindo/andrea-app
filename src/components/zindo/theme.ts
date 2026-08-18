import { Jost, Mulish } from "next/font/google";

export const zindoHeadingFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-zindo-heading",
});
export const zindoBodyFont = Mulish({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-zindo-body",
});

export const zindoColors = {
  ink: "#1A1A1A",
  green: "#0D3B36",
  sage: "#9CBA9D",
  gold: "#C9A15B",
  ivory: "#EEE7DF",
};

export const zindoFontVars = `${zindoHeadingFont.variable} ${zindoBodyFont.variable}`;
