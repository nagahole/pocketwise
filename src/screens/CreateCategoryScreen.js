import { Box, Button, Center, HStack, Input, ScrollView, Text, VStack } from "native-base";
import BackButton from "../components/BackButton";
import { Alert, TouchableOpacity } from "react-native";
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

export default function CreateCategoryScreen({navigation, route}) {

  const isEditMode = route.params?.mode === "edit"
  const outlays = useContext(DataContext).docs?.find(x => x.id === "outlays")?.data() ?? {};

  const category = useCategory(isEditMode? route.params.id : "");

  const [type, setType] = useState("expenses");
  const [name, setName] = useState(isEditMode? category.name : "");
  const [outlay, setOutlay] = useState(isEditMode? (outlays[category.id]?.toString()?? "" ): "");
  const [selectedIcon, setSelectedIcon] = useState(isEditMode? category.icon : null);
  const [selectedColor, setSelectedColor] = useState(isEditMode? category.color : "gray");

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

    if (selectedColor === "gray") {
      Alert.alert("Please select a color");
      return;
    }

    setButtonEnabled(false);

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
      .then(() => {

        setButtonEnabled(true);
        navigation.goBack();

      })
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
      "Deleting this category will remove any and all transactions of category. Continue?",
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
    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .doc("categories")
      .set({
        [id]: firestore.FieldValue.delete()
      }, {merge: true})
      .then(() => {

        setButtonEnabled(true);
        navigation.goBack();

      })
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

    setButtonEnabled(false);

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
      .then(() => {

        setButtonEnabled(true);
        navigation.goBack();

      })
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
        <Box>
          <BackButton/>
          <Text fontWeight="600" fontSize={28} mb="3">{isEditMode? "Edit category" : "Create category"}</Text>
          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
            keyboardType="decimal-pad"
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
        height: isEditMode? 175 + 60 : 175
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
                  >
                    <Text fontWeight="500" fontSize={16}>REMOVE CATEGORY</Text>
                  </Center>
                </TouchableOpacity>
              </Box>
            )
          }

          <Box style={{ height: 55 }}>
            <Button 
              disabled={!buttonEnabled} 
              w="100%" 
              h="100%" 
              rounded={100} 
              bg={buttonEnabled? "#333333" : transparentize("#333333", 0.5)} 
              _pressed={{ backgroundColor: 'black' }} 
              onPress={isEditMode? handleEditCategory : handleAddCategory}
            >
              <Text color="white" fontWeight="500" fontSize={16}>{isEditMode? "SAVE CHANGES" : "ADD CATEGORY"}</Text>
            </Button>
          </Box>
          
        </VStack>
      </Box>
    </Box>
  )
}