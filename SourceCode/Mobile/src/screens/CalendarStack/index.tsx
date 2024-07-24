import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CalendarScreen from './CalendarScreen';


const CalendarStack = createStackNavigator();

export const CalendarStackScreen = () => {
  return (
    <CalendarStack.Navigator screenOptions={{ headerShown: false }}>
      <CalendarStack.Screen name="/ca-nhan" component={CalendarScreen} />
    </CalendarStack.Navigator>
  );
};
