import { Box, ScrollView, Text } from "native-base";
import { Alert } from "react-native";
import { isSignedInWithPassword, reauthenticate } from "../../../utils/NagaUtils";
import BackButton from "../../components/BackButton";
import SettingsBoxContainer from "../../components/SettingsBoxContainer";
import SettingsButton from "../../components/SettingsButton";
import auth from "@react-native-firebase/auth";

export default function AccountScreen({navigation}) {

  function handleDeleteAccount() {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "This cannot be undone",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress() {
            if (isSignedInWithPassword()) {
              handleDeleteAccountPasswordPrompt();
            } else {
              handleDeleteAccountNoPasswordPrompt();
            }
          }
        }
      ],
    );
  }

  function handleDeleteAccountNoPasswordPrompt() {
    Alert.prompt(
      "Enter \"DELETE\" to confirm (case sensitive)",
      "(There are no further confirmations after this dialogue)",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress(prompt) {
            if (prompt === "DELETE") {
              deleteAccount();
            } else {
              Alert.alert("Please type in the correct prompt");
              return;
            }
          }
        }
      ]
    );
  }

  function handleDeleteAccountPasswordPrompt() {
    Alert.prompt(
      "Enter your password to confirm",
      "(There are no further confirmations after this dialogue)",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress(password) {
            reauthenticate(password)
              .then(() => {
                deleteAccount();
              })
              .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
          }
        }
      ],
      "secure-text"
    );
  }

  function deleteAccount() {
    auth()
      .currentUser
      .delete()
      .then(() => {
        navigation.replace("Login Tabs");
        Alert.alert("Account successfully deleted");
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message))
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
        <Text fontWeight="600" fontSize="32" mt="2">Account</Text>
        <SettingsBoxContainer mt="4">
          <SettingsButton text="Change password" onPress={() => navigation.navigate("Change Password")}/>
          <SettingsButton text="Change email" onPress={() => navigation.navigate("Change Email")}/>
          <SettingsButton 
            text="Delete account" 
            textStyle={{ color: "#FF0000" }} 
            iconStyle={{ color: "#FF0000" }}
            onPress={handleDeleteAccount}
          />
        </SettingsBoxContainer>
      </ScrollView>
    </Box>
  )
}