import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StatusBar } from "react-native";
import { LoginScreen } from "../screens/LoginScreen";
import { NotificationScreen } from "../screens/NotificationScreen";
import { Search } from "../screens/Search";
import { LightNavigationTheme } from "../themes";
import MainScreen from "./MainScreen";
export const refLogout = React.createRef();
export const RootStack = createStackNavigator();

const Routes = () => {
  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <NavigationContainer theme={LightNavigationTheme} >
        <RootStack.Navigator
          initialRouteName="login"
          screenOptions={{ headerShown: false }}
        >
          <RootStack.Screen name="login" component={LoginScreen} />
          <RootStack.Screen name="main" component={MainScreen} />
          <RootStack.Screen
            name="notification"
            component={NotificationScreen}
          />
          <RootStack.Screen name="search" component={Search} />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Routes;
