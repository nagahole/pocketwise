import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, HStack, ScrollView, Text } from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';

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
        <Box width="100%" rounded={20} px="5" py="2" bg="white" mt="8" 
          style={{
            shadowColor: 'black',
            shadowRadius: 15,
            shadowOpacity: 0.1
          }}
        >
          <TouchableOpacity>
            <HStack h="12" my="1" justifyContent="space-between" alignItems="center">
              <Text fontSize={17} fontWeight="600">Account</Text>
              <FontAwesomeIcon icon="fa-solid fa-chevron-right"/>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <HStack h="12" my="1" justifyContent="space-between" alignItems="center">
              <Text fontSize={17} fontWeight="600">Notifications</Text>
              <FontAwesomeIcon icon="fa-solid fa-chevron-right"/>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <HStack h="12" my="1" justifyContent="space-between" alignItems="center">
              <Text fontSize={17} fontWeight="600">Terms and policies</Text>
              <FontAwesomeIcon icon="fa-solid fa-chevron-right"/>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity>
            <HStack h="12" my="1" justifyContent="space-between" alignItems="center">
              <Text fontSize={17} fontWeight="600">Contact support</Text>
              <FontAwesomeIcon icon="fa-solid fa-chevron-right"/>
            </HStack>
          </TouchableOpacity>
        </Box>
        
        <Center w="100%" h="12" mt="10">
          <TouchableOpacity onPress={handleLogOut}>
            <Text fontWeight="600" fontSize="18" textAlign="center">LOG OUT</Text>
          </TouchableOpacity>
        </Center>
        
      </ScrollView>
    </Box>
  )
}