import { Shadow, ShadowsPreset } from "../domain/DesignSystemDomain";
import ColorIO from "colorjs.io";

// Le tableau brut que tu as fourni
export const PRESET_RAW: {
  shadowsArray: string;
  shadowName: string;
  author?: string;
}[] = [
  {
    shadowsArray: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    shadowName: "#0",
  },
  {
    shadowsArray: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    shadowName: "#1",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
    shadowName: "#2",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    shadowName: "#3",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    shadowName: "#4",
    author: "3drops",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    shadowName: "#5",
  },
  {
    shadowsArray: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    shadowName: "#6",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px",
    shadowName: "#7",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    shadowName: "#8",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    shadowName: "#9",
    author: "Sketch",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
    shadowName: "#10",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
    shadowName: "#11",
    author: "Sketch",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
    shadowName: "#12",
    author: "Sketch",
  },
  {
    shadowsArray: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
    shadowName: "#13",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    shadowName: "#14",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    shadowName: "#15",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    shadowName: "#16",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    shadowName: "#17",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    shadowName: "#18",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
    shadowName: "#19",
    author: "Stripe",
  },
  {
    shadowsArray: "rgb(38, 57, 77) 0px 20px 30px -10px",
    shadowName: "#20",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
    shadowName: "#21",
    author: "Stripe",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
    shadowName: "#22",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    shadowName: "#23",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px",
    shadowName: "#24",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
    shadowName: "#25",
  },
  {
    shadowsArray:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
    shadowName: "#26",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    shadowName: "#27",
    author: "Material",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
    shadowName: "#28",
    author: "Material",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
    shadowName: "#29",
    author: "Material",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
    shadowName: "#30",
    author: "Material",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
    shadowName: "#31",
    author: "Material",
  },
  {
    shadowsArray:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    shadowName: "#32",
    author: "Material",
  },
  {
    shadowsArray:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    shadowName: "#33",
    author: "Material",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
    shadowName: "#34",
    author: "Tailwind CSS",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px",
    shadowName: "#35",
    author: "Tailwind CSS",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
    shadowName: "#36",
    author: "Tailwind CSS",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    shadowName: "#37",
    author: "Tailwind CSS",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    shadowName: "#38",
    author: "Tailwind CSS",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
    shadowName: "#39",
    author: "Tailwind CSS",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
    shadowName: "#40",
    author: "Tailwind CSS",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset",
    shadowName: "#41",
    author: "Tailwind CSS",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
    shadowName: "#42",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
    shadowName: "#43",
    author: "Tobias Ahlin",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
    shadowName: "#44",
    author: "Tobias Ahlin",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.2) 0px 18px 50px -10px",
    shadowName: "#45",
    author: "feedback.fish",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
    shadowName: "#46",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.04) 0px 3px 5px",
    shadowName: "#47",
  },
  {
    shadowsArray:
      "rgba(240, 46, 170, 0.4) -5px 5px, rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px, rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px",
    shadowName: "#48",
    author: "Alligator",
  },
  {
    shadowsArray:
      "rgba(240, 46, 170, 0.4) 0px 5px, rgba(240, 46, 170, 0.3) 0px 10px, rgba(240, 46, 170, 0.2) 0px 15px, rgba(240, 46, 170, 0.1) 0px 20px, rgba(240, 46, 170, 0.05) 0px 25px",
    shadowName: "#49",
    author: "Alligator",
  },
  {
    shadowsArray:
      "rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px, rgba(240, 46, 170, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px",
    shadowName: "#50",
    author: "Alligator",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px",
    shadowName: "#51",
  },
  {
    shadowsArray:
      "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
    shadowName: "#52",
    author: "pqina.nl/doka",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
    shadowName: "#53",
  },
  {
    shadowsArray:
      "rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset",
    shadowName: "#54",
    author: "Github",
  },
  {
    shadowsArray: "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px",
    shadowName: "#55",
    author: "Github",
  },
  {
    shadowsArray:
      "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
    shadowName: "#56",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
    shadowName: "#57",
    author: "Facebook",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
    shadowName: "#58",
    author: "Shopify",
  },
  {
    shadowsArray: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
    shadowName: "#59",
    author: "Shopify",
  },
  {
    shadowsArray:
      "rgb(0, 0, 255) 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px, rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px, rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px, rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px, rgb(255, 85, 85) 40px -40px",
    shadowName: "#60",
    author: "Fossheim",
  },
  {
    shadowsArray:
      "rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px",
    shadowName: "#61",
    author: "Fossheim",
  },
  {
    shadowsArray:
      "rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
    shadowName: "#62",
    author: "boxshadows.com",
  },
  {
    shadowsArray:
      "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
    shadowName: "#63",
    author: "boxshadows.com",
  },
  {
    shadowsArray: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
    shadowName: "#64",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
    shadowName: "#65",
    author: "box-shadows.co",
  },
  {
    shadowsArray: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
    shadowName: "#66",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
    shadowName: "#67",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
    shadowName: "#68",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px",
    shadowName: "#69",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px",
    shadowName: "#70",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px",
    shadowName: "#71",
    author: "box-shadows.co",
  },
  {
    shadowsArray:
      "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
    shadowName: "#72",
    author: "10er.app",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
    shadowName: "#73",
    author: "wip.chat",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
    shadowName: "#74",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.15) 0px 3px 3px 0px",
    shadowName: "#75",
    author: "Airbnb",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
    shadowName: "#76",
    author: "Airbnb",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
    shadowName: "#77",
    author: "Airbnb",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.18) 0px 2px 4px",
    shadowName: "#78",
    author: "Airbnb",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.1) -4px 9px 25px -6px",
    shadowName: "#79",
    author: "ls.graphics",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.2) 0px 60px 40px -7px",
    shadowName: "#80",
    author: "ls.graphics",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.4) 0px 30px 90px",
    shadowName: "#81",
    author: "Lonely Planet",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    shadowName: "#82",
    author: "Mac",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.2) 0px 20px 30px",
    shadowName: "#83",
    author: "Mac",
  },
  {
    shadowsArray:
      "rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px",
    shadowName: "#84",
    author: "Mac",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
    shadowName: "#85",
    author: "pqina.nl/doka",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
    shadowName: "#86",
    author: "Typedream",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
    shadowName: "#87",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
    shadowName: "#88",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
    shadowName: "#89",
  },
  {
    shadowsArray:
      "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
    shadowName: "#90",
  },
  {
    shadowsArray: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset",
    shadowName: "#91",
  },
  {
    shadowsArray:
      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
    shadowName: "#92",
    author: "Trello",
  },
  {
    shadowsArray:
      "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
    shadowName: "#93",
    author: "Trello",
  },
  {
    shadowsArray:
      "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
    shadowName: "#94",
    author: "Antimetal",
  },
  {
    shadowsArray:
      "rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px",
    shadowName: "#95",
    author: "Antimetal",
  },
];

