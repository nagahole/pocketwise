import { Box, Input, ScrollView, Select, Text, VStack } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import BudgetForModal from "../components/BudgetForModal";

export const EXPENSE_CATEGORIES = [
  // {
  //   label: "Add new",
  //   iconName: "fa-solid fa-plus",
  // },
  {
    label: "Food",
    iconName: "fa-solid fa-bowl-food",
  },
  {
    label: "Transport",
    iconName: "fa-solid fa-taxi",
  },
  {
    label: "Eating out",
    iconName: "fa-solid fa-burger",
  },
  {
    label: "Clothes",
    iconName: "fa-solid fa-shirt",
  },
  {
    label: "Sport",
    iconName: "fa-solid fa-dumbbell",
  },
  {
    label: "Health",
    iconName: "fa-regular fa-heart",
  },
  {
    label: "Bills",
    iconName: "fa-solid fa-file-invoice",
  },
  {
    label: "Taxes",
    iconName: "fa-solid fa-file-invoice-dollar",
  },
  {
    label: "Tech",
    iconName: "fa-solid fa-laptop",
  },
  {
    label: "Gifts",
    iconName: "fa-solid fa-gift",
  },
]

export default function AddBudgetScreen({navigation}) {

  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

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
      />
      <ScrollView px="4">
        <BackButton navigation={navigation}/>
        <Text fontWeight="700" fontSize="30" mt="3">Add new budget</Text>
        <VStack mt="4" space={2.5}>
          <Box>
            <Text fontWeight="600" fontSize="16" my="2">Budget name</Text>
            <Input
              rounded={20}
              style={{
                height: 60
              }}
              _focus={{
                backgroundColor: "white",
                borderColor: "dark.500",
              }}
              placeholder="Budget name"
              fontSize={16}
              px="6"
            />
          </Box>
          <Box>
            <Text fontWeight="600" fontSize="16" my="2">Amount</Text>
            <Input
              rounded={20}
              style={{
                height: 60
              }}
              _focus={{
                backgroundColor: "white",
                borderColor: "dark.500"
              }}
              placeholder="$0"
              fontSize={16}
              px="6"
            />
          </Box>
          <Box>
            <Text fontWeight="600" fontSize="16" my="2">Budget for</Text>
            <TouchableOpacity onPress={() => setBudgetModalVisible(true)}>
              <Box
                rounded={20}
                style={{
                  height: 60
                }}
                borderWidth="1"
                borderColor="dark.600"
              >

              </Box>
            </TouchableOpacity>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  )
}