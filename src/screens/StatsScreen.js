import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Button, Center, FlatList, HStack, Select, Text, VStack } from "native-base";
import { useContext, useEffect, useRef, useState } from "react";
import { LayoutAnimation, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory-native";
import ExpenseCategoryListItem from "../components/ExpenseCategoryListItem";
import { DataContext, RecentTransactionsContext, startOfTheMonth } from "../stacks/MainAppStack";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { UNITS_TO_GRAPH } from "../data/Constants";
import { useCollectionData } from "react-firebase-hooks/firestore";
import moment from "moment";
import { db } from "../firebase";
import { groupTransactionsByCategory, getExpenseGroupsArr, getDays, groupTransactionsByTime as groupTransactionsByTime, groupTransactionsByTimeToGraphArr } from "../../utils/NagaUtils";

export default function StatsScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const recentTransactions = useContext(RecentTransactionsContext);

  const previousMonthsTransactionsQuery = (
    db
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("type", "==", "expenses")
      .orderBy("date")
      .startAt(moment(startOfTheMonth).subtract(UNITS_TO_GRAPH - 1, "month").unix() * 1000)
      .endBefore(startOfTheMonth.getTime())
  )

  const [previousMonthsExpenses] = useCollectionData(previousMonthsTransactionsQuery);

  const [expenseGroupsArr, setExpenseGroupsArr] = useState([]);
  const [allMonthsExpenses, setAllMonthsExpenses] = useState([]);

  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [weeklyExpenses, setWeeklyExpenses] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);

  const [monthlyBudgetData, setMonthlyBudgetData] = useState([]);
  const [weeklyBudgetData, setWeeklyBudgetData] = useState([]);
  const [dailyBudgetData, setDailyBudgetData] = useState([]);

  const outlays = useContext(DataContext).docs.find(x => x.id === "outlays")?.data() ?? {};

  const budgetThisMonth = Object.values(outlays).reduce((acc, amount) => acc + amount, 0);

  const daysThisMonth = getDays(new Date().getFullYear(), new Date().getMonth() + 1);

  const [groupBy, setGroupBy] = useState("months");

  useEffect(() => {
    let thisMonthsExpenses = recentTransactions.filter(x => x.date > startOfTheMonth.getTime() && x.type === "expenses");

    setExpenseGroupsArr(getExpenseGroupsArr(groupTransactionsByCategory(thisMonthsExpenses))[0]);
    setAllMonthsExpenses(thisMonthsExpenses.concat(previousMonthsExpenses?? []));

  }, [recentTransactions, previousMonthsExpenses])

  useEffect(() => {

    let _monthlyExpenses = groupTransactionsByTimeToGraphArr(allMonthsExpenses, "month", UNITS_TO_GRAPH);
    let _weeklyExpenses = groupTransactionsByTimeToGraphArr(allMonthsExpenses, "week", UNITS_TO_GRAPH);
    let _dailyExpenses = groupTransactionsByTimeToGraphArr(allMonthsExpenses, "day", UNITS_TO_GRAPH);
    
    setMonthlyExpenses(_monthlyExpenses);
    setWeeklyExpenses(_weeklyExpenses);
    setDailyExpenses(_dailyExpenses);

    setMonthlyBudgetData(_monthlyExpenses.map(obj => ({ x: obj.x, y: budgetThisMonth })));
    setWeeklyBudgetData(_weeklyExpenses.map(obj => ({ x: obj.x, y: budgetThisMonth / ( daysThisMonth / 7 ) })));
    setDailyBudgetData(_dailyExpenses.map(obj => ({ x: obj.x, y: budgetThisMonth / daysThisMonth })));

  }, [allMonthsExpenses])

  function getCurrentExpenseData() {
    if (groupBy === "months") return monthlyExpenses
    else if (groupBy === "weeks") return weeklyExpenses
    else if (groupBy === "days") return dailyExpenses
  }

  function getCurrentBudgetData() {
    if (groupBy === "months") return monthlyBudgetData;
    else if (groupBy === "weeks") return weeklyBudgetData;
    else if (groupBy === "days") return dailyBudgetData;
  }

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
        data={expenseGroupsArr}
        keyExtractor={item => item.categoryID}
        renderItem={({item}) => (
          <ExpenseCategoryListItem 
            {...item}
            onPress={() => { 
              let dateMin = moment().startOf("month").toDate();

              let dateMax = moment().startOf("month").add(1, "month").toDate();

              navigation.navigate("See Transactions", { 
                category: item.categoryID, 
                dateRange: {
                  min: dateMin.getTime(),
                  max: Math.min(dateMax.getTime(), Date.now())
                }
              })
            }}
          />
        )}
        contentContainerStyle={{
          padding: 15
        }}
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
                defaultValue={groupBy}
              >
                <Select.Item label="By days" value="days" onPress={() => setGroupBy("days")}/>
                <Select.Item label="By weeks" value="weeks" onPress={() => setGroupBy("weeks")}/>
                <Select.Item label="By months" value="months" onPress={() => setGroupBy("months")}/>
              </Select>
            </Box>

            <Box w="100%" h="56" overflow="visible" style={{ marginHorizontal: -15}}>
              <VictoryChart
                colorScale="qualitative"
                padding={{
                  top: 40,
                  left: 47,
                  bottom: 95,
                  right: 40
                }}

              >
                <VictoryAxis
                  tickFormat={t => moment(t).format(
                    groupBy === "months"
                    ? "MMM"
                    : groupBy === "weeks"
                    ? "MMM D"
                    : "ddd"
                  )}
                  tickValues={
                    getCurrentExpenseData().map(obj => obj.x)
                  }
                />
                <VictoryAxis 
                  tickCount={4}
                  tickFormat={t => t < 0.05? "" : t}
                  dependentAxis
                  style={{
                    grid: {
                      stroke: "rgba(0,0,0,0.08)",
                      strokeWidth: 1
                    },
                  }}
                />
                <VictoryGroup
                  offset={15}
                >
                  <VictoryBar
                    data={getCurrentBudgetData()}
                    cornerRadius={{ topLeft: 6, topRight: 6}}
                    style={{
                      data: {
                        fill: "#31C530"
                      }
                    }}
                    animate={{
                      duration: 1000,
                      easing: 'exp'
                    }}
                  />
                  <VictoryBar
                    data={getCurrentExpenseData()}
                    cornerRadius={{ topLeft: 6, topRight: 6}}
                    style={{
                      data: {
                        fill: "#E86060",
                      }
                    }}
                    animate={{
                      duration: 1000,
                      easing: 'exp'
                    }}
                  />
                </VictoryGroup>
              </VictoryChart>
            </Box>
            
            <Box px="3">
              <TouchableOpacity onPress={() => navigation.navigate("Detailed Analytics")}>
                <Center w="100%" h="12" bg="#6a48fa" mt="5" rounded={100}>
                  <Text fontWeight="600" fontSize="15" color="white">DETAILED ANALYTICS</Text>
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