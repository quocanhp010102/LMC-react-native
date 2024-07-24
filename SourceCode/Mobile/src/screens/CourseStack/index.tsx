import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CourseScreen from "./CourseScreen";
import CourseDetails from "./CourseDetails";
import LessonDetails from "./LessonDetails";
import ExamInfoScreen from "./ExamInfoScreen";
import TestStartScreen from "./TestStartScreen";
import EssayTestScreen from "./EssayTestScreen";
import CourseDetailsTeacher from "./CourseDetailsTeacher";
import CreateLesson from "./CreateLesson";
import CreateEssayTest from "./CreateEssayTest";
import CreateTest from "./CreateTest";
import lessonContent from "./lessonContent";
import AddQuestion from "./AddQuestion";

const CourseStack = createStackNavigator();
export const CourseStackScreen = () => {
  return (
    <CourseStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CourseStack.Screen name="/goc-hoc-tap" component={CourseScreen} />
      <CourseStack.Screen name="/chi-tiet-khoa-hoc" component={CourseDetails} />
      <CourseStack.Screen
        name="/chi-tiet-bai-giang"
        component={LessonDetails}
      />
      <CourseStack.Screen
        name="/thong-tin-bai-thi"
        component={ExamInfoScreen}
      />
      <CourseStack.Screen
        name="/bai-thi-trac-nghiem"
        component={TestStartScreen}
      />
      <CourseStack.Screen name="/bai-thi-tu-luan" component={EssayTestScreen} />
      <CourseStack.Screen
        name="/chi-tiet-khoa-hoc-gv"
        component={CourseDetailsTeacher}
      />
      <CourseStack.Screen name="/tao-bai-giang" component={CreateLesson} />
      <CourseStack.Screen
        name="/tao-bai-thi-tu-luan"
        component={CreateEssayTest}
      />
      <CourseStack.Screen
        name="/tao-bai-thi-trac-nghiem"
        component={CreateTest}
      />
      <CourseStack.Screen
        name="/tao-noi-dung-bai-giang"
        component={lessonContent}
      />
      <CourseStack.Screen name="/them-cau-hoi" component={AddQuestion} />
    </CourseStack.Navigator>
  );
};
