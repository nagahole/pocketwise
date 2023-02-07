import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, HStack, ScrollView, Text } from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';
import SettingsButton from "../components/SettingsButton";
import SettingsBoxContainer from "../components/SettingsBoxContainer";

export default function SettingsScreen({navigation}) {

  const insets = useSafeAreaInsets();

  function handleLogOut() {
    Alert.alert(
      "Are you sure you want to log out?",
      "",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          style: "destructive",
          onPress() {
            auth()
              .signOut()
              .then(() => {
                navigation.replace("Login Tabs");
              })
              .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message))
          }
        }
      ]
    );
  }

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      style={{
        paddingTop: insets.top
      }}
    >
      <ScrollView style={{ paddingHorizontal: 27, paddingTop: 27 }}>
        <Text fontWeight="600" fontSize="32">Settings</Text>
        <SettingsBoxContainer mt="8">
          <SettingsButton text="Account" onPress={() => navigation.navigate("Account Screen")}/>
          {/* <SettingsButton text="Notifications"/>
          <SettingsButton text="Terms and policies"/>
          <SettingsButton text="Contact support"/> */}
        </SettingsBoxContainer>
        
        <Center w="100%" h="12" mt="10">
          <TouchableOpacity onPress={handleLogOut}>
            <Text fontWeight="600" fontSize="18" textAlign="center">LOG OUT</Text>
          </TouchableOpacity>
        </Center>
        
      </ScrollView>
    </Box>
  )
}