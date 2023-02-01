import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Circle, HStack, Text, VStack } from "native-base";
import { Dimensions } from "react-native";

export default function BudgetItemWidget({label, budgetPerMonth, iconName, index}) {
  return (
    <Box
      bg="white"
      borderRadius="30"
      ml={index === 0? "-1.5" : "2"}
      mr="2"
      style={{
        shadowRadius: 25,
        shadowOpacity: 0.05,
        shadowOffset: { width: -10, height: 10 },
        width: Dimensions.get('window').width * 0.8,
        height: 200
      }}
    >
      <Box
        height="42%"
        bg="#C6E6FF"
        borderTopRadius="30"
        p="4"
        px="5"
      >
        <HStack justifyContent="space-between">
          <HStack>
            <Circle bg="white" w="12" h="12">
              <FontAwesomeIcon icon={iconName} color="#2A9CF1" size={24}/>
            </Circle>
            <VStack pl="3" justifyContent="center">
              <Text fontWeight="600">{label}</Text>
              <Text color="#309DDE" fontWeight="600">${budgetPerMonth} per month</Text>
            </VStack>
          </HStack>
          <Box>
            <FontAwesomeIcon icon="fa-solid fa-ellipsis" color="#309DDE" size={20}/>
          </Box>
        </HStack>
      </Box>
      <Box
        height="58%"
      ></Box>
    </Box>
  )
}