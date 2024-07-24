import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ManageCourse from "../ManageSpecialized/ManageCourse";
import DepartmentsScreen from "./DepartmentsScreen";
import DisplayNew from "./DisplayNew";
import HomeScreen from "./HomeScreen";
import NewsScreen from "./NewsScreen";
import DepartmentDetail from "./DepartmentDetail";
const HomeStack = createStackNavigator();

export const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator  initialRouteName="/" screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="/" component={HomeScreen} />
      {/* <HomeStack.Screen name="notification" component={NotificationScreen}/> */}
      <HomeStack.Screen name="/tat-ca-khoa" component={DepartmentsScreen} />
      <HomeStack.Screen name="/chi-tiet-tin" component={DisplayNew} />
      <HomeStack.Screen name="/quan-li-khoa-hoc" component={ManageCourse} />
      <HomeStack.Screen name="/danh-sach-tin-tuc" component={NewsScreen} />
      <HomeStack.Screen name="/chi-tiet-khoa" component={DepartmentDetail} />
    </HomeStack.Navigator>
  );
};
