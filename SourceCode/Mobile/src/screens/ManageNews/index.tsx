import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageNews from "./ManageNews";
import CreateNews from "./CreateNews";
import NewsContent from "./NewsContent";
import ViewNews from "./ViewNews";
const ManageNewsStack = createStackNavigator();

export const ManageNewsScreen = () => {
  return (
    <ManageNewsStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageNewsStack.Screen name="/quan-ly-tin-tuc" component={ManageNews} />
      <ManageNewsStack.Screen name="/tao-tin-tuc" component={CreateNews} />
      <ManageNewsStack.Screen
        name="/tao-noi-dung-tin-tuc"
        component={NewsContent}
      />
      <ManageNewsStack.Screen name="/chi-tiet-tin-tuc" component={ViewNews} />
    </ManageNewsStack.Navigator>
  );
};