function parseShadow(sh: string): Shadow {
  // On retire le mot-clé 'inset' s'il est présent
  const shadowStr = sh.replace(/\binset\b/, "").trim();
  const inset = /\binset\b/.test(sh);

  // 1) Essaie rgba(...)
  const rgbaMatch = shadowStr.match(
    /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)/i
  );
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    const color = new ColorIO(rgbaColor);
    color.alpha = 1;
    color.to("sRgb");

    // Extraire le "reste" après la couleur
    const rest = shadowStr.slice(rgbaMatch[0].length).trim();
    const parts = rest.split(/\s+/);

    // Nettoyage / valeurs par défaut
    let [xStr, yStr, blurStr, spreadStr] = parts;
    if (!xStr || xStr === "inset") xStr = "0px";
    if (!yStr || yStr === "inset") yStr = "0px";
    if (!blurStr || blurStr === "inset") spreadStr = blurStr = "0px";
    if (!spreadStr || spreadStr === "inset") spreadStr = "0px";

    // Convertisseur "XXpx" → number
    const pxToNum = (s: string) => {
      const num = parseFloat(s.replace(/px$/i, ""));
      if (Number.isNaN(num)) {
        throw new Error(`Valeur px invalide : "${s}"`);
      }
      return num;
    };

    const shadowX = pxToNum(xStr);
    const shadowY = pxToNum(yStr);
    const blur = pxToNum(blurStr);
    const spread = pxToNum(spreadStr);
    const colorOpacity = parseFloat(a);

    return {
      color: color.toString({ format: "hex" }),
      shadowX,
      shadowY,
      blur,
      spread,
      colorOpacity,
      inset,
    };
  }

  // 2) Essaie rgb(...)
  const rgbMatch = shadowStr.match(
    /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/i
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const color = new ColorIO(rgbColor);

    // Même logique pour les valeurs px
    const rest = shadowStr.slice(rgbMatch[0].length).trim();
    const parts = rest.split(/\s+/);

    let [xStr, yStr, blurStr, spreadStr] = parts;
    if (!xStr || xStr === "inset") xStr = "0px";
    if (!yStr || yStr === "inset") yStr = "0px";
    if (!blurStr || blurStr === "inset") blurStr = "0px";
    if (!spreadStr || spreadStr === "inset") spreadStr = "0px";

    const pxToNum = (s: string) => {
      const num = parseFloat(s.replace(/px$/i, ""));
      if (Number.isNaN(num)) {
        throw new Error(`Valeur px invalide : "${s}"`);
      }
      return num;
    };

    const shadowX = pxToNum(xStr);
    const shadowY = pxToNum(yStr);
    const blur = pxToNum(blurStr);
    const spread = pxToNum(spreadStr);
    const colorOpacity = 1; // plein opaque pour rgb()

    return {
      color: color.toString({ format: "hex" }),
      shadowX,
      shadowY,
      blur,
      spread,
      colorOpacity,
      inset,
    };
  }

  throw new Error(`Format d'ombre non supporté : "${sh}"`);
}

// Transforme chaque entrée brute en Shadows
export function transformShadows(
  raw: { shadowsArray: string; shadowName: string; author?: string }[]
): ShadowsPreset[] {
  return raw.map(({ shadowName, shadowsArray, author }) => {
    // on découpe sur les virgules hors parenthèses
    const list: string[] = [];
    let depth = 0,
      buf = "";
    for (const ch of shadowsArray) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        list.push(buf);
        buf = "";
      } else {
        buf += ch;
      }
    }
    if (buf) list.push(buf);

    return {
      shadowName: shadowName.replace("#",""),
      shadowsArray: list.map((s) => parseShadow(s.trim())),
      author,
    };
  });
}
