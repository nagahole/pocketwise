import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MainAppTabScreen from "./MainAppTabs";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddBudgetScreen from "../screens/AddBudgetScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import DetailedAnalyticsScreen from "../screens/DetailedAnalyticsScreen";

const Stack = createNativeStackNavigator();

export default function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main Tab" component={MainAppTabScreen}/> 
      <Stack.Screen name="Add Transaction" component={AddTransactionScreen}/>
      <Stack.Screen name="Add Budget" component={AddBudgetScreen}/> 
      <Stack.Screen name="Create Category" component={CreateCategoryScreen}/>
      <Stack.Screen name="Detailed Analytics" component={DetailedAnalyticsScreen}/> 
    </Stack.Navigator>
  )
}