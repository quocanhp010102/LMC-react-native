import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import addCourse from "./AddCourse"
import editCourse from "./EditCourse"
import ManageCourse from "./ManageCourse"
import ManageSpecialized from "./ManageSpecialized"
import ManageSubject from "./ManageSubject"

const ManageSpecializedStack = createStackNavigator()

export const ManageSpecializedScreen = () => {
  return (
    <ManageSpecializedStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <ManageSpecializedStack.Screen
        name="/quan-ly-chuyen-nganh"
        component={ManageSpecialized}
      />
      <ManageSpecializedStack.Screen
        name="/quan-li-mon-hoc"
        component={ManageSubject}
      />
      <ManageSpecializedStack.Screen
        name="/quan-li-khoa-hoc"
        component={ManageCourse}
      />
      <ManageSpecializedStack.Screen
        name="/chinh-sua-khoa-hoc"
        component={editCourse}
      />
      <ManageSpecializedStack.Screen
        name="/them-khoa-hoc"
        component={addCourse}
      />
    </ManageSpecializedStack.Navigator>
  )
}
