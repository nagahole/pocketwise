import { Box, Button, Center, HStack, Input, ScrollView, Text, VStack } from "native-base";
import BackButton from "../components/BackButton";
import { SWITCH_OPTIONS } from "./AddTransactionScreen";
import SwitchSelector from "react-native-switch-selector";
import { Alert, TouchableOpacity } from "react-native";
import IconGrid from "../components/IconGrid";
import COLORS from "../data/Colors";
import ICONS from "../data/Icons";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { transparentize } from "color2k";

export default function CreateCategoryScreen({navigation}) {

  const [type, setType] = useState("expenses");
  const [name, setName] = useState("");
  const [outlay, setOutlay] = useState("");
  const [selectedIcon, setSelectedIcon] = useState();
  const [selectedColor, setSelectedColor] = useState("gray");

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function handleAddCategory() {
    if (name === "") {
      Alert.alert("Please set a name");
      return;
    }

    if (outlay === "") {
      Alert.alert("Please set an outlay");
      return;
    }

    if (selectedIcon == undefined) {
      Alert.alert("Please select an icon");
      return;
    }

    if (selectedColor === "gray") {
      Alert.alert("Please select a color");
      return;
    }

    setButtonEnabled(false);

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("categories")
      .add({
        type,
        name,
        outlay: parseFloat(outlay),
        icon: selectedIcon,
        color: selectedColor
      })
      .then(docRef => {

        setButtonEnabled(true);
        navigation.goBack();

        firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .collection("categories")
          .doc(docRef.id)
          .update({
            id: docRef.id
          })
          .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message))
      })
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      });
  }
 
  return (
    <Box
      safeArea
      w="100%"
      h="100%"
      bg="white"
      px="4"
    >
      <Box flex={1}>
        <Box>
          <BackButton navigation={navigation}/>
          <Text fontWeight="600" fontSize={28} mb="3">Create category</Text>
          <SwitchSelector
            options={SWITCH_OPTIONS}
            initial={0}
            onPress={setType}
            buttonColor="white"
            backgroundColor="#F2F1F8"
            selectedColor="#6C4AFA"
            hasPadding
            valuePadding={2}
            borderColor="#F2F1F8"
            textColor="#242D4C"
            height={45}
            fontSize={16}
            textStyle={{
              fontWeight: '500'
            }}
            selectedTextStyle={{
              fontWeight: '500'
            }}
          />
          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
            keyboardType="decimal-pad"
            mt="5"
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
          />
          <Input
            placeholder="Planned outlay"
            value={outlay}
            onChangeText={text => setOutlay(text.replace(/[^0-9\.]/g, ''))}
            keyboardType="decimal-pad"
            mt="3"
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
            onEndEditing={() => {
              setOutlay(prev => {
                let float = parseFloat(prev);
                return isNaN(float)? "0" : float.toString();
              });
            }}
            InputRightElement={(
              <Text fontWeight="600" color="#CECDCE" mr="4">USD per month</Text>
            )}
          />
          <Text fontWeight="600" fontSize={20} mt="7">Choose icon</Text>
        </Box>
        <Box flex={1} py="3">
          <ScrollView flex={1} borderWidth={2.5} borderColor="#EDEBEC" rounded={35} showsVerticalScrollIndicator={false} contentContainerStyle={{
            padding: 20
          }}>
            <IconGrid 
              icons={ICONS} 
              itemsPerRow={5} 
              size={50} 
              iconSize={18} 
              color={selectedColor}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
            />
          </ScrollView>
        </Box>
      </Box>
      <Box pb="2.5" style={{
        height: 175
      }}>
        <VStack space={4} h="100%">
          <VStack space={6} flex={1}>
            <Text fontWeight="600" fontSize="18">Choose color</Text>
            <HStack justifyContent="space-around" px="1">
              {
                Object.values(COLORS).map(hex => (
                  <TouchableOpacity 
                    onPress={() => setSelectedColor(hex)}
                  >
                    <Box bg={hex} h="6" w="6" rounded={6} borderWidth={selectedColor === hex? 1 : 0}/>
                  </TouchableOpacity>
                ))
              }
            </HStack>
          </VStack>
          <Box style={{ height: 55 }}>
            <Button disabled={!buttonEnabled} w="100%" h="100%" rounded={100} bg={buttonEnabled? "#333333" : transparentize("#333333", 0.5)} _pressed={{ backgroundColor: 'black' }} onPress={handleAddCategory}>
              <Text color="white" fontWeight="500" fontSize={16}>ADD CATEGORY</Text>
            </Button>
          </Box>
          
        </VStack>
      </Box>
    </Box>
  )
}