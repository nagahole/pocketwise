import "./utils/NagaUtils";
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BudgetApp from './src/BudgetApp'
import { StatusBar } from 'react-native';

export default function App() {

  StatusBar.setBarStyle("dark-content", true);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <NativeBaseProvider>
            <BudgetApp/>
        </NativeBaseProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}