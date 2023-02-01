import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeftLong, faBagShopping, faBars, faBowlFood, faBurger, faCalculator, faCalendarDays, faChevronRight, faDollarSign, faDumbbell, faEllipsis, faFileInvoice, faFileInvoiceDollar, faGift, faLaptop, faPencil, faPlus, faShirt, faTaxi } from '@fortawesome/free-solid-svg-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Box, Text } from 'native-base'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoginScreen from './screens/LoginScreen';
import MainAppStack from './stacks/MainAppStack'
import LoginSignupTabs from './stacks/LoginSignupTabs';

const Stack = createNativeStackNavigator();

library.add( 
  faBagShopping, faEllipsis, faBars, faPlus, faChevronRight, faDollarSign, faCalendarDays,
  faArrowLeftLong, faCalculator, faBowlFood, faTaxi, faBurger, faShirt, faDumbbell, 
  faHeart, faFileInvoice, faFileInvoiceDollar, faGift, faLaptop, faPencil, faEye,
  faEyeSlash
);

export default function BudgetApp() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login Tabs" component={LoginSignupTabs}/>
      <Stack.Screen name="Main Stack" component={MainAppStack} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  )
}