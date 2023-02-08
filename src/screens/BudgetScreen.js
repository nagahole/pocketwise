import { Box, Center, FlatList, HStack, Text } from "native-base";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BudgetVerticalListItem from "../components/BudgetVerticalListItem";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import useCategory from "../hooks/useCategory";
import { DataContext, RecentTransactionsContext, startOfTheMonth } from "../stacks/MainAppStack";
import { FlashList } from "@shopify/flash-list";
import { groupTransactionsByCategory } from "../../utils/NagaUtils";

export default function BudgetScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const dataCollection = useContext(DataContext);

  const rawOutlaysObject = dataCollection.docs.find(x => x.id === "outlays")?.data()?? {};

  const transactionsThisMonth = useContext(RecentTransactionsContext).filter(t => t.date >= startOfTheMonth.getTime());

  const groupedTransactions = groupTransactionsByCategory(transactionsThisMonth);

  let expenseOutlaysArr = [];

  const userGeneratedCategories = dataCollection.docs.find(x => x.id === "categories")?.data() ?? {};

  for (let key in rawOutlaysObject) {

    const category = DEFAULT_CATEGORIES[key]?? userGeneratedCategories[key]?? null;

    if (category.type !== "expenses")
      continue;

    expenseOutlaysArr.push({
      id: key,
      outlay: rawOutlaysObject[key]
    })
  }

  expenseOutlaysArr.sort((a, b) => { 
    //Sorted by proportion of outlay filled up
    return (
      - ((groupedTransactions[a.id]?.reduce((acc, t) => acc + t.amount, 0)?? 0) / a.outlay)
      + ((groupedTransactions[b.id]?.reduce((acc, t) => acc + t.amount, 0)?? 0) / b.outlay)
    )
  });

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      style={{
        paddingTop: insets.top + 27,
        paddingHorizontal: 27
      }}
    >
      <Text fontWeight="600" fontSize="32">Monthly budget</Text>
      <HStack alignItems="flex-end" mt="3" space={3}>
        <Text fontWeight="bold" fontSize="44" lineHeight="44">${Math.round(expenseOutlaysArr.reduce((acc, o) => acc + o.outlay, 0))}</Text>
        <Text fontWeight="600" fontSize="16" mb="1">in {expenseOutlaysArr.length} {expenseOutlaysArr.length === 1? "category" : "categories"}</Text>
      </HStack>
      <Box pt="1" pb="9" flex={1} mx="-0.5">
        <FlatList
          data={expenseOutlaysArr}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          //Have to do this to make shadow overflow
          style={{
            marginHorizontal: -20
          }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 40,
            paddingHorizontal: 14
          }}
          renderItem={({item}) => (
            <BudgetVerticalListItem 
              {...item} 
              totalAmount={groupedTransactions[item.id]?.reduce((acc, t) => acc + t.amount, 0)?? 0}
            />
          )}
        />
      </Box>

      <TouchableOpacity onPress={() => navigation.navigate("Add Budget")} style={{ zIndex: 9999 }}>
        <Center w="100%" bg="#6a48fa" rounded={100} bottom="6" style={{ height: 54 }}>
          <Text fontWeight="600" fontSize="16" color="white">ADD NEW BUDGET</Text>
        </Center>
      </TouchableOpacity>
      
    </Box>
  )
}