import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Center, HStack, Text, VStack } from "native-base";
import chroma from "chroma-js";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import { lighten, transparentize } from "color2k";
import { useContext } from "react";
import { DataContext } from "../stacks/MainAppStack";

export default function TransactionItem({ reference, categoryID, amount, type, iconSize=22 }) {

  const userGeneratedCategories = useContext(DataContext).docs.find(x => x.id === "categories")?.data() ?? {};

  const category = DEFAULT_CATEGORIES[categoryID]?? userGeneratedCategories[categoryID];

  return (
    <Box
      bg="white"
      borderRadius="20"
      p="2.5"
      mx="-2"
      mb="3"
      style={{
        shadowRadius: 20,
        shadowOpacity: 0.08,
        shadowOffset: { width: -10, height: 10 },
        height: 70
      }}
    >
      <HStack space={3.5}>
        <AspectRatio ratio={1} h="100%">
          <Center bg={transparentize(category.color, 0.85)} rounded={10}>
            <FontAwesomeIcon color={category.color} icon={category.icon} size={iconSize}/>
          </Center>
        </AspectRatio>
        <VStack flex={3} justifyContent="space-between" py="1" mt="-0.5">
          <Text fontWeight="600" fontSize="16">{reference}</Text>
          <Text fontWeight="500" fontSize="12">{category.name.capitalize()}</Text>
        </VStack>
        <Box justifyContent="center">
          <Text 
            color={
              amount === 0
              ? "#bab9bc" 
              : type === "expenses"
              ? "#e44749"
              : type === "incomes"
              ? "#85c462"
              : "black"
            }
            textAlign="right"
            fontWeight="bold"
            mr="1.5"
          >
            {
              amount == 0
              ? amount.toFixed(2)
              : type === "expenses"
              ? `-$${amount.toFixed(2)}`
              : type === "incomes"
              ? `+$${amount.toFixed(2)}`
              : `$${amount.toFixed(2)}`
            }
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}