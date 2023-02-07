import { Box, Center, Input, Pressable, ScrollView, Text, VStack } from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { isSignedInWithPassword, reauthenticate } from "../../../utils/NagaUtils";
import BackButton from "../../components/BackButton";
import auth from "@react-native-firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";

export default function ChangePasswordScreen({navigation}) {

  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function updatePassword() {
    auth()
      .currentUser
      .updatePassword(newPassword)
      .then(() => {
        navigation.goBack();
        Alert.alert("Password successfully changed");
        setButtonEnabled(true);
      })
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message)
      });
  }

  function handleChangePassword() {

    if (newPassword !== confirmNewPassword) {
      Alert.alert("", "Passwords are not matching");
      return;
    }

    setButtonEnabled(false);

    if (!isSignedInWithPassword()) {
      updatePassword();
      return;
    }

    reauthenticate(curPassword)
      .then(() => {
        updatePassword();
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
        <Text fontWeight="600" fontSize="32" mt="2">Change Password</Text>
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
            value={newPassword}
            onChangeText={setNewPassword}
            rounded={20}
            variant="filled"
            type={showNew? "text" : "password"}
            style={{
              height: 55
            }}
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
            placeholder="New password"
            InputRightElement={(
              <Pressable onPress={() => setShowNew(prev => !prev)} mr="5">
                <FontAwesomeIcon 
                  icon={showNew? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} 
                  size={showNew? 26 : 24}
                  style={{
                    marginRight: showNew? 0 : 1
                  }}
                />
              </Pressable>
            )}
          />
          <Input
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            rounded={20}
            variant="filled"
            type={showConfirmNew? "text" : "password"}
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
            placeholder="Confirm new password"
            InputRightElement={(
              <Pressable onPress={() => setShowConfirmNew(prev => !prev)} mr="5">
                <FontAwesomeIcon 
                  icon={showConfirmNew? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} 
                  size={showConfirmNew? 26 : 24}
                  style={{
                    marginRight: showConfirmNew? 0 : 1
                  }}
                />
              </Pressable>
            )}
          />
        </VStack>
      </ScrollView>
      <Box style={{ height: 55, opacity: buttonEnabled? 1 : 0.35 }} px="4">
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={!buttonEnabled}
        >
          <Center w="100%" h="100%" rounded={100} bg="#6a48fa">
            <Text color="white" fontWeight="600" fontSize={16}>CHANGE PASSWORD</Text>
          </Center>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}