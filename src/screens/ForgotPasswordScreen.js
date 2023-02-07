import { Box, Center, Input, ScrollView, Text } from "native-base";
import { useState } from "react";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import auth from "@react-native-firebase/auth";

export default function ForgotPasswordScreen() {

  const [email, setEmail] = useState("");

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function handleForgotPassword() {
    setButtonEnabled(false);

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Password reset email sent");
        setButtonEnabled(true);
        setEmail("");
      })
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      })
  }

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      safeArea
      px="4"
    >
    <ScrollView bounces={false} contentContainerStyle={{ flex: 1}}>
      <BackButton/>
      <Box flex={1} justifyContent="center" alignItems="center" style={{
        paddingBottom: Dimensions.get('window').height * 0.15
      }}>
        <Text fontWeight="600" fontSize={30} mb="24">RESET PASSWORD</Text>
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
      </Box>
      <Box mt="12" style={{ height: 55, opacity: buttonEnabled? 1 : 0.35 }}>
        <TouchableOpacity
          onPress={handleForgotPassword}
          disabled={!buttonEnabled}
        >
          <Center w="100%" h="100%" rounded={100} bg="#6a48fa">
            <Text color="white" fontWeight="600" fontSize={16}>RESET PASSWORD</Text>
          </Center>
        </TouchableOpacity>
      </Box>
    </ScrollView>
    </Box>
  )
}