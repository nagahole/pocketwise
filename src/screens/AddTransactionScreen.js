import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Button, Center, HStack, Input, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import SwitchSelector from "react-native-switch-selector";
import BackButton from "../components/BackButton";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert, Dimensions } from "react-native";
import { useContext, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SimpleGrid } from "react-native-super-grid";
import ExpenseCategoryGridItem from "../components/ExpenseCategoryGridItem";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import { DataContext } from "../stacks/MainAppStack";
import { transparentize } from "color2k";
import { faker } from '@faker-js/faker';

export const SWITCH_OPTIONS = [
  { label: "Expenses", value: "expenses" },
  { label: "Incomes", value: "incomes" },
  { label: "Savings", value: "savings" }
];

export default function AddTransactionScreen({navigation}) {

  const userGeneratedCategories = useContext(DataContext).docs.find(x => x.id === "categories")?.data() ?? {};

  //#region setting up categories
  const EXPENSE_CATEGORIES = 
    Object
      .values(DEFAULT_CATEGORIES)
      .filter(c => c.type === "expenses")
      .map(c => ({
        iconName: c.icon,
        label: c.name.capitalize(),
        value: c.id,
        color: c.color
      }));

  const INCOME_CATEGORIES = 
    Object
      .values(DEFAULT_CATEGORIES)
      .filter(c => c.type === "incomes")
      .map(c => ({
        iconName: c.icon,
        label: c.name.capitalize(),
        value: c.id,
        color: c.color
      }));

  const SAVING_CATEGORIES = 
    Object
      .values(DEFAULT_CATEGORIES)
      .filter(c => c.type === "savings")
      .map(c => ({
        iconName: c.icon,
        label: c.name.capitalize(),
        value: c.id,
        color: c.color
      }));

  Object.values(userGeneratedCategories).forEach(c => {

    if (c.type === "expenses") {
      EXPENSE_CATEGORIES.unshift({
        iconName: c.icon,
        label: c.name,
        value: c.id,
        color: c.color,
      });
    } else if (c.type === "incomes") {
      INCOME_CATEGORIES.unshift({
        iconName: c.icon,
        label: c.name,
        value: c.id,
        color: c.color,
      });
    } else if (c.type === "savings") {
      SAVING_CATEGORIES.unshift({
        iconName: c.icon,
        label: c.name,
        value: c.id,
        color: c.color
      });
    }

  });

  EXPENSE_CATEGORIES.unshift({
    iconName: "fa fa-plus",
    label: "Add New",
    value: "add_new",
    addNew: true,
    onPress() {
      navigation.navigate("Create Category")
    }
  });

  INCOME_CATEGORIES.unshift({
    iconName: "fa fa-plus",
    label: "Add New",
    value: "add_new",
    addNew: true,
    onPress() {
      navigation.navigate("Create Category")
    }
  });

  SAVING_CATEGORIES.unshift({
    iconName: "fa fa-plus",
    label: "Add New",
    value: "add_new",
    addNew: true,
    onPress() {
      navigation.navigate("Create Category")
    }
  });

  //#endregion

  const [type, setType] = useState("expenses");

  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");

  const [categoryID, setCategoryID] = useState();

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState("today");

  const [buttonEnabled, setButtonEnabled] = useState(true);

  function handleAddTransaction() {

    if (reference === "") {
      Alert.alert("Please enter a reference");
      return;
    }

    if (amount === "") {
      Alert.alert("Please enter an amount");
      return;
    }

    if (categoryID == undefined) {
      Alert.alert("Please select a category");
      return;
    }

    setButtonEnabled(false);

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .add({
        type,
        reference,
        amount: parseFloat(amount),
        categoryID,
        date:
          date === "today"
          ? Date.now()
          : date === "yesterday"
          ? Date.now() - 60 * 60 * 24 * 1000
          : new Date(date).getTime()
      })
      .then(docRef => {

        setButtonEnabled(true);
        navigation.goBack();

        firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .collection("transactions")
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

  function showDatePicker() {
    setDatePickerVisible(true);
  }

  function hideDatePicker() {
    setDatePickerVisible(false);
  }

  function handleConfirmDatePicker(date) {
    setDate(date.toString());
    console.log(date);
    hideDatePicker();
  }

  function handleTodayButtonPress() {
    setDate("today");
  }

  function handleYesterdayButtonPress() {
    setDate("yesterday");
  }

  function handleDateButtonPress() {
    showDatePicker();
  }

  return (
    <Box
      safeArea
      w="100%"
      h="100%"
      bg="white"
      px="4"
    >
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirmDatePicker}
        onCancel={hideDatePicker}
      />
      <BackButton navigation={navigation}/>
      <Box flex={1}>
        <Box>
          <VStack space={3}>
            <Text fontWeight="600" fontSize={28}>Add transaction</Text>
            {/* <SwitchSelector
              options={SWITCH_OPTIONS}
              initial={0}
              onPress={value => setType(value)}
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
            /> */}
            <Input
              placeholder="Reference"
              value={reference}
              onChangeText={setReference}
              mt="3"
              rounded={20}
              variant="filled"
              style={{
                height: 55
              }}
              fontSize="16"
              fontWeight="500"
              py="3"
              px="7"
              _focus={{
                backgroundColor: "#f5f5f6",
                borderColor: "rgba(0,0,0,0.05)",
                borderWidth: 1
              }}
            />
            <Input
              value={amount}
              onChangeText={text => setAmount(text.replace(/[^0-9\.]/g, ''))}
              keyboardType="decimal-pad"
              rounded={20}
              variant="filled"
              style={{
                height: 55
              }}
              fontSize="16"
              fontWeight="500"
              py="3"
              px="7"
              _focus={{
                backgroundColor: "#f5f5f6",
                borderColor: "rgba(0,0,0,0.05)",
                borderWidth: 1
              }}
              onEndEditing={() => {
                setAmount(prev => {
                  let float = parseFloat(prev);
                  return isNaN(float)? "0" : float.toString();
                });
              }}
              InputRightElement={(
                <HStack alignItems="center" mr="4" space={3}>
                  <Text fontWeight="600" color="#CECDCE">USD</Text>
                  <TouchableOpacity>
                    <Center w="9" h="9" rounded={13} borderColor="#F1F1F1" bg="white">
                      <FontAwesomeIcon icon="fa-solid fa-calculator" size={20}/>
                    </Center>
                  </TouchableOpacity>
                </HStack>
              )}
            />
          </VStack>
          <Text fontWeight="600" fontSize={20} mt="7">{type.capitalize()} categories</Text>
        </Box>
        <Box flex={1} py="5">
          <ScrollView flex={1} borderWidth={2.5} borderColor="#EDEBEC" rounded={35} showsVerticalScrollIndicator={false} contentContainerStyle={{
            paddingVertical: 18
          }}>
            <SimpleGrid 
              // setCategory={setCategory} 
              // selectedCategory={category}
              itemDimension={((Dimensions.get('window').width - 16 * 2) / 4) - 10}
              spacing={0}
              data={
                type === "expenses"
                ? EXPENSE_CATEGORIES
                : type === "incomes" 
                ? INCOME_CATEGORIES
                : type === "savings"
                ? SAVING_CATEGORIES
                : []
              }
              renderItem={({item}) => 
                <ExpenseCategoryGridItem 
                  {...item} 
                  onPress={item.onPress?? (() => setCategoryID(item.value))} 
                  iconSize={20} 
                  marginBottom={15}
                  selected={categoryID === item.value}
                  color={item.addNew? "" : item.color}
                />
              }
            />
          </ScrollView>
        </Box>
      </Box>
      
      <Box py="2.5" style={{
        height: 130
      }}>
        <VStack space={4} h="100%">
          <HStack flex={1} space={3}>
            <Button 
              flex={1} 
              rounded={100}  
              bg={date === "today"? "#d9d9d9" : "#FAF9FA"}
              _pressed={{
                backgroundColor: "#b3b3b3"
              }}
              onPress={handleTodayButtonPress}
            >
                <Text ml="1" mt="-0.5" textAlign="center">Today</Text>
            </Button>

            <Button 
              flex={1} 
              rounded={100} 
              bg={date === "yesterday"? "#d9d9d9" : "#FAF9FA"}
              _pressed={{
                backgroundColor: "#b3b3b3"
              }}
              onPress={handleYesterdayButtonPress}
            >
              <Text ml="1" mt="-0.5" textAlign="center">Yesterday</Text>
            </Button>
            <TouchableOpacity onPress={handleDateButtonPress} style={{
              aspectRatio: 1
            }}>  
              <Center
                rounded={15}
                bg="white"
                borderWidth={(date !== "today" && date !== "yesterday")? 2 : 1}
                borderColor={(date !== "today" && date !== "yesterday")? "black" : "#E9E8E9"}
                flex={1}
              >
                <FontAwesomeIcon color="#999" icon="fa-solid fa-calendar-days" />
              </Center>
            </TouchableOpacity>
          </HStack>

          <Box style={{ height: 55 }}>
            <Button disabled={!buttonEnabled} w="100%" h="100%" rounded={100} bg={buttonEnabled? "#333333" : transparentize("#333333", 0.5)} _pressed={{ backgroundColor: 'black' }} onPress={handleAddTransaction}>
              <Text color="white" fontWeight="500" fontSize={16}>ADD TRANSACTION</Text>
            </Button>
          </Box>

        </VStack>
      </Box>
    </Box>
  )
}