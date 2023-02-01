import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { Animated, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "native-base";
import SwitchSelector from "react-native-switch-selector";
import { useEffect, useRef, useState } from "react";

const Tab = createMaterialTopTabNavigator();

export default function LoginSignupTabs() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props}/>}>
      <Tab.Screen name="Login" component={LoginScreen}/>
      <Tab.Screen name="Signup" component={SignupScreen}/>
    </Tab.Navigator>
  )
}

function MyTabBar({ state, descriptors, navigation, position }) {

  const insets = useSafeAreaInsets();

  const inputRange = state.routes.map((_, i) => i);
  const opacity = position.interpolate({
    inputRange,
    outputRange: inputRange.map(i => (i === 0 ? 1 : 0)),
  });

  const [index, setIndex] = useState(0);

  const didMount = useRef(true);

  useEffect(() => {
    setTimeout(() => didMount.current = false, 50);
  },[])

  useEffect(() => {

    if (didMount.current) {
      return;
    }

    setIndex(1 - Math.round(opacity._parent._b._value)); //Fucking hel
  } ,[opacity]);

  return (
    <Box bg="white" style={{
      paddingTop: insets.top + 10,
      paddingHorizontal: 20
    }}>
      <SwitchSelector
        options={[
          {
            label: "LOG IN",
            value: "log in"
          },
          {
            label: "SIGN UP",
            value: "sign up"
          }
        ]}
        initial={0}
        value={index}
        buttonColor="white"
        backgroundColor="#F2F1F8"
        selectedColor="#6C4AFA"
        hasPadding
        valuePadding={5}
        borderColor="#F2F1F8"
        textColor="#242D4C"
        height={55}
        fontSize={16}
        textStyle={{
          fontWeight: '500'
        }}
        selectedTextStyle={{
          fontWeight: '500'
        }}
        onPress={value => {
          
          const event = navigation.emit({
            type: 'tabPress',
            canPreventDefault: true,
          });

          if (value === 'log in') {
            navigation.navigate({ name: "Login", merge: true});
          } else if (value === 'sign up') {
            navigation.navigate({ name: "Signup", merge: true})
          }
        }}
      />
    </Box>
  );
}