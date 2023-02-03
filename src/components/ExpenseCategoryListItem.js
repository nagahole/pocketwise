import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { transparentize } from "color2k";
import { AspectRatio, Box, Center, HStack, Text, VStack } from "native-base";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import { CategoriesContext } from "../stacks/MainAppStack";

export default function ExpenseCategoryListItem({
  categoryID, amount, iconSize=22, numberOfTransactions, percentageOfTotal
}) {

  const userGeneratedCategories = useContext(CategoriesContext);

  const category = DEFAULT_CATEGORIES[categoryID]?? userGeneratedCategories.find(x => x.id === categoryID);

  return (
    <TouchableOpacity>
      <Box w="100%" bg="white" mb="4" rounded={24} style={{
        shadowRadius: 20,
        shadowOpacity: 0.08,
        shadowOffset: { width: -10, height: 10 },
        height: 75
      }}>
        <HStack w="100%" space={3} alignItems="center" p="2.5">
          <AspectRatio ratio={1} h="100%">
            <Center
              bg={transparentize(category.color, 0.85)}
              rounded={15}
            >
              <FontAwesomeIcon icon={category.icon} size={iconSize} color={category.color}/>
            </Center>
          </AspectRatio>
          <VStack flex={2}>
            <Text fontWeight="bold" fontSize={16}>{category.name.capitalize()}</Text>
            <Text color="#CBCACB" fontWeight="600" fontSize={12}>{numberOfTransactions} transaction{numberOfTransactions === 1? "" : "s"}</Text>
          </VStack>
          <VStack flex={1} alignItems="flex-end">
            <Text fontWeight="bold" color={ amount === 0? "#bab9bc" : "#e44749"}>
              -${amount.toFixed(2)}
            </Text>
            <Text color="#C5C3C7">{Math.round(percentageOfTotal)}%</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  )
}