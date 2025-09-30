import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import DashboardScreen from '../screens/DashboardScreen';
import HabitsStackNavigator from './HabitsStackNavigator';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
    }}>
      <View style={{
        marginHorizontal: 24,
        marginBottom: 12,
      }}>
        <View style={{
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 10,
          backgroundColor: 'white',
        }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            paddingVertical: 8,
            paddingHorizontal: 4,
          }}>
            {state.routes.map((route: any, index: number) => {
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              let iconName: keyof typeof Ionicons.glyphMap;
              let label: string;

              if (route.name === 'Dashboard') {
                iconName = isFocused ? 'home' : 'home-outline';
                label = 'Home';
              } else if (route.name === 'Habits') {
                iconName = isFocused ? 'checkmark-circle' : 'checkmark-circle-outline';
                label = 'Habits';
              } else if (route.name === 'Workouts') {
                iconName = isFocused ? 'barbell' : 'barbell-outline';
                label = 'Workouts';
              } else if (route.name === 'Profile') {
                iconName = isFocused ? 'person' : 'person-outline';
                label = 'Profile';
              } else {
                iconName = 'help-circle';
                label = 'Tab';
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 4,
                    backgroundColor: isFocused
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'transparent',
                    borderRadius: 14,
                    marginHorizontal: 2,
                  }}
                >
                  <Ionicons
                    name={iconName}
                    size={22}
                    color={isFocused ? '#3B82F6' : '#6B7280'}
                  />
                  <Text style={{
                    fontSize: 10,
                    fontWeight: isFocused ? '600' : '500',
                    color: isFocused ? '#3B82F6' : '#6B7280',
                    marginTop: 2,
                  }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Habits" component={HabitsStackNavigator} />
        <Tab.Screen name="Workouts" component={WorkoutsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}