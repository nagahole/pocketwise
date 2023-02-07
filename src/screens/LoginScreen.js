import { Box, Button, Center, Input, Link, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert, Dimensions } from "react-native";

export default function LoginScreen({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [buttonEnabled, setButtonEnabled] = useState(true);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (initializing) setInitializing(false);

      if (user) {
        navigation.replace("Main Stack")
      }
    });

    return subscriber; // unsubscribe on unmount

  }, []);

  function handleLogin() {
    setButtonEnabled(false);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log("Logged in with", user.email); 
        setButtonEnabled(true);       
      })
      .catch(error => { 
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      });
  }

  if (initializing) return <Box w="100%" h="100%" bg="white"/>;

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      style={{
        paddingBottom: insets.bottom
      }}
    >
    <ScrollView bounces={false} contentContainerStyle={{ flex: 1}}>
      <VStack justifyContent="space-between" w="100%" h="100%" px="4">
        <VStack alignItems="center" justifyContent="center" flex={1} space={5} style={{
          paddingBottom: Dimensions.get('window').height * 0.1
        }}>
          <Text fontWeight="600" fontSize={30} mb="8">LOG IN</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            rounded={20}
            variant="filled"
            style={{
              height: 55
            }}
            fontSize="16"
            fontWeight="600"
            py="3"
            px="7"
            _focus={{
              backgroundColor: "#f5f5f6",
              borderColor: "rgba(0,0,0,0.01)",
              borderWidth: 1
            }}
            placeholder="Email"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            rounded={20}
            variant="filled"
            type={show? "text" : "password"}
            style={{
              height: 55
            }}
            fontSize="16"
            fontWeight="600"
            py="3"
            px="7"
            _focus={{
              backgroundColor: "#f5f5f6",
              borderColor: "rgba(0,0,0,0.01)",
              borderWidth: 1
            }}
            placeholder="Password"
            InputRightElement={(
              <Pressable onPress={() => setShow(prev => !prev)} mr="5">
                <FontAwesomeIcon 
                  icon={show? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} 
                  size={show? 26 : 24}
                  style={{
                    marginRight: show? 0 : 1
                  }}
                />
              </Pressable>
            )}
          />
          <Link mt="4" onPress={() => navigation.navigate("Forgot Password")}>Forgot password?</Link>
        </VStack>
        <Box style={{ height: 55, opacity: buttonEnabled? 1 : 0.35 }}>
          <TouchableOpacity
            onPress={handleLogin}
            disabled={!buttonEnabled}
          >
            <Center w="100%" h="100%" rounded={100} bg="#6a48fa">
              <Text color="white" fontWeight="600" fontSize={16}>LOG IN</Text>
            </Center>
          </TouchableOpacity>
        </Box>
      </VStack>
    </ScrollView>
    </Box>
  )
}