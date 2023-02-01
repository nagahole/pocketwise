import { Box, Button, Input, Link, Pressable, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import auth from '@react-native-firebase/auth';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen({navigation}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const insets = useSafeAreaInsets();

  function handleSignup() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        auth().currentUser
          .sendEmailVerification()
          .then(() => {
            Alert.alert("Email verification sent");
          })
          .catch(error => { Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message)});
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
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
      <VStack justifyContent="space-between" w="100%" h="100%" px="4">
        <VStack alignItems="center" justifyContent="center" flex={1} space={5} pb="24">
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
              borderColor: "rgba(0,0,0,0.05)",
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
              borderColor: "rgba(0,0,0,0.05)",
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
              borderColor: "rgba(0,0,0,0.05)",
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
        <Box style={{ height: 55 }}>
          <Button w="100%" h="100%" rounded={100} bg="#333333" _pressed={{ backgroundColor: 'black' }} onPress={handleSignup}>
            <Text color="white" fontWeight="500" fontSize={16}>SIGN UP</Text>
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}