import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Center, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

export default function ExpenseCategoryListItem({label, iconName, iconSize=20}) {
  return (
    <TouchableOpacity>
      <Box w="100%" borderColor="#EFEDEF" borderWidth={1.5} mb="4" rounded={24} style={{
        height: 75
      }}>
        <HStack w="100%" space={3} alignItems="center" p="2.5">
          <AspectRatio ratio={1} h="100%">
            <Center
              bg="#EFEDEF"
              rounded={15}
            >
              <FontAwesomeIcon icon={iconName} size={iconSize} color="#B0AEB0"/>
            </Center>
          </AspectRatio>
          <VStack flex={2}>
            <Text fontWeight="bold" fontSize={16}>{label}</Text>
            <Text color="#CBCACB" fontWeight="600" fontSize={12}>10 transactions</Text>
          </VStack>
          <VStack flex={1} alignItems="flex-end">
            <Text color="#878486" fontWeight="bold">-$99.00</Text>
            <Text color="#C5C3C7">24%</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  )
}