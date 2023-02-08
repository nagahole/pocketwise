import { Box, Button, Center, Input, Link, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert, Dimensions, TouchableOpacity } from "react-native";

export default function SignupScreen({navigation}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(true);

  const insets = useSafeAreaInsets();

  function handleSignup() {
    if (password !== confirmPassword) {
      Alert.alert("", "Passwords are not matching");
      return;
    }

    setButtonEnabled(false);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        setButtonEnabled(true);
        auth().currentUser
          .sendEmailVerification()
          .then(() => {
            Alert.alert("Email verification sent");
          })
          .catch(error => { Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message)});
      })
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message)
      });
  }

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
          paddingBottom: Dimensions.get('window').height * 0.12
        }}>
          <Text fontWeight="600" fontSize={30} mb="8">SIGN UP</Text>
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
            mb="2"
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
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            rounded={20}
            variant="filled"
            type={showConfirm? "text" : "password"}
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
            placeholder="Confirm password"
            InputRightElement={(
              <Pressable onPress={() => setShowConfirm(prev => !prev)} mr="5">
                <FontAwesomeIcon 
                  icon={showConfirm? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} 
                  size={showConfirm? 26 : 24}
                  style={{
                    marginRight: showConfirm? 0 : 1
                  }}
                />
              </Pressable>
            )}
          />
        </VStack>
        <Box py="2.5">
          <Box style={{ height: 55, opacity: buttonEnabled? 1 : 0.35 }}>
            <TouchableOpacity
              onPress={handleSignup}
              disabled={!buttonEnabled}
            >
              <Center w="100%" h="100%" rounded={100} bg="#6a48fa">
                <Text color="white" fontWeight="600" fontSize={16}>SIGN UP</Text>
              </Center>
            </TouchableOpacity>
          </Box>
        </Box>
      </VStack>
    </ScrollView>
    </Box>
  )
}