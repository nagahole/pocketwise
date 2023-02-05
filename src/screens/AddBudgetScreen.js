import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Button, Center, HStack, Input, ScrollView, Select, Text, VStack } from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import BudgetForModal from "../components/BudgetForModal";
import { transparentize } from "color2k";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function AddBudgetScreen({navigation}) {

  const documentReference = 
    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays");

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

    setButtonEnabled(false);

    onOutlayIncrease(selectedCategory.id, parseFloat(amount))
      .then(() => {
        setButtonEnabled(true);
        navigation.goBack();
      })
      .catch(error => { 

        if (error == 'No document exist!') {
          console.log("No document exists. Creating document instead");

          documentReference
            .set({
              [selectedCategory.id]: parseFloat(amount)
            })
            .then(() => { 
              console.log("Successfuly wrote data");
              setButtonEnabled(true);
              navigation.goBack();
            })
            .catch(e => Alert.alert(e.nativeErrorCode, e.nativeErrorMessage?? e.message));

          return;
        }

        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message)
      });
  }

  function onOutlayIncrease(id, increase) {

    return firestore().runTransaction(async transaction => {
      // Get post data first
      const documentSnapshot = await transaction.get(documentReference);
  
      if (!documentSnapshot.exists) {
        throw 'No document exist!';
      }

      let prev = documentSnapshot.data()[id] ?? 0;
  
      transaction.update(documentReference, {
        [id] : prev + increase
      });
    });
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
              onChangeText={text => setAmount(text.replace(/[^0-9\.]/g, ''))}
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
                  return isNaN(float)? "0" : float.toString();
                });
              }}
            />
          </Box>
        </VStack>
      </ScrollView>
      <Box style={{ height: 55 }} px="4">
        <Button 
          disabled={!buttonEnabled} 
          w="100%" h="100%" 
          rounded={100} 
          bg={buttonEnabled? "#333333" : transparentize("#333333", 0.5)}
          _pressed={{ backgroundColor: 'black' }} 
          onPress={handleAddBudget}
        >
          <Text color="white" fontWeight="500" fontSize={16}>ADD BUDGET</Text>
        </Button>
      </Box>
    </Box>
  )
}