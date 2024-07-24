import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageNotification from "./ManageNotification";

const ManageNotificationStack = createStackNavigator();

export const ManageNotificationScreen = () => {
  return (
    <ManageNotificationStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageNotificationStack.Screen
        name="/quan-ly-nguoi-dung"
        component={ManageNotification}
      />
    </ManageNotificationStack.Navigator>
  );
};
