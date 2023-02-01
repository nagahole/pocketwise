import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Button, Center, HStack, Input, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import SwitchSelector from "react-native-switch-selector";
import BackButton from "../components/BackButton";
import ExpenseCategoryGrid from "../components/ExpenseCategoryGrid";
import ExpenseCategoryGridItem from "../components/ExpenseCategoryGridItem";

export const SWITCH_OPTIONS = [
  { label: "Expenses", value: "expenses" },
  { label: "Incomes", value: "incomes" },
  { label: "Savings", value: "savings" }
];

export default function AddTransactionScreen({navigation}) {

  const ITEMS = [
    { iconName: "fa-solid fa-plus", label: "Add new", addNew: true, onPress() { navigation.navigate("Create Category") } },
    { iconName: "fa-solid fa-bowl-food", label: "Food"},
    { iconName: "fa-solid fa-taxi", label: "Transport"},
    { iconName: "fa-solid fa-burger", label: "Eating out"},
    { iconName: "fa-solid fa-shirt", label: "Clothes"},
    { iconName: "fa-solid fa-dumbbell", label: "Sport"},
    { iconName: "fa-regular fa-heart", label: "Health"},
    { iconName: "fa-solid fa-file-invoice", label: "Bills"},
    { iconName: "fa-solid fa-file-invoice-dollar", label: "Taxes"},
    { iconName: "fa-solid fa-laptop", label: "Tech"},
    { iconName: "fa-solid fa-gift", label: "Gifts"},
  ];

  return (
    <Box
      safeArea
      w="100%"
      h="100%"
      bg="white"
      px="4"
    >
      <BackButton navigation={navigation}/>
      <Box flex={1}>
        <Box>
          <VStack space={3}>
            <Text fontWeight="600" fontSize={28}>Add transaction</Text>
            <SwitchSelector
              options={SWITCH_OPTIONS}
              initial={0}
              onPress={value => console.log(`Call onPress with value: ${value}`)}
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
              mt="3"
              rounded={20}
              variant="filled"
              style={{
                height: 55
              }}
              fontSize="16"
              fontWeight="700"
              py="3"
              px="7"
              _focus={{
                backgroundColor: "#f5f5f6",
                borderColor: "rgba(0,0,0,0.05)",
                borderWidth: 1
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
          <Text fontWeight="600" fontSize={20} mt="7">Expenses categories</Text>
        </Box>
        <Box flex={1} py="5">
          <ScrollView flex={1} borderWidth={2.5} borderColor="#EDEBEC" rounded={35} showsVerticalScrollIndicator={false} contentContainerStyle={{
            padding: 20
          }}>
            <ExpenseCategoryGrid items={ITEMS}/>
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
              bg="#d9d9d9"
              _pressed={{
                backgroundColor: "#b3b3b3"
              }}
            >
                <Text ml="1" mt="-0.5" textAlign="center">Today</Text>
            </Button>

            <Button 
              flex={1} 
              rounded={100} 
              bg="#FAF9FA"
              _pressed={{
                backgroundColor: "#b3b3b3"
              }}
            >
              <Text ml="1" mt="-0.5" textAlign="center">Yesterday</Text>
            </Button>
            <TouchableOpacity style={{
              aspectRatio: 1
            }}>  
              <Center
                rounded={15}
                bg="white"
                borderWidth={1}
                borderColor="#E9E8E9"
                flex={1}
              >
                <FontAwesomeIcon color="#999" icon="fa-solid fa-calendar-days" />
              </Center>
            </TouchableOpacity>
          </HStack>
          <Box style={{ height: 55 }}>
            <Button w="100%" h="100%" rounded={100} bg="#333333" _pressed={{ backgroundColor: 'black' }}>
              <Text color="white" fontWeight="500" fontSize={16}>ADD TRANSACTION</Text>
            </Button>
          </Box>
          
        </VStack>
      </Box>
    </Box>
  )
}