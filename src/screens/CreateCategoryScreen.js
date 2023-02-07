import { Box, Button, Center, HStack, Input, ScrollView, Text, VStack } from "native-base";
import BackButton from "../components/BackButton";
import { Alert, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import IconGrid from "../components/IconGrid";
import COLORS from "../data/Colors";
import ICONS from "../data/Icons";
import { useContext, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { transparentize } from "color2k";
import { v4 as uuidv4 } from 'uuid';
import useCategory from "../hooks/useCategory";
import { DataContext } from "../stacks/MainAppStack";
import { DismissKeyboardView } from "../components/DismissKeyboardView";

export default function CreateCategoryScreen({navigation, route}) {

  const isEditMode = route.params?.mode === "edit"
  const outlays = useContext(DataContext).docs?.find(x => x.id === "outlays")?.data() ?? {};

  const category = useCategory(isEditMode? route.params.id : "");

  const [type, setType] = useState("expenses");
  const [name, setName] = useState(isEditMode? category.name : "");
  const [outlay, setOutlay] = useState(isEditMode? (outlays[category.id]?.toString()?? "" ): "");
  const [selectedIcon, setSelectedIcon] = useState(isEditMode? category.icon : null);
  const [selectedColor, setSelectedColor] = useState(isEditMode? category.color : "#808080");

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function handleAddCategory() {
    if (name === "") {
      Alert.alert("Please set a name");
      return;
    }

    if (selectedIcon == undefined) {
      Alert.alert("Please select an icon");
      return;
    }

    if (selectedColor === "#808080") {
      Alert.alert("Please select a color");
      return;
    }

    navigation.goBack();

    let id = uuidv4();

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("categories")
      .set({
        [id]: {
          type,
          name,
          icon: selectedIcon,
          color: selectedColor,
          id
        }
      }, {merge: true})
      .then()
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      });

    if (outlay === "")
      return;

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays")
      .set({
        [id]: parseFloat(outlay)
      }, {merge: true})
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
  }

  function handleRemoveCategory() {
    Alert.alert(
      "Warning",
      "Deleting this category will remove any and all transactions of this category. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress() {
            deleteCategory(category.id)
          }
        }
      ]
    )
  }

  function deleteCategory(id) {
    setButtonEnabled(false);

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("categoryID", "==", id)
      .get()
      .then(querySnapshot => {

        if (querySnapshot.docs.length === 0) {
          removeCategoryField(id);
          return;
        }

        querySnapshot.forEach((documentSnapshot, index) => {
          firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .collection("transactions")
            .doc(documentSnapshot.id)
            .delete()
            .then(() => {
              console.log("Deleted document", documentSnapshot.id);

              //If just finished deleting last snapshot
              //Delete the category
              if (index === querySnapshot.docs.length - 1) {
                removeCategoryField(id);
              }
            })
            .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
        });
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays")
      .set({
        [id]: firestore.FieldValue.delete()
      }, {merge: true})
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
  }

  function removeCategoryField(id) {
    navigation.goBack();
    setButtonEnabled(true);

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("categories")
      .set({
        [id]: firestore.FieldValue.delete()
      }, {merge: true})
      .then()
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      });
  }

  function handleEditCategory() {
    if (name === "") {
      Alert.alert("Please set a name");
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

    navigation.goBack();

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("categories")
      .set({
        [category.id]: {
          type,
          name,
          icon: selectedIcon,
          color: selectedColor,
          id: category.id
        }
      }, {merge: true})
      .then()
      .catch(error => {
        setButtonEnabled(true);
        Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message);
      });

    if (outlay === "")
      return;

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("outlays")
      .set({
        [category.id]: parseFloat(outlay)
      }, {merge: true})
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
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
      <ScrollView bounces={false} contentContainerStyle={{ flex: 1}}>
        <Box>
          <BackButton/>
          <Text fontWeight="600" fontSize="32" mt="1" mb="3">{isEditMode? "Edit category" : "Create category"}</Text>
          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
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
              borderColor: "rgba(0,0,0,0.01)",
              borderWidth: 1
            }}
          />
          <Input
            placeholder="Planned outlay"
            value={outlay}
            onChangeText={text => setOutlay(text.replace(',','.').replace(/[^0-9\.]/g, ''))}
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
              borderColor: "rgba(0,0,0,0.01)",
              borderWidth: 1
            }}
            onEndEditing={() => {
              setOutlay(prev => {
                let float = parseFloat(prev);
                return isNaN(float)? "" : float.toString();
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
              iconSize={22} 
              color={selectedColor}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
            />
          </ScrollView>
        </Box>
      </ScrollView>
      </Box>

      <Box pb="2.5" style={{
        height: isEditMode? 175 + 60 : 175
      }}>
        <VStack space={2.5} h="100%">
          <VStack space={6} flex={1}>
            <Text fontWeight="600" fontSize="18" mt="2">Choose color</Text>
            <HStack justifyContent="space-around" px="1">
              {
                Object.values(COLORS).map(hex => (
                  <TouchableWithoutFeedback 
                    onPress={() => setSelectedColor(hex)}
                    key={hex}
                  >
                    <Box bg={hex} h="6" w="6" rounded={6}/>
                  </TouchableWithoutFeedback>
                ))
              }
            </HStack>
          </VStack>
          {
            isEditMode && (
              <Box style={{ height: 55, opacity: buttonEnabled? 1 : 0.35}}>
                <TouchableOpacity
                  disabled={!buttonEnabled}
                  onPress={handleRemoveCategory}
                >
                  <Center 
                    w="100%" 
                    h="100%" 
                    rounded={100} 
                    bg="white"
                    borderWidth={2}
                    borderColor="#6a48fa"
                  >
                    <Text fontWeight="500" fontSize={16} color="#6a48fa">REMOVE CATEGORY</Text>
                  </Center>
                </TouchableOpacity>
              </Box>
            )
          }

          <Box style={{ height: 55, opacity: buttonEnabled? 1 : 0.35 }}>
            <TouchableOpacity
              disabled={!buttonEnabled} 
              onPress={isEditMode? handleEditCategory : handleAddCategory}
            >
              <Center 
                w="100%" 
                h="100%" 
                rounded={100} 
                bg="#6a48fa"
              >
                <Text color="white" fontWeight="600" fontSize={16}>{isEditMode? "SAVE CHANGES" : "ADD CATEGORY"}</Text>
              </Center>
            </TouchableOpacity>
          </Box>
          
        </VStack>
      </Box>
    </Box>
  )
}