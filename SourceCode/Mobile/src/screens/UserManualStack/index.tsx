import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import UserManualScreen from "./UserManualScreen";
import ViewFeedBack from "./ViewFeedBack";

const UserManualtack = createStackNavigator();

export const UserManualtackScreen = () => {
  return (
    <UserManualtack.Navigator screenOptions={{ headerShown: false }}>
      <UserManualtack.Screen
        name="/huong-dan-su-dung"
        component={UserManualScreen}
      />
      <UserManualtack.Screen name="xem-phan-hoi" component={ViewFeedBack} />
    </UserManualtack.Navigator>
  );
};
