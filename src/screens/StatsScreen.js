import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Button, Center, FlatList, HStack, Select, Text, VStack } from "native-base";
import { useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";import { VictoryBar, VictoryChart, VictoryGroup } from "victory-native";
import ExpenseCategoryListItem from "../components/ExpenseCategoryListItem";
import { ThisMonthsTransactionsContext } from "../stacks/MainAppStack";

const FAKEDATA = [
  {
    label: "Food",
    iconName: "fa-solid fa-bowl-food"
  },
  {
    label: "Clothes",
    iconName: "fa-solid fa-shirt"
  },
  {
    label: "Eating out",
    iconName: "fa-solid fa-burger"
  },
  {
    label: "Transport",
    iconName: "fa-solid fa-taxi"
  },
  {
    label: "Tech",
    iconName: "fa-solid fa-laptop"
  },
  {
    label: "Health",
    iconName: "fa-regular fa-heart"
  },
]

export default function StatsScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const thisMonthsTransactions = useContext(ThisMonthsTransactionsContext);

  //Map to avoid mutating original array
  groupedTransactions = thisMonthsTransactions.map(x => x).reduce((acc, t) => {
    (acc[t.categoryID] = acc[t.categoryID] || []).push(t);

    return acc;
  }, {});

  let arr = Object.values(groupedTransactions).sort((a, b) => {
    //Sum of a's transactions > sum of b's transactions
    return -a.reduce((acc, t) => acc + t.amount, 0) + b.reduce((acc, t) => acc + t.amount, 0);
  });

  let categoryAmounts = {};

  let totalAmount = arr.reduce((acc, categoryGroup) => {
    let categoryAmount = categoryGroup.reduce((acc, t) => acc + t.amount, 0);
    categoryAmounts[categoryGroup[0].categoryID] = categoryAmount;
    return acc + categoryAmount
  }, 0);

  //Right now is an array of array of transactions
  arr = arr.map(categoryGroup => {
    return {
      categoryID: categoryGroup[0].categoryID,
      amount: categoryAmounts[categoryGroup[0].categoryID],
      numberOfTransactions: categoryGroup.length,
      percentageOfTotal: categoryAmounts[categoryGroup[0].categoryID] / totalAmount * 100
    }
  });

  console.log(arr)

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      style={{
        paddingTop: insets.top
      }}
    >
      <FlatList
        data={arr}
        renderItem={({item}) => <ExpenseCategoryListItem {...item}/>}
        contentContainerStyle={{
          padding: 12
        }}
        keyExtractor={item => item.label}
        ListHeaderComponent={(
          <Box py="3">
            <HStack justifyContent="space-between" alignItems="center" px="3">
              <VStack>
                <Text fontWeight="600" fontSize={32}>Statistics</Text>
                <Text fontWeight="500" color="#555555">Aug 1 - Aug 18, 2022</Text>
              </VStack>
              <TouchableOpacity>
                <Center borderWidth={1.5} borderColor="#EFEEEE" w="12" h="12" rounded={15}>
                  <FontAwesomeIcon icon="fa-solid fa-calendar-days" color="#7C7B7A" size={18}/>
                </Center>
              </TouchableOpacity>
            </HStack>
            <Box px="3">
              <Select 
                mt="8"
                fontSize="16"
                py="3"
                px="4"
                rounded="15"
                placeholder="Graph by..."
              >
                <Select.Item label="By days" value="days"/>
                <Select.Item label="By weeks" value="weeks"/>
                <Select.Item label="By months" value="months"/>
              </Select>
            </Box>

            <Box w="100%" h="56" overflow="visible">
              <VictoryChart
                colorScale="qualitative"
                padding={{
                  top: 40,
                  left: 27,
                  bottom: 95,
                  right: 40
                }}
              >
                <VictoryGroup
                  offset={15}
                >
                  <VictoryBar
                    data={[{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 5}, { x:4, y:7}, {x:5, y:8}, {x:6, y:10}]}
                  />
                  <VictoryBar
                    data={[{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 5}, { x:4, y:7}, {x:5, y:8}, {x:6, y:10}]}
                  />
                </VictoryGroup>
              </VictoryChart>
            </Box>
            
            <Box px="3">
              <TouchableOpacity onPress={() => navigation.navigate("Detailed Analytics")}>
                <Center w="100%" h="12" bg="#E8E6E8" mt="5" rounded={100}>
                  <Text fontWeight="600" fontSize="15">DETAILED ANALYTICS</Text>
                </Center>
              </TouchableOpacity>
            </Box>
            <Box px="3" mt="6">
              <Text fontWeight="600" fontSize="18">Expenses categories</Text>
            </Box>
          </Box>
        )}
      />
    </Box>
  )
}