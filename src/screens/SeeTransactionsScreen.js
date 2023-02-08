import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, HStack, Text } from "native-base";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, LayoutAnimation, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { ITEMS_LOADED_AT_A_TIME } from "../data/Constants";
import TransactionItem from "../components/TransactionItem";
import { RecentTransactionsContext } from "../stacks/MainAppStack";
import moment from "moment";
import { FlashList } from "@shopify/flash-list";
import useCategory from "../hooks/useCategory";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SeeTransactionsScreen({navigation, route}) {

  const [transactions, setTransactions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bottomReached, setBottomReached] = useState(false);

  const recentTransactions = useContext(RecentTransactionsContext);

  const [groupedData, setGroupedData] = useState([]);

  const category = useCategory(route.params.category);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    retrieveData();
  }, []);

  useEffect(() => {
    let groupedObj = transactions
      .filter(t => (
          route.params.category === "all"? true : t.categoryID === route.params.category 
        ) && (
          route.params.dateRange === "all"? true : (t.date > route.params.dateRange.min && t.date < route.params.dateRange.max)
        )
      ).reduce((acc, t) => {

      let date = new Date(t.date);

      date.setHours(0, 0, 0, 0);

      (acc[date.getTime()] = acc[date.getTime()] || []).push(t);

      return acc;

    }, {});

    let groupedArr = Object.keys(groupedObj).map(key => [parseInt(key), groupedObj[key]]);

    //Group by descending date
    groupedArr.sort((a,b) => - a[0] + b[0]);

    setGroupedData(groupedArr);

  }, [transactions])

  function retrieveData() {

    setTransactions(recentTransactions);
    setLastVisible(recentTransactions.at(-1)?? { date: -1 });

  }

  function retrieveMore() {
    if(bottomReached)
      return;
    setRefreshing(true);

    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('transactions')
      .orderBy('date', 'desc')
      .startAfter(lastVisible.date)
      .limit(ITEMS_LOADED_AT_A_TIME)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length === 0) {
          setBottomReached(true);
          return;
        }
          
        let documents = querySnapshot.docs.map(document => document.data());

        setTransactions(prev => [...prev, ...documents]);
        setLastVisible(documents.at(-1));
        setRefreshing(false)
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage ?? error.message));
  }

  function handleItemDelete(item) {
    setTransactions(prev => {
      let copy = [...prev];
      let index = copy.indexOf(item);

      if (index !== -1) {
        copy.splice(index, 1);
      }

      return copy;
    });
  }

  function handleItemEdit(item, newTransactionObj) {
    setTransactions(prev => {
      let copy = [...prev];
      let index = copy.indexOf(item);

      if (index !== -1) {
        copy[index] = newTransactionObj;
      }

      return copy;
    });
  }

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      safeAreaTop
    >
      <Box px="4">
        <BackButton/>
      </Box>
      <FlashList
        data={groupedData}
        estimatedItemSize={200}
        renderItem={({item}) => (
          <Box>
            <Text mb="3" mt="2" fontWeight="500">
              {
                moment(item[0]).calendar(null, {
                  lastDay : '[Yesterday]',
                  sameDay : '[Today]',
                  nextDay : '[Tomorrow]',
                  lastWeek : '[Last] dddd',
                  nextWeek : 'dddd',
                  sameElse : 'L'
                })
              }
            </Text>
            {
              item[1].map(nestedItem => (
                <TransactionItem 
                  {...nestedItem}
                  key={nestedItem.id}
                  onItemDelete={() => handleItemDelete(nestedItem)}
                  onItemEdit={transactionObj => handleItemEdit(nestedItem, transactionObj)}
                />
                )
              )  
            }
          </Box>
        )}
        keyExtractor={item => item[0]}
        contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: insets.bottom }}
        ListFooterComponent={(!bottomReached || loading) && <ActivityIndicator style={{ marginTop: 20 }}/>}
        onEndReached={retrieveMore}
        onEndReachedThreshold={2}
        refreshing={refreshing}
        ListHeaderComponent={(
          <Box mb="4">
            <HStack justifyContent="space-between">
              <Text fontWeight="600" fontSize={32}>{route.params.category === "all"? "Transactions" : category.name.capitalize()}</Text>
              {
                route.params.dateRange === "all" && (
                  <>
                    {/* <TouchableOpacity>
                      <Center borderWidth={1.5} borderColor="#EFEEEE" w="12" h="12" rounded={15}>
                        <FontAwesomeIcon icon="fa-solid fa-calendar-days" color="#7C7B7A" size={18}/>
                      </Center>
                    </TouchableOpacity> */}
                  </>
                )
              }
            </HStack>
            {
              route.params.dateRange !== "all" && (
                <Text fontSize="16">
                  {moment(route.params.dateRange.min).format("MMM Do")} - {moment(route.params.dateRange.max).format("MMM Do, YYYY")}
                </Text>
              )
            }
          </Box>
        )}
      />
    </Box>
  )
}