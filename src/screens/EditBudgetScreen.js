import { Box, Button, Center, Input, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import BackButton from "../components/BackButton";
import useCategory from "../hooks/useCategory";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { MINIMUM_OUTLAY } from "../data/Constants";

export default function EditBudgetScreen({navigation, route}) {

  const [buttonEnabled, setButtonEnabled] = useState(true);

  //Maybe I can write my own hook for this?
  const category = useCategory(route.params.id);

  const [amount, setAmount] = useState(route.params.outlay.toString());

  function onEndEditing() {
    setAmount(prev => {
      let float = Math.max(parseFloat(prev), MINIMUM_OUTLAY);
      let str = isNaN(float)? `${MINIMUM_OUTLAY}` : float.toString();

      firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("data")
        .doc("outlays")
        .update({
          [category.id]: parseFloat(str)
        })
        .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));

      return str;
    });
  }

  function handleRemoveBudget() {
    setButtonEnabled(false);

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays")
      .update({
        [category.id]: firestore.FieldValue.delete()
      })
      .then(() => {
        navigation.goBack();
        setButtonEnabled(true);
      })
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
          onChangeText={text => setAmount(text.replace(/[^0-9\.]/g, ''))}
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
          onEndEditing={onEndEditing}
        />
      </ScrollView>


      <Box style={{ height: 55 }} opacity={buttonEnabled? 1 : 0.3}>
        <TouchableOpacity 
          disabled={!buttonEnabled}
          onPress={handleRemoveBudget}
        >
          <Center 
            w="100%" 
            h="100%" 
            rounded={100} 
            borderColor={"#333333"} 
            borderWidth={1.5}
            bg="transparent" 
          >
            <Text fontWeight="500" fontSize={16}>REMOVE BUDGET</Text>
          </Center>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}