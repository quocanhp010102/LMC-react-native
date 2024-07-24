import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ProfileScreen from './ProfileScreen';


const ProfileStack = createStackNavigator();

export const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="/ca-nhan" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};
