import { Box, Button, Center, HStack, Input, ScrollView, Text, VStack } from "native-base";
import BackButton from "../components/BackButton";
import { SWITCH_OPTIONS } from "./AddTransactionScreen";
import SwitchSelector from "react-native-switch-selector";
import { TouchableOpacity } from "react-native";
import IconGrid from "../components/IconGrid";

const COLORS = [
  "#FE8959",
  "#A58DCD",
  "#0095FA",
  "#F177AA",
  "#216AFD",
  "#24CED1",
  "#31C530",
  "#FAFD76",
  "#EA516E",
]

const ICONS = [
  "fa-solid fa-bowl-food",
  "fa-solid fa-taxi",
  "fa-solid fa-burger",
  "fa-solid fa-shirt",
  "fa-solid fa-dumbbell",
  "fa-regular fa-heart",
  "fa-solid fa-file-invoice",
  "fa-solid fa-file-invoice-dollar",
  "fa-solid fa-laptop",
  'fa-solid fa-gift'
]

export default function CreateCategoryScreen({navigation}) {
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
          <Text fontWeight="600" fontSize={20} mt="7">Planned outlay</Text>
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
              <Text fontWeight="600" color="#CECDCE" mr="4">USD per month</Text>
            )}
          />
          <Text fontWeight="600" fontSize={20} mt="7">Choose icon</Text>
        </Box>
        <Box flex={1} py="3">
          <ScrollView flex={1} borderWidth={2.5} borderColor="#EDEBEC" rounded={35} showsVerticalScrollIndicator={false} contentContainerStyle={{
            padding: 20
          }}>
            <IconGrid icons={ICONS}/>
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
                COLORS.map(hex => (
                  <TouchableOpacity>
                    <Box bg={hex} h="6" w="6" rounded={6}/>
                  </TouchableOpacity>
                ))
              }
            </HStack>
          </VStack>
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