import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import MainAppStack from './stacks/MainAppStack'
import LoginSignupTabs from './stacks/LoginSignupTabs';
import "./data/DefaultCategories";
import "./data/Icons";

const Stack = createNativeStackNavigator();

export default function BudgetApp() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login Tabs" component={LoginSignupTabs}/>
      <Stack.Screen name="Main Stack" component={MainAppStack} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  )
}