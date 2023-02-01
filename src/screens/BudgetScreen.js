import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Center, FlatList, HStack, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BudgetVerticalListItem from "../components/BudgetVerticalListItem";
import { FAKEBUDGETDETAILSDATA } from "./HomeScreen";

export default function BudgetScreen({navigation}) {
  const insets = useSafeAreaInsets();

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 20
      }}
    >
      <Text fontWeight="600" fontSize="32">Monthly budget</Text>
      <HStack alignItems="flex-end" mt="3" space={3}>
        <Text fontWeight="bold" fontSize="44" lineHeight="44">$2,500</Text>
        <Text fontWeight="600" fontSize="16" mb="1">in 10 categories</Text>
      </HStack>
      <Box pt="1" pb="9" flex={1} mx="-0.5">
        <FlatList
          data={FAKEBUDGETDETAILSDATA}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 34
          }}
          renderItem={({item}) => <BudgetVerticalListItem {...item}/>}
        />
      </Box>

      <TouchableOpacity onPress={() => navigation.navigate("Add Budget")}>
        <Center w="100%" bg="#353436" h="12" rounded={100} position="absolute" bottom="6">
          <Text color="white">CREATE A NEW BUDGET</Text>
        </Center>
      </TouchableOpacity>
      
    </Box>
  )
}