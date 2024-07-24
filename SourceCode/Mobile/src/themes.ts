import { DefaultTheme } from "@react-navigation/native";
import { Platform, TextStyle } from "react-native";
import { TextColorProps, TypographyProps } from "styled-system";
import { StyledButtonProps } from "./rebass/others";

export const gradients = ["linear-gradient(270deg, #11998E 0%, #38EF7D 100%)"];
export const baseColors = {
  white: "white",
  green: "#22E26B",
  yellow: "#FDCC26",
  gray: "#262523",
  red: "#F73939",
};
const darkColors = {
  // primary: baseColors.yellow,
  // secondary: baseColors.green,
  // ...baseColors,
  // lightText: '#AAAAAA',
  // normalText: 'white',
  // defaultBackground: '#262523',
  // alternativeBackground: '#32302E',
  // lightBackground: '#5A5A5A',
  // separator: '#3D3D3F',
  // headerText: 'white',
  // emptyCheckBox: '#757577',
  // tabBar: '#3D3D3F',
  // tabBarSeparator: '#5A5A5A',
  // playerSeekBar: '#323232',
  // playerCue: 'white',
  // listItemCaret: '#C7C7CC',
  // inputClose: '#848484',
  // violet: '#D8BFD8',
  // seen: '#636363',
  ...baseColors,
  primary: baseColors.yellow,
  secondary: baseColors.green,
  lightText: "#AAAAAA",
  normalText: "#262523",
  defaultBackground: "white",
  alternativeBackground: "#F1F1F1",
  lightBackground: "#EEEEEE",
  separator: "#F1F1F1",
  headerText: "#262523",
  emptyCheckBox: "#DDDDDD",
  tabBar: "#F1F1F1",
  tabBarSeparator: "#EEEEEE",
  playerSeekBar: "#DDDDDD",
  playerCue: "#444444",
  listItemCaret: "#C7C7CC",
  inputClose: "#DDDDDD",
  seen: "#636363",
  buttonColor: "#00A8B5",
  textColor: "#00A8B5",
  editColor: "#FFB800",
  deleteColor: "#CC0000",
  cancelColor: "#FD1A1A",
  inputColor: "1px solid rgba(125, 125, 125, 0.5)",
  iconFileColor: "2px solid rgba(99, 99, 99, 0.3)",
  exclamationPoint: "#DADADA",
  placeHolderColor : "#a9a9a9"
};
export const lightColors = {
  ...baseColors,
  primary: baseColors.yellow,
  secondary: baseColors.green,
  lightText: "#AAAAAA",
  normalText: "#262523",
  defaultBackground: "white",
  alternativeBackground: "#F1F1F1",
  lightBackground: "#EEEEEE",
  separator: "#F1F1F1",
  headerText: "#262523",
  emptyCheckBox: "#DDDDDD",
  tabBar: "#F1F1F1",
  tabBarSeparator: "#EEEEEE",
  playerSeekBar: "#DDDDDD",
  playerCue: "#444444",
  listItemCaret: "#C7C7CC",
  inputClose: "#DDDDDD",
  seen: "#636363",
  buttonColor: "#00A8B5",
  textColor: "#00A8B5",
  editColor: "#FFB800",
  cancelColor: "#FD1A1A",
  deleteColor: "#CC0000",
  _FF3B2F: "#FF3B2F",
  inputColor: "1px solid rgba(125, 125, 125, 0.5)",
  iconFileColor: "2px solid rgba(99, 99, 99, 0.3)",
  exclamationPoint: "#DADADA",
  borderColor : "#D4D4D4" , 
  icCheckColor : "#32813D" ,
  placeHolderColor : "#a9a9a9"
  
} 

const fontSizes = [10, 12, 14, 17, 20, 23, 30, 42];
const heights = [32, 48];
interface ButtonVariant extends StyledButtonProps {
  text: TypographyProps & TextColorProps;
  textStyle?: {
    textDecorationColor: TextStyle["textDecorationColor"];
    textDecorationLine: TextStyle["textDecorationLine"];
    textDecorationStyle: TextStyle["textDecorationStyle"];
    textTransform?: TextStyle["textTransform"];
  };
  gradient?: { colors: string[]; locations?: [number, number][] };
}

const buttonVariants: { [key: string]: ButtonVariant } = {
  default: {
    text: { fontSize: 2, fontFamily: "body", fontWeight: "bold" },
    height: heights[0],
  },
  primary: {
    text: {
      color: "#262523",
      fontSize: 2,
      fontWeight: "bold",
    },
    bg: "primary",
  },
  secondary: {
    text: {
      color: "white",
      fontSize: 2,
      fontWeight: "bold",
    },
    gradient: {
      colors: ["#38EF7D", "#11998E"],
    },
    borderRadius: 16,
  },
  secondary1: {
    text: {
      color: "white",
      fontSize: 2,
      fontWeight: "bold",
    },
    gradient: {
      colors: ["#38EF7D", "#11998E"],
    },
    borderRadius: 8,
  },
  outline: {
    text: {},
    borderRadius: 8,
    borderColor: "#979797",
    borderWidth: 1,
  },
  outlineDanger: {
    text: {
      color: "#FC6767",
    },
    borderRadius: 8,
    borderColor: "#FC6767",
    borderWidth: 1,
  },
  muted: {
    border: "none",
    text: {
      fontSize: 2,
    },
    bg: "#3D3D3F",
    padding: "24px 10px",
  },
  underline: {
    border: "none",
    bg: "transparent",
    text: {
      color: "#848484",
      fontSize: 12,
    },
    textStyle: {
      textDecorationColor: "#848484",
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textTransform: "uppercase",
    },
  },
  transparent: {
    border: "none",
    bg: "transparent",
    text: {
      color: "#848484",
      fontSize: 16,
      fontWeight: 700,
    },
  },
};

const themeCommon = {
  breakpoints: ["40em", "52em", "64em"],
  space: [0, 5, 10, 15, 20, 30, 40, 50, 60, 100, 200],
  fontSizes,
  fonts: {
    body: Platform.select({
      web: "Helvetica",
      ios: "Helvetica",
      android: "Roboto",
    }),
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  shadows: {
    small: "0 0 4px rgba(0, 0, 0, .125)",
    large: "0 0 24px rgba(0, 0, 0, .125)",
  },
  variants: {},
  text: {
    color: "normalText",
  },
  buttons: buttonVariants,
};

export const darkTheme = {
  ...themeCommon,
  colors: lightColors,
  name: "dark",
};

export const DarkNavigationTheme: typeof DefaultTheme = {
  dark: true,
  colors: {
    primary: darkColors.primary,
    background: darkColors.defaultBackground,
    card: darkColors.tabBar,
    text: darkColors.normalText,
    border: darkColors.tabBarSeparator,
    notification: darkColors.primary,
  },
};

export const LightNavigationTheme: typeof DefaultTheme = {
  dark: true,
  colors: {
    primary: lightColors.primary,
    background: lightColors.defaultBackground,
    card: lightColors.tabBar,
    text: lightColors.normalText,
    border: lightColors.tabBarSeparator,
    notification: lightColors.primary,
  },
};

export const lightTheme = {
  ...themeCommon,
  colors: lightColors,
  name: "light",
} 

export type Theme = typeof lightTheme;
