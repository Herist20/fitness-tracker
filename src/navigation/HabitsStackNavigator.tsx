import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HabitsScreen from '../screens/HabitsScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';

export type HabitsStackParamList = {
  HabitsList: undefined;
  HabitDetail: {
    habit: any;
  };
};

const Stack = createNativeStackNavigator<HabitsStackParamList>();

export default function HabitsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HabitsList" component={HabitsScreen} />
      <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
    </Stack.Navigator>
  );
}