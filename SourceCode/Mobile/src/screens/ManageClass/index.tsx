import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageClass from "./ManageClass";
import EditClass from "./EditClass";
const ManageClassStack = createStackNavigator();

export const ManageClassScreen = () => {
  return (
    <ManageClassStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageClassStack.Screen name="/quan-ly-lop" component={ManageClass} />
      <ManageClassStack.Screen name="/chinh-sua-lop" component={EditClass} />
    </ManageClassStack.Navigator>
  );
};
