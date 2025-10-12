import { Template } from "./types";

export const MIN_URL_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;

export const TEMPLATES: Template[] = [
  {
    id: "flash",
    title: "Flash",
    colorsList: [
      "#4F21A1",
      "#BE8406",
      "#9B3218",
      "#05722C",
      "#182E9B",
      "#212121",
    ],
  },
  {
    id: "prime",
    title: "Prime",
    colorsList: [
      "#010101",
      "#E9E9E9",
      "#F0E5E0",
      "#223630",
      "#621D1E",
      "#08306C",
    ],
  },
  {
    id: "minimal",
    title: "Minimal",
    colorsList: [
      "#000000",
      "#FFFFFF",
      "#F5F5F5",
      "#333333",
      "#666666",
      "#999999",
    ],
  },
  {
    id: "grid",
    title: "Grid",
    colorsList: [
      "#2C2C2C",
      "#146EF4",
      "#78838E",
      "#294D41",
      "#5E4D35",
      "#7C4257",
    ],
  },
];
