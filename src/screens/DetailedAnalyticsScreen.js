import { Box, Center, Circle, FlatList, HStack, Select, Text } from "native-base";
import BackButton from "../components/BackButton";
import { VictoryChart, VictoryLabel, VictoryPie } from "victory-native";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import Svg from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import TransactionItem from "../components/TransactionItem";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext, RecentTransactionsContext, startOfTheMonth } from "../stacks/MainAppStack";
import { interpolateColors } from "../../utils/ColorGenerator";
import * as d3 from "d3";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RECENT_TRANSACTIONS_TO_SHOW } from "../data/Constants";
import moment, { months } from "moment";
import { groupTransactionsByCategory, getExpenseGroupsArr } from "../../utils/NagaUtils";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function DetailedAnalyticsScreen({navigation}) {
  
  const recentTransactions = useContext(RecentTransactionsContext);

  const [colors, setColors] = useState([]);
  const [monthsColors, setMonthsColors] = useState([]);
  const [weeksColors, setWeeksColors] = useState([]);
  const [daysColors, setDaysColors] = useState([]);

  const [monthsExpenseGroupsArr, setMonthsExpenseGroupsArr] = useState([]);
  const [weeksExpenseGroupsArr, setWeeksExpenseGroupsArr] = useState([]);
  const [daysExpenseGroupsArr, setDaysExpenseGroupsArr] = useState([]);

  const [monthsData, setMonthsData] = useState([]);
  const [weeksData, setWeeksData] = useState([]);
  const [daysData, setDaysData] = useState([]);

  const [monthsTotalAmount, setMonthsTotalAmount] = useState(0);
  const [weeksTotalAmount, setWeeksTotalAmount] = useState(0);
  const [daysTotalAmount, setDaysTotalAmount] = useState(0);

  const [monthsIncrement, setMonthsIncrement] = useState(0);
  const [weeksIncrement, setWeeksIncrement] = useState(0);
  const [daysIncrement, setDaysIncrement] = useState(0);

  const userGeneratedCategories = useContext(DataContext).docs.find(x => x.id === "categories")?.data() ?? {};

  const [groupBy, setGroupBy] = useState("months");

  useEffect(() => {
    const transactionsThisMonth = recentTransactions.filter(x => x.date >= startOfTheMonth.getTime());
    const transactionsThisWeek = recentTransactions.filter(x => x.date >= moment().startOf("isoWeek").unix() * 1000);
    const transactionsToday = recentTransactions.filter(x => x.date >= moment().startOf("day").unix() * 1000);

    generateMonthsData(transactionsThisMonth);
    generateWeeksData(transactionsThisWeek);
    generateDaysData(transactionsToday);

  }, [recentTransactions]);

  function generateMonthsData(transactions) {
    const [_monthsExpenseGroupsArr, _monthsTotalAmount] = 
      getExpenseGroupsArr(groupTransactionsByCategory(transactions));

    setMonthsExpenseGroupsArr(_monthsExpenseGroupsArr);
    setMonthsTotalAmount(_monthsTotalAmount);

    setMonthsData(_monthsExpenseGroupsArr.map(expGroup => {
      let category = DEFAULT_CATEGORIES[expGroup.categoryID]?? userGeneratedCategories[expGroup.categoryID]?? null;
  
      return {
        x: category.name.capitalize(),
        y: expGroup.amount
      }
    }));

    generateColors(_monthsExpenseGroupsArr, "months");
  }

  function generateWeeksData(transactions) {
    const [_weeksExpenseGroupsArr, _weeksTotalAmount] = 
      getExpenseGroupsArr(groupTransactionsByCategory(transactions));

    setWeeksExpenseGroupsArr(_weeksExpenseGroupsArr);
    setWeeksTotalAmount(_weeksTotalAmount);

    setWeeksData(_weeksExpenseGroupsArr.map(expGroup => {
      let category = DEFAULT_CATEGORIES[expGroup.categoryID]?? userGeneratedCategories[expGroup.categoryID]?? null;
  
      return {
        x: category.name.capitalize(),
        y: expGroup.amount
      }
    }));

    generateColors(_weeksExpenseGroupsArr, "weeks");
  }

  function generateDaysData(transactions) {
    const [_daysExpenseGroupsArr, _daysTotalAmount] = 
      getExpenseGroupsArr(groupTransactionsByCategory(transactions));
    
    setDaysExpenseGroupsArr(_daysExpenseGroupsArr);
    setDaysTotalAmount(_daysTotalAmount);

    setDaysData(_daysExpenseGroupsArr.map(expGroup => {
      let category = DEFAULT_CATEGORIES[expGroup.categoryID]?? userGeneratedCategories[expGroup.categoryID]?? null;
  
      return {
        x: category.name.capitalize(),
        y: expGroup.amount
      }
    }));

    generateColors(_daysExpenseGroupsArr, "days");
  }

  const didMount = useRef(true);

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
      return;
    }

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("type", "==", "expenses")
      .orderBy("date")
      .startAt(moment().startOf("month").add(monthsIncrement, "month").unix() * 1000)
      .endAt(moment().endOf("month").add(monthsIncrement, "month").unix() * 1000)
      .get()
      .then(querySnapshot => {
        let transactions = querySnapshot.docs.map(x => x.data());

        generateMonthsData(transactions);
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));

  }, [monthsIncrement])

  const didMount2 = useRef(true);

  useEffect(() => {
    if (didMount2.current) {
      didMount2.current = false;
      return;
    }

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("type", "==", "expenses")
      .orderBy("date")
      .startAt(moment().startOf("isoWeek").add(weeksIncrement, "week").unix() * 1000)
      .endAt(moment().endOf("isoWeek").add(weeksIncrement, "week").unix() * 1000)
      .get()
      .then(querySnapshot => {
        let transactions = querySnapshot.docs.map(x => x.data());

        generateWeeksData(transactions);
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));

  }, [weeksIncrement])

  const didMount3 = useRef(true);

  useEffect(() => {
    if (didMount3.current) {
      didMount3.current = false;
      return;
    }

    firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("type", "==", "expenses")
      .orderBy("date")
      .startAt(moment().startOf("day").add(daysIncrement, "day").unix() * 1000)
      .endAt(moment().endOf("day").add(daysIncrement, "day").unix() * 1000)
      .get()
      .then(querySnapshot => {
        let transactions = querySnapshot.docs.map(x => x.data());

        generateDaysData(transactions);
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));

  }, [daysIncrement])

  useEffect(() => {
    applyColors();
  }, [groupBy, monthsData, weeksData, daysData]);

  function applyColors() {
    if (groupBy === "months") setColors(monthsColors)
    else if (groupBy === "weeks") setColors(weeksColors)
    else if (groupBy === "days") setColors(daysColors)
  }

  function increment(amount) {
    if (groupBy === "months") setMonthsIncrement(prev => prev + amount)
    else if (groupBy === "weeks") setWeeksIncrement(prev => prev + amount)
    else if (groupBy === "days") setDaysIncrement(prev => prev + amount)
  }

  function generateColors(arr, timeFrame) {
    const colorRangeInfo = {
      colorStart: 0,
      colorEnd: 1,
      useEndAsStart: false,
    }; 

    if (timeFrame === "months") setMonthsColors(interpolateColors(arr.length, d3.interpolateWarm, colorRangeInfo))
    else if (timeFrame === "weeks") setWeeksColors(interpolateColors(arr.length, d3.interpolateWarm, colorRangeInfo))
    else if (timeFrame === "days") setDaysColors(interpolateColors(arr.length, d3.interpolateWarm, colorRangeInfo))
    else console.warn("Error: Unrecognized tiemframe in generateColors method")
  }

  const insets = useSafeAreaInsets();

  function getGraphData() {
    if (groupBy === "months") return monthsData
    else if (groupBy === "weeks") return weeksData
    else if (groupBy === "days") return daysData
  }

  function getLegendData() {
    if (groupBy === "months") return monthsExpenseGroupsArr
    else if (groupBy === "weeks") return weeksExpenseGroupsArr
    else if (groupBy === "days") return daysExpenseGroupsArr
  }

  function getTotalAmount() {
    if (groupBy === "months") return monthsTotalAmount
    else if (groupBy === "weeks") return weeksTotalAmount
    else if (groupBy === "days") return daysTotalAmount
  }

  function handleSeeMore() {
    navigation.navigate("See Transactions", { category: "all", dateRange: "all" })
  }

  function getTimeText() {
    if (groupBy === "months") return moment().add(monthsIncrement, "months").format("MMMM, YYYY")
    else if (groupBy === "weeks") {

      if (weeksIncrement === 0)
        return `${moment().startOf("isoWeek").format("MMM Do")} - ${moment().format("MMM Do")}`;
      else 
        return `${moment().startOf("isoWeek").add(weeksIncrement, "weeks").format("MMM Do")}`
        + ` - ${moment().endOf("isoWeek").add(weeksIncrement, "weeks").format("MMM Do")}` 
    } else if (groupBy === "days") return moment().add(daysIncrement, "days").format("MMMM Do")
  }

  return (
    <Box
      w="100%"
      h="100%"
      safeAreaTop
      bg="white"
    >
      <FlatList
        data={recentTransactions.slice(0, Math.min(RECENT_TRANSACTIONS_TO_SHOW, recentTransactions.length))}
        renderItem={({item}) => (
          <Box style={{ paddingHorizontal: 5 }}>
            <TransactionItem {...item}/>
          </Box>
        )}
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom
        }}
        ListHeaderComponent={() => (
          <Box>
            <BackButton/>
            <Text fontWeight="600" fontSize="32">Detailed analytics</Text>
            <Select 
              mt="3"
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
            <Box mt="4">
            </Box>
            <Box mt="4" rounded={20} borderWidth={1.5} borderColor="#EFEDEF" p="3">
              <HStack ml="3" mt="32" justifyContent="space-between" position="absolute" w="full" zIndex={1}>
                <TouchableOpacity onPress={() => increment(-1)}>
                  <FontAwesomeIcon icon="fa-solid fa-chevron-left" color="#007ffa" size={24}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => increment(1)}>
                  <FontAwesomeIcon icon="fa-solid fa-chevron-right" color="#007ffa" size={24}/>
                </TouchableOpacity>
              </HStack>
              <Box h="64">
                <Svg viewBox={`0 0 ${Dimensions.get('window').width - 40} 400`}>
                  <VictoryPie 
                    colorScale={monthsColors}
                    data={getGraphData()}
                    labels={() => null}
                    padding={{
                      right: 40,
                      left: 11,
                      top: 0,
                      bottom: 148
                    }}
                    innerRadius={80}
                    radius={110}
                    cornerRadius={3}
                    padAngle={1}
                    width={Dimensions.get('window').width - 40}
                    height={400}
                  />
                  <VictoryLabel 
                    textAnchor="middle" 
                    text={`$${Math.round(getTotalAmount())}`}
                    x={(Dimensions.get('window').width - 40)* 0.49}
                    y={197}
                    style={{
                      fontSize: 60
                    }}
                  />
                  <VictoryLabel 
                    textAnchor="middle" 
                    text="Total spending"
                    x={(Dimensions.get('window').width - 40) * 0.49}
                    y={147}
                    style={{
                      fontSize: 25,
                      fontWeight: '600'
                    }}
                  />
                  <VictoryLabel 
                    textAnchor="middle" 
                    text={getTimeText()}
                    x={(Dimensions.get('window').width - 40) * 0.49}
                    y={247}
                    style={{
                      fontSize: 25
                    }}
                  />
                </Svg>
              </Box>
              <Box flexDir="row" flexWrap="wrap" mt="3">
                {
                  getLegendData().map((expGroup, i) => {
                    let category = DEFAULT_CATEGORIES[expGroup.categoryID]?? userGeneratedCategories[expGroup.categoryID]?? null;
                    return (
                      <Circle borderColor="#E4E3E3" borderWidth={1} py="0.5" px="2" mb="2" mr="2" key={category.id}>
                        <HStack space={1} alignItems="center">
                          <Circle w="3" h="3" bg={monthsColors[i]}/>
                          <Text>{category.name.capitalize()}</Text>
                        </HStack>
                      </Circle>
                    )
                  })
                }
              </Box>
            </Box>
            <HStack alignItems="center" justifyContent="space-between" mt="7" mb="2.5">
              <Text fontSize={21} fontWeight="500">Recent transactions</Text>
              <TouchableOpacity onPress={handleSeeMore}>
                <HStack alignItems="center" mt="1">
                  <Text fontSize={14}>See all</Text>
                  <FontAwesomeIcon icon="fa-solid fa-chevron-right" size={14}/>
                </HStack>
              </TouchableOpacity>
            </HStack>
          </Box>
        )}
      />
    </Box>
  )
}