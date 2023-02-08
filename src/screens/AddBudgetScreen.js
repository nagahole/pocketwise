import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Button, Center, HStack, Input, ScrollView, Select, Text, VStack } from "native-base";
import { useState } from "react";
import { Alert, LayoutAnimation, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import BudgetForModal from "../components/BudgetForModal";
import { transparentize } from "color2k";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddBudgetScreen({navigation}) {

  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [amount, setAmount] = useState("");

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function handleAddBudget() {
    if (selectedCategory === -1) {
      Alert.alert("Please select a category");
      return;
    }

    if (amount === "") {
      Alert.alert("Please set an amount");
      return;
    }

    navigation.goBack();

    LayoutAnimation.configureNext({
      duration: 350,
      create: {
        property: "scaleXY",
        type: "easeInEaseOut"
      },
      update: {
        type: "easeInEaseOut"
      }
    });

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays")
      .set({
        [selectedCategory.id]: parseFloat(amount)
      }, { merge: true })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message))
  }

  return (
    <Box
      safeArea
      w="100%"
      h="100%"
      bg="white"
    >
      <BudgetForModal
        visible={budgetModalVisible}
        closeModal={() => setBudgetModalVisible(false)}
        selectCategory={setSelectedCategory}
      />
      <ScrollView px="4">
        <BackButton/>
        <Text fontWeight="700" fontSize="30" mt="3">Add new budget</Text>
        <VStack mt="4" space={2.5}>
          <Box>
            <Text fontWeight="600" fontSize="16" my="2">Budget for</Text>
            <TouchableOpacity onPress={() => setBudgetModalVisible(true)}>
              <HStack
                rounded={20}
                style={{
                  height: 70
                }}
                borderWidth="1"
                borderColor="dark.600"
                alignItems="center"
                px="3"
                space={3}
              >
                {
                  selectedCategory !== -1 && (
                    <>
                      <Center 
                        bg={transparentize(selectedCategory.color, 0.85)}
                        style={{
                          height: 50,
                          width: 50
                        }}
                        rounded={50 * 0.25}
                      >
                        <FontAwesomeIcon icon={selectedCategory.icon} color={selectedCategory.color} size={22}/>
                      </Center>
                      <Text fontWeight="500" fontSize="16">{selectedCategory.name.capitalize()}</Text>
                    </>
                  )
                }
                <FontAwesomeIcon icon="fa-solid fa-chevron-down" style={{
                  position: "absolute",
                  right: 20
                }}/>
              </HStack>
            </TouchableOpacity>
          </Box>
          <Box>
            <Text fontWeight="600" fontSize="16" my="2">Amount</Text>
            <Input
              value={amount}
              onChangeText={text => setAmount(text.replace(',','.').replace(/[^0-9\.]/g, ''))}
              keyboardType="decimal-pad"
              placeholder="$0"
              rounded={20}
              style={{
                height: 60
              }}
              _focus={{
                backgroundColor: "white",
                borderColor: "dark.500"
              }}
              fontSize={16}
              px="6"
              onEndEditing={() => {
                setAmount(prev => {
                  let float = parseFloat(prev);
                  return isNaN(float)? "" : float.toString();
                });
              }}
            />
          </Box>
        </VStack>
      </ScrollView>
      <VStack py="2.5">
        <Box style={{ height: 55 }} px="4">
          <TouchableOpacity
            disabled={!buttonEnabled}
            onPress={handleAddBudget} 
          >
            <Center 
              w="100%" 
              h="100%" 
              rounded={100} 
              bg="#6a48fa"
            >
              <Text color="white" fontWeight="500" fontSize={16}>ADD BUDGET</Text>
            </Center>
          </TouchableOpacity>
        </Box>
      </VStack>
    </Box>
  )
}