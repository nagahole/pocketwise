import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Slider from "@react-native-community/slider";
import { darken, transparentize } from "color2k";
import { Box, Circle, HStack, Text, VStack } from "native-base";
import { useContext } from "react";
import { Dimensions } from "react-native";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import useCategory from "../hooks/useCategory";
import { DataContext } from "../stacks/MainAppStack";

export default function BudgetItemWidget({id, outlay, totalAmount, first, last}) {

  const category = useCategory(id);

  return (
    <Box
      bg="white"
      borderRadius="30"
      ml={first? "-1.5" : "2"}
      mr={last? "0" : "2"}
      style={{
        shadowRadius: 25,
        shadowOpacity: 0.05,
        shadowOffset: { width: -10, height: 10 },
        width: Dimensions.get('window').width - 30 * 2 + 11,
        height: 200
      }}
    >
      <Box
        height="42%"
        bg={transparentize(category.color, 0.7)}
        borderTopRadius="30"
        p="4"
        px="5"
      >
        <HStack justifyContent="space-between">
          <HStack>
            <Circle bg="white" w="12" h="12">
              <FontAwesomeIcon icon={category.icon} color={category.color} size={24}/>
            </Circle>
            <VStack pl="3" justifyContent="center">
              <Text fontWeight="600">{category.name.capitalize()}</Text>
              <Text color={darken(category.color, 0.15)} fontWeight="600">${outlay} per month</Text>
            </VStack>
          </HStack>
          {/* <Box>
            <FontAwesomeIcon icon="fa-solid fa-ellipsis" color={category.color} size={20}/>
          </Box> */}
        </HStack>
      </Box>
      <Box
        height="58%"
        px="3.5"
        py="7"
      >
        <Box w="100%" h="1.5" bg={transparentize(category.color, 0.85)} rounded={100} overflow="hidden">
          <Box w={`${totalAmount / outlay * 100}%`} h="100%" bg={category.color} rounded={100}/>
        </Box>
        <Text textAlign="center" fontSize="14" mt="5">
          Spent 
            <Text fontWeight="600" color={category.color}> ${totalAmount.toFixed(2)} </Text> 
          from 
            <Text fontWeight="600" color={darken(category.color, 0.15)}> ${outlay.toFixed(2)} </Text> 
          this month
        </Text>
      </Box>
    </Box>
  )
}