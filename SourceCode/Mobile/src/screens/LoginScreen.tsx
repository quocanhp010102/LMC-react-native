// This is Expo's app json where your scheme should be defined
import {Box} from "../rebass";
import React from "react";
import {Auth} from "./LoginScreen/Auth";

const splashImage = require("../../assets/splash.png");
export const LoginScreen = () => {

  return (
  <Box style={{ flex : 1}}>
    <Auth />
  </Box>
  );
};
