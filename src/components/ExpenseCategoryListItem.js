import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { transparentize } from "color2k";
import { AspectRatio, Box, Center, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import useCategory from "../hooks/useCategory";

export default function ExpenseCategoryListItem({
  categoryID, amount, iconSize=24, numberOfTransactions, percentageOfTotal, onPress
}) {

  const category = useCategory(categoryID);

  return (
    <TouchableOpacity onPress={onPress}>
      <Box w="100%" bg="white" mb="3" rounded={20} style={{
        shadowRadius: 20,
        shadowOpacity: 0.08,
        shadowOffset: { width: -10, height: 10 },
        height: 70
      }}>
        <HStack w="100%" space={3.5} alignItems="center" p="2.5" pr="4">
          <AspectRatio ratio={1} h="100%">
            <Center
              bg={transparentize(category.color, 0.85)}
              rounded={10}
            >
              <FontAwesomeIcon icon={category.icon} size={iconSize} color={category.color}/>
            </Center>
          </AspectRatio>
          <VStack flex={2}>
            <Text fontWeight="bold" fontSize={16}>{category.name.capitalize()}</Text>
            <Text color="#999" fontWeight="600" fontSize={12}>{numberOfTransactions} transaction{numberOfTransactions === 1? "" : "s"}</Text>
          </VStack>
          <VStack flex={1} alignItems="flex-end">
            <Text fontWeight="bold" color={ amount === 0? "#bab9bc" : "#e44749"}>
              -${amount.toFixed(2)}
            </Text>
            <Text color="#999">{Math.round(percentageOfTotal)}%</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  )
}