import React from 'react'
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from '../components/MyTabBar';
import HomeDrawer from './HomeDrawer';
import StatsScreen from '../screens/StatsScreen'
import BudgetScreen from '../screens/BudgetScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainAppTabScreen() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <MyTabBar {...props}/>}>
      <Tab.Screen name="Home Drawer" component={HomeDrawer}/>
      <Tab.Screen name="Stats" component={StatsScreen}/>
      <Tab.Screen name="Add Transaction Button" component={HomeScreen}/>
      <Tab.Screen name="Budget" component={BudgetScreen}/>
      <Tab.Screen name="Settings" component={SettingsScreen}/>
    </Tab.Navigator>
  )
}