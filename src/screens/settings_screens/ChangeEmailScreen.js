import { Box, Center, Input, Pressable, ScrollView, Text, VStack } from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { isSignedInWithPassword, reauthenticate } from "../../../utils/NagaUtils";
import BackButton from "../../components/BackButton";
import auth from "@react-native-firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";

export default function ChangeEmailScreen({navigation}) {

  const [curPassword, setCurPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [showCur, setShowCur] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function updateEmail() {
    auth()
      .currentUser
      .updateEmail(newEmail)
      .then(() => {
        navigation.goBack();
        Alert.alert(`Email successfully changed to ${newEmail}`);
        setButtonEnabled(true);
      })
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message)
      });
  }

  function handleChangeEmail() {

    setButtonEnabled(false);

    if (!isSignedInWithPassword()) {
      updateEmail();
      return;
    }

    reauthenticate(curPassword)
      .then(() => {
        updateEmail();
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
      safeArea
    >
      <ScrollView style={{ paddingHorizontal: 27 }}>
        <BackButton/> 
        <Text fontWeight="600" fontSize="32" mt="2">Change Email</Text>
        <VStack space="3.5" mt="8">
          {
            isSignedInWithPassword() && (
              <Input
                value={curPassword}
                onChangeText={setCurPassword}
                rounded={20}
                variant="filled"
                type={showCur? "text" : "password"}
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
                placeholder="Current password"
                InputRightElement={(
                  <Pressable onPress={() => setShowCur(prev => !prev)} mr="5">
                    <FontAwesomeIcon 
                      icon={showCur? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} 
                      size={showCur? 26 : 24}
                      style={{
                        marginRight: showCur? 0 : 1
                      }}
                    />
                  </Pressable>
                )}
              />
            )
          }
          <Input
            placeholder="New email"
            value={newEmail}
            onChangeText={setNewEmail}
            rounded={20}
            variant="filled"
            style={{
              height: 55
            }}
            autoCapitalize="none"
            autoCorrect={false}
            fontSize="16"
            fontWeight="600"
            mt="3"
            py="3"
            px="7"
            _focus={{
              backgroundColor: "#f5f5f6",
              borderColor: "rgba(0,0,0,0.01)",
              borderWidth: 1
            }}
          />
        </VStack>
      </ScrollView>
      <Box style={{ height: 55, opacity: buttonEnabled? 1 : 0.35 }} px="4">
        <TouchableOpacity
          onPress={handleChangeEmail}
          disabled={!buttonEnabled}
        >
          <Center w="100%" h="100%" rounded={100} bg="#6a48fa">
            <Text color="white" fontWeight="600" fontSize={16}>CHANGE EMAIL</Text>
          </Center>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}