import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BudgetApp from './src/BudgetApp'

export default function App() {
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