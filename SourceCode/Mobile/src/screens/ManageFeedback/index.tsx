import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageFeedback from "./ManageFeedback";

const ManageFeedbackStack = createStackNavigator();

export const ManageFeedbackScreen = () => {
  return (
    <ManageFeedbackStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageFeedbackStack.Screen
        name="/quan-ly-nguoi-dung"
        component={ManageFeedback}
      />
    </ManageFeedbackStack.Navigator>
  );
};
