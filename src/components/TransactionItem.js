import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Center, HStack, Text, VStack } from "native-base";
import { Dimensions } from "react-native";

export default function TransactionItem({ title, category, transaction }) {
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
          <Center bg="#DBEBFE" rounded={10}>
            <FontAwesomeIcon color="#179AF8" icon="fa-solid fa-dollar-sign" size={22}/>
          </Center>
        </AspectRatio>
        <VStack flex={3} justifyContent="space-between" py="1" mt="-0.5">
          <Text fontWeight="600" fontSize="16">{title}</Text>
          <Text fontWeight="500" fontSize="12">{category}</Text>
        </VStack>
        <Box justifyContent="center">
          <Text 
            color={transaction < 0? "#E44749" : transaction > 0? "#85C462" : "#BAB9BC"}
            textAlign="right"
            fontWeight="bold"
            mr="1.5"
          >{transaction < 0? `-$${(-transaction).toFixed(2)}` : `$${transaction.toFixed(2)}`}</Text>
        </Box>
      </HStack>
    </Box>
  )
}