import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import QuestionBankScreen from "./QuestionBankScreen";

const QuestionBankStack = createStackNavigator();

export const QuestionBankStackScreen = () => {
  return (
    <QuestionBankStack.Navigator screenOptions={{ headerShown: false }}>
      <QuestionBankStack.Screen
        name="/ngan-hang-cau-hoi"
        component={QuestionBankScreen}
      />
    </QuestionBankStack.Navigator>
  );
};
