import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MainAppTabScreen from "./MainAppTabs";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddBudgetScreen from "../screens/AddBudgetScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import DetailedAnalyticsScreen from "../screens/DetailedAnalyticsScreen";
import auth from '@react-native-firebase/auth';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from "../firebase";
import { createContext } from "react";
import { RECENT_TRANSACTIONS_TO_SHOW } from "../data/Constants";

const Stack = createNativeStackNavigator();

export const RecentTransactionsContext = createContext([]);
export const DataContext = createContext({});

export const startOfTheMonth = new Date();
startOfTheMonth.setDate(0);

export default function MainAppStack() {

  transactionsRef = db
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('transactions');

  const transactionsQuery = transactionsRef.where("date", ">=", startOfTheMonth.getTime()).orderBy('date', 'desc');
  const [transactions] = useCollectionData(transactionsQuery, {idField: 'id'});

  const transactionsBeforeStartOfTheMonthQuery = 
    transactionsRef
      .where("date", "<", startOfTheMonth)
      .orderBy('date', "desc")
      .limit(RECENT_TRANSACTIONS_TO_SHOW);
    
  const [transactionsBeforeStartOfTheMonth] = useCollectionData(transactionsBeforeStartOfTheMonthQuery, {idField: "id"});


  const dataQuery = db.collection('users').doc(auth().currentUser.uid).collection('data');
  const [dataCollection] = useCollection(dataQuery, {idField: 'id'});


  if (transactions == undefined 
    || transactionsBeforeStartOfTheMonth == undefined 
    || dataCollection == undefined)
    return null;

  return (
    <DataContext.Provider value={dataCollection}>
    <RecentTransactionsContext.Provider value={transactions}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main Tab" component={MainAppTabScreen}/> 
        <Stack.Screen name="Add Transaction" component={AddTransactionScreen}/>
        <Stack.Screen name="Add Budget" component={AddBudgetScreen}/> 
        <Stack.Screen name="Create Category" component={CreateCategoryScreen}/>
        <Stack.Screen name="Detailed Analytics" component={DetailedAnalyticsScreen}/> 
      </Stack.Navigator>
    </RecentTransactionsContext.Provider>
    </DataContext.Provider>
  )
}