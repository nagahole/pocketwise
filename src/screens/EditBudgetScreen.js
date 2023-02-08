import { Box, Center, Input, ScrollView, Text, VStack } from "native-base";
import { useState } from "react";
import BackButton from "../components/BackButton";
import useCategory from "../hooks/useCategory";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert, LayoutAnimation, TouchableOpacity } from "react-native";

export default function EditBudgetScreen({navigation, route}) {

  const [buttonEnabled, setButtonEnabled] = useState(true);

  //Maybe I can write my own hook for this?
  const category = useCategory(route.params.id);

  const [amount, setAmount] = useState(route.params.outlay.toString());

  function handleSaveChanges() {
    LayoutAnimation.configureNext({
      duration: 350,
      update: {
        type: "easeInEaseOut"
      }
    });

    navigation.goBack();

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays")
      .update({
        [category.id]: parseFloat(amount)
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
  }

  function handleRemoveBudget() {
    navigation.goBack();

    LayoutAnimation.configureNext({
      duration: 350,
      delete: {
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
      .update({
        [category.id]: firestore.FieldValue.delete()
      })
      .then()
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      });
  }

  return (
    <Box
      h="100%"
      w="100%"
      bg="white"
      safeArea
      px="4"
      justifyContent="space-between"
    >
      <ScrollView>
        <BackButton/>
        <Text fontSize="16" fontWeight="400" mt="3">Budget for</Text>
        <Text fontWeight="700" fontSize="40" mt="-2" style={{ marginLeft: -1.25}}>{category.name.capitalize()}</Text>
        <Input
          value={amount}
          onChangeText={text => setAmount(text.replace(',','.').replace(/[^0-9\.]/g, ''))}
          keyboardType="decimal-pad"
          placeholder="$0"
          rounded={20}
          mt="7"
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
              let str = isNaN(float)? "" : float.toString();
        
              return str;
            });
          }}
        />
      </ScrollView>

      <VStack space={3.5} py="2.5">
        <Box style={{ height: 55 }} opacity={buttonEnabled? 1 : 0.3}>
          <TouchableOpacity 
            disabled={!buttonEnabled}
            onPress={handleRemoveBudget}
          >
            <Center 
              w="100%" 
              h="100%" 
              rounded={100} 
              borderColor="#6a48fa"
              borderWidth={2}
              bg="transparent" 
            >
              <Text fontWeight="500" fontSize={16} color="#6a48fa">REMOVE BUDGET</Text>
            </Center>
          </TouchableOpacity>
        </Box>
        <Box style={{ height: 55 }} opacity={buttonEnabled? 1 : 0.3}>
          <TouchableOpacity 
            disabled={!buttonEnabled}
            onPress={handleSaveChanges}
          >
            <Center 
              w="100%" 
              h="100%" 
              rounded={100} 
              bg="#6a48fa"
            >
              <Text fontWeight="500" fontSize={16} color="white">SAVE CHANGES</Text>
            </Center>
          </TouchableOpacity>
        </Box>
      </VStack>
    </Box>
  )
}