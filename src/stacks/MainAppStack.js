import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MainAppTabScreen from "./MainAppTabs";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddBudgetScreen from "../screens/AddBudgetScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import DetailedAnalyticsScreen from "../screens/DetailedAnalyticsScreen";
import firebase from "firebase/compat/app";
import auth from '@react-native-firebase/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from "../firebase";
import { createContext } from "react";


const Stack = createNativeStackNavigator();

export const ThisMonthsTransactionsContext = createContext([]);
export const CategoriesContext = createContext([]);

let startOfTheMonth = new Date();
startOfTheMonth.setDate(0);
startOfTheMonth = startOfTheMonth.getTime();

export const transactionsRef = db
  .collection('users')
  .doc(auth().currentUser.uid)
  .collection('transactions');

export default function MainAppStack() {

  const categoriesRef = db
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('categories');

  const transactionsQuery = transactionsRef.where("date", ">=", startOfTheMonth).orderBy('date', 'desc');
  const [transactions] = useCollectionData(transactionsQuery, {idField: 'id'});

  const categoriesQuery = categoriesRef;//.orderBy("name", "asc");
  const [categories] = useCollectionData(categoriesQuery, {idField: "id"});

  if (transactions == undefined || categories == undefined)
    return null;

  console.log(categories[0].id);

  return (
    <CategoriesContext.Provider value={categories}>
    <ThisMonthsTransactionsContext.Provider value={transactions}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main Tab" component={MainAppTabScreen}/> 
        <Stack.Screen name="Add Transaction" component={AddTransactionScreen}/>
        <Stack.Screen name="Add Budget" component={AddBudgetScreen}/> 
        <Stack.Screen name="Create Category" component={CreateCategoryScreen}/>
        <Stack.Screen name="Detailed Analytics" component={DetailedAnalyticsScreen}/> 
      </Stack.Navigator>
    </ThisMonthsTransactionsContext.Provider>
    </CategoriesContext.Provider>
  )
}