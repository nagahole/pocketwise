import { useRoute } from "@react-navigation/native";
import { Text } from "native-base";
import { useContext, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { DataContext, RecentTransactionsContext } from "../stacks/MainAppStack";

export default function SplashScreen({navigation}) {

  const data = useContext(DataContext);
  const recentTransactions = useContext(RecentTransactionsContext);

  const navigatedOut = useRef(false);

  useEffect(() => {
    if (data != undefined && recentTransactions != undefined && !navigatedOut.current) {
      navigatedOut.current = true;
      setTimeout(() => navigation.navigate("Main Tab"), 200);
    }
  }, [data, recentTransactions])
  

  return (
    <Animated.View
      style={[{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: "white",
        paddingBottom: 60,
        justifyContent: "center",
        alignItems: "center"
      }]}
    >
      <Text fontSize="40" fontWeight="600">Easy Budgets</Text>
    </Animated.View>
  )
}