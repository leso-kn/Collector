import {Dimensions} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

export const PREVIEW_POST = 0
export const FIRST_POST = 1
export const OTHER_POST = 2
export const EMBEDDED_POST = 3
export const HOT_FIRST = 0
export const OLD_FIRST = 1
export const deviceWidth = Dimensions.get("screen").width
export const themeDefault = {
    color: "#f5deb3",
    postBackGroundColor:"white",
    textColor:"black",
    borderColor:"black",
    backgroundColor: "white",
    navigationTheme: DefaultTheme,
}
export const darkTheme = {
    color: "#121212",
    postBackGroundColor:"#121212",
    textColor: undefined,
    buttonColor: "white",
    buttonOpacity: 0.6,
    borderColor: "white",
    intervalColor: "rgba(31,27,36,0.9)",
    buttonBackgroundColor: "#bb86fc",
    navigationTheme: DarkTheme,
    tabBarColor:"#121212",
    backgroundColor: "black"
}
