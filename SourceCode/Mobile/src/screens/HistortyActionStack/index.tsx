import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HistoryActionScreen from './HistoryActionScreen';


const HistoryActionStack = createStackNavigator();

export const HistoryActionStackScreen = () => {
    return (
        <HistoryActionStack.Navigator screenOptions={{ headerShown: false }}>
            <HistoryActionStack.Screen name="/lich-su-hoat-dong" component={HistoryActionScreen} />
        </HistoryActionStack.Navigator>
    );
};
