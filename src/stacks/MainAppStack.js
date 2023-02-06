import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MainAppTabScreen from "./MainAppTabs";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddBudgetScreen from "../screens/AddBudgetScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import DetailedAnalyticsScreen from "../screens/DetailedAnalyticsScreen";
import EditBudgetScreen from "../screens/EditBudgetScreen";
import auth from '@react-native-firebase/auth';
import { createContext, useEffect, useRef, useState } from "react";
import { RECENT_TRANSACTIONS_TO_SHOW, SPLASH_SCREEN_DURATION } from "../data/Constants";
import SeeTransactionsScreen from "../screens/SeeTransactionsScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";
import SplashScreen from "../screens/SplashScreen";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";

const Stack = createNativeStackNavigator();

export const RecentTransactionsContext = createContext([]);
export const DataContext = createContext({});

export const startOfTheMonth = moment().startOf("month").toDate();

export const weekBeforeStartOfTheMonth = moment(startOfTheMonth).startOf("isoWeek").toDate();

// Maybe use useCollection instead of useCollectionData so I can use startAt and startAfter?
export default function MainAppStack() {

  const [recentTransactions, setRecentTransactions] = useState();
  const [transactionsThisMonthPlusWeek, setTransactionsThisMonthPlusWeek] = useState();
  const [transactionsBeforeStartOfMonth, setTransactionsBeforeStartOfmonth] = useState();
  const [dataCollection, setDataCollection] = useState();

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("date", ">=", weekBeforeStartOfTheMonth.getTime())
      .orderBy("date", "desc")
      .onSnapshot(querySnapshot => {
        setTransactionsThisMonthPlusWeek(querySnapshot.docs.map(documentSnapshot => documentSnapshot.data()));
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("transactions")
      .where("date", "<", weekBeforeStartOfTheMonth.getTime())
      .orderBy("date", "desc")
      .limit(RECENT_TRANSACTIONS_TO_SHOW)
      .onSnapshot(querySnapshot => {
        setTransactionsBeforeStartOfmonth(querySnapshot.docs.map(documentSnapshot => documentSnapshot.data()));
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("data")
      .onSnapshot(querySnapshot => {
        setDataCollection(querySnapshot);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {

    if (transactionsThisMonthPlusWeek == undefined || transactionsBeforeStartOfMonth == undefined)
      return 

    setRecentTransactions(transactionsThisMonthPlusWeek.concat(transactionsBeforeStartOfMonth));
  }, [transactionsThisMonthPlusWeek, transactionsBeforeStartOfMonth])

  return (
    <DataContext.Provider value={dataCollection}>
    <RecentTransactionsContext.Provider value={recentTransactions}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen}/>
        <Stack.Screen name="Main Tab" component={MainAppTabScreen}/> 
        <Stack.Screen name="Add Transaction" component={AddTransactionScreen}/>
        <Stack.Screen name="Add Budget" component={AddBudgetScreen}/> 
        <Stack.Screen name="Create Category" component={CreateCategoryScreen}/>
        <Stack.Screen name="Detailed Analytics" component={DetailedAnalyticsScreen}/> 
        <Stack.Screen name="See Transactions" component={SeeTransactionsScreen}/>
        <Stack.Screen name="Edit Budget" component={EditBudgetScreen}/>
        <Stack.Screen name="Edit Transaction" component={EditTransactionScreen}/>
      </Stack.Navigator>
    </RecentTransactionsContext.Provider>
    </DataContext.Provider>
  )
}