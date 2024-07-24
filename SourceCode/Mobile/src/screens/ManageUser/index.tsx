import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageUser from "./ManageUser";

const ManageUserStack = createStackNavigator();

export const ManageUserScreen = () => {
  return (
    <ManageUserStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageUserStack.Screen
        name="/quan-ly-nguoi-dung"
        component={ManageUser}
      />
    </ManageUserStack.Navigator>
  );
};
