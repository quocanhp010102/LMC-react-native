import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageUserManual from "./ManageUserManual";

const ManageUserManualStack = createStackNavigator();

export const ManageUserManualScreen = () => {
  return (
    <ManageUserManualStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageUserManualStack.Screen
        name="/quan-ly-nguoi-dung"
        component={ManageUserManual}
      />
    </ManageUserManualStack.Navigator>
  );
};
