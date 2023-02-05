import { Box, Center, Circle, FlatList, HStack, Select, Text } from "native-base";
import BackButton from "../components/BackButton";
import SwitchSelector from "react-native-switch-selector";
import { SWITCH_OPTIONS } from "./AddTransactionScreen";
import { VictoryChart, VictoryLabel, VictoryPie } from "victory-native";
import { Dimensions, TouchableOpacity } from "react-native";
import Svg from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FAKERECENTTRANSACTIONSDATA } from "./HomeScreen";
import TransactionItem from "../components/TransactionItem";
import DEFAULT_CATEGORIES from "../data/DefaultCategories";
import { useContext } from "react";
import { DataContext, RecentTransactionsContext, startOfTheMonth } from "../stacks/MainAppStack";
import { getRandomNumber, interpolateColors } from "../../utils/ColorGenerator";
import * as d3 from "d3";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RECENT_TRANSACTIONS_TO_SHOW } from "../data/Constants";
import moment from "moment";
import { groupTransactionsByCategory, getExpenseGroupsArr } from "../../utils/NagaUtils";

export default function DetailedAnalyticsScreen({navigation}) {
  
  const recentTransactions = useContext(RecentTransactionsContext);
  const transactionsThisMonth = recentTransactions.filter(x => x.date > startOfTheMonth.getTime());

  const groupedTransactions = groupTransactionsByCategory(transactionsThisMonth);

  let [expenseGroupsArr, totalAmount] = getExpenseGroupsArr(groupedTransactions);

  const arrayLength = expenseGroupsArr.length;
  const colorScale = d3.interpolateWarm;
  const colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }; 

  const colors = interpolateColors(arrayLength, colorScale, colorRangeInfo);

  const userGeneratedCategories = useContext(DataContext).docs.find(x => x.id === "categories")?.data() ?? {};

  let data = expenseGroupsArr.map(expGroup => {
    let category = DEFAULT_CATEGORIES[expGroup.categoryID]?? userGeneratedCategories[expGroup.categoryID]?? null;

    return {
      x: category.name.capitalize(),
      y: expGroup.amount
    }
  })

  const insets = useSafeAreaInsets();

  function handleSeeMore() {
    navigation.navigate("See Transactions", { category: "all", dateRange: "all" })
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
        renderItem={({item}) => <TransactionItem {...item}/>}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom
        }}
        ListHeaderComponent={() => (
          <Box>
            <BackButton/>
            <Text fontWeight="600" fontSize={32}>Detailed analytics</Text>
            <Select 
              mt="3"
              fontSize="16"
              py="3"
              px="4"
              rounded="15"
              placeholder="Graph by..."
              defaultValue="months"
            >
              <Select.Item label="By days" value="days"/>
              <Select.Item label="By weeks" value="weeks"/>
              <Select.Item label="By months" value="months"/>
            </Select>
            <Box mt="4">
              {/* <SwitchSelector
                options={SWITCH_OPTIONS}
                initial={0}
                onPress={value => console.log(`Call onPress with value: ${value}`)}
                buttonColor="white"
                backgroundColor="#F2F1F8"
                selectedColor="#6C4AFA"
                hasPadding
                valuePadding={2}
                borderColor="#F2F1F8"
                textColor="#242D4C"
                height={45}
                fontSize={16}
                textStyle={{
                  fontWeight: '500'
                }}
                selectedTextStyle={{
                  fontWeight: '500'
                }}
              /> */}
            </Box>
            <Box mt="4" rounded={20} borderWidth={1.5} borderColor="#EFEDEF" p="3">
              <Box h="64">
                <Svg viewBox={`0 0 ${Dimensions.get('window').width - 40} 400`}>
                  <VictoryPie 
                    colorScale={colors}
                    data={data}
                    labels={() => null}
                    padding={{
                      right: 40,
                      left: 10,
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
                    text={`$${Math.round(totalAmount)}`}
                    x={(Dimensions.get('window').width - 40)* 0.49}
                    y={200}
                    style={{
                      fontSize: 60
                    }}
                  />
                  <VictoryLabel 
                    textAnchor="middle" 
                    text="Total spending"
                    x={(Dimensions.get('window').width - 40) * 0.49}
                    y={150}
                    style={{
                      fontSize: 25,
                      fontWeight: '600'
                    }}
                  />
                  <VictoryLabel 
                    textAnchor="middle" 
                    text={moment().format("MMMM, YYYY")}
                    x={(Dimensions.get('window').width - 40) * 0.49}
                    y={250}
                    style={{
                      fontSize: 25
                    }}
                  />
                </Svg>
              </Box>
              <Box flexDir="row" flexWrap="wrap" mt="3">
                {
                  expenseGroupsArr.map((expGroup, i) => {
                    let category = DEFAULT_CATEGORIES[expGroup.categoryID]?? userGeneratedCategories[expGroup.categoryID]?? null;
                    return (
                      <Circle borderColor="#E4E3E3" borderWidth={1} py="0.5" px="2" mb="2" mr="2" key={category.id}>
                        <HStack space={1} alignItems="center">
                          <Circle w="3" h="3" bg={colors[i]}/>
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