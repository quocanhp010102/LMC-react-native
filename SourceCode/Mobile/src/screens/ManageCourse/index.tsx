import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import EssayDetail from "./EssayDetail";
import ManageCourseScreen from "./ManageCourseScreen";
import ManageExamsCreated from "./ManageExamsCreated";
import ManageLessonScreen from "./ManageLessonScreen";
import StudentDetail from "./StudentDetail";
import TranscriptOfExam from "./TranscriptOfExam";
const ManageCourseStack = createStackNavigator();

export const ManageCourseStackScreen = () => {
  return (
    <ManageCourseStack.Navigator screenOptions={{ headerShown: false }}>
      <ManageCourseStack.Screen
        name="/quan-li-khoa-hoc"
        component={ManageCourseScreen}
      />
      <ManageCourseStack.Screen
        name="/quan-li-chi-tiet-khoa-hoc"
        component={ManageLessonScreen}
      />
      <ManageCourseStack.Screen
        name="/danh-sach-bai-thi-sinh-vien"
        component={StudentDetail}
      />
      <ManageCourseStack.Screen
        name="/chi-tiet-bai-thi-sinh-vien"
        component={EssayDetail}
      />
      <ManageCourseStack.Screen
        name="/danh-sach-bai-thi"
        component={ManageExamsCreated}
      />
      <ManageCourseStack.Screen
        name="/danh-sach-diem"
        component={TranscriptOfExam}
      />
    </ManageCourseStack.Navigator>
  );
};
