import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MainAppTabScreen from "./MainAppTabs";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddBudgetScreen from "../screens/AddBudgetScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import DetailedAnalyticsScreen from "../screens/DetailedAnalyticsScreen";
import EditBudgetScreen from "../screens/EditBudgetScreen";
import auth from '@react-native-firebase/auth';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from "../firebase";
import { createContext, useEffect, useRef, useState } from "react";
import { RECENT_TRANSACTIONS_TO_SHOW, SPLASH_SCREEN_DURATION } from "../data/Constants";
import SeeTransactionsScreen from "../screens/SeeTransactionsScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";
import SplashScreen from "../screens/SplashScreen";
import moment from "moment";

const Stack = createNativeStackNavigator();

export const RecentTransactionsContext = createContext([]);
export const DataContext = createContext({});

export const startOfTheMonth = moment().startOf("month").toDate();

export const weekBeforeStartOfTheMonth = moment(startOfTheMonth).startOf("isoWeek").toDate();

// Maybe use useCollection instead of useCollectionData so I can use startAt and startAfter?
export default function MainAppStack() {

  const [recentTransactions, setRecentTransactions] = useState(-1);

  transactionsRef = db
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('transactions');

  const transactionsThisMonthQuery = transactionsRef.where("date", ">=", weekBeforeStartOfTheMonth.getTime()).orderBy('date', 'desc');
  const [transactionsThisMonthPlusWeek] = useCollectionData(transactionsThisMonthQuery, {idField: 'id'});

  const transactionsBeforeStartOfTheMonthPlusWeekQuery = 
    transactionsRef
      .where("date", "<", weekBeforeStartOfTheMonth.getTime())
      .orderBy('date', "desc")
      .limit(RECENT_TRANSACTIONS_TO_SHOW);
    
  const [transactionsBeforeStartOfTheMonthPlusWeek] = useCollectionData(transactionsBeforeStartOfTheMonthPlusWeekQuery, {idField: "id"});

  const dataQuery = db.collection('users').doc(auth().currentUser.uid).collection('data');
  const [dataCollection] = useCollection(dataQuery, {idField: 'id'});

  useEffect(() => {

    if (transactionsThisMonthPlusWeek == undefined || transactionsBeforeStartOfTheMonthPlusWeek == undefined)
      return 

    setRecentTransactions(transactionsThisMonthPlusWeek.concat(transactionsBeforeStartOfTheMonthPlusWeek));
  }, [transactionsThisMonthPlusWeek, transactionsBeforeStartOfTheMonthPlusWeek])

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