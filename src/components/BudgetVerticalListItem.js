import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { transparentize } from "color2k";
import { Box, Text, AspectRatio, Center, HStack, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import useCategory from "../hooks/useCategory";

export default function BudgetVerticalListItem({id, outlay, iconSize=25, totalAmount}) {

  const category = useCategory(id);

  const navigation = useNavigation();

  function handleEditBudget() {
    navigation.navigate("Edit Budget", { id, outlay });
  }

  return (
    <Box w="100%" bg="white" mb="4" rounded={20} style={{
      shadowRadius: 25,
      shadowOpacity: 0.05,
      shadowOffset: { width: -10, height: 10 },
      height: 75
    }}>
      <HStack w="100%" space={3} alignItems="center" p="2.5">
        <AspectRatio ratio={1} h="100%">
          <Center
            bg={transparentize(category.color, 0.85)}
            rounded={12}
          >
            <FontAwesomeIcon icon={category.icon} size={iconSize} color={category.color}/>
          </Center>
        </AspectRatio>
        <VStack flex={2} justifyContent="space-between" pr="1">
          <HStack justifyContent="space-between">
            <Text fontWeight="bold" fontSize={16}>{category.name.capitalize()}</Text>
            <TouchableOpacity onPress={handleEditBudget}>
              <FontAwesomeIcon icon="fa-solid fa-pencil" color="gray"/>
            </TouchableOpacity>
          </HStack>
          <HStack justifyContent="space-between" alignItems="flex-end">
            <Text color="black" fontWeight="600">${totalAmount.toFixed(2)}</Text>
            <Text color="#878486" fontWeight="300">${outlay.toFixed(2)}</Text>
          </HStack>

          { /* PROGRESS BAR */}
          <Box w="100%" mt="1.5" bg={transparentize("#6a49fb", 0.75)} style={{ height: 3 }} overflow="hidden" rounded={100}>
            <Box w={`${totalAmount / outlay * 100}%`} h="100%" bg="#6a49fb" rounded={100}/>
          </Box>
        </VStack>
      </HStack>
    </Box>
  )
}