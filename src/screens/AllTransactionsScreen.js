import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, FlatList, HStack, Text } from "native-base";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import BackButton from "../components/BackButton";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { ITEMS_LOADED_AT_A_TIME } from "../data/Constants";
import TransactionItem from "../components/TransactionItem";
import { RecentTransactionsContext } from "../stacks/MainAppStack";

export default function AllTransactionsScreen({navigation}) {

  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    retrieveData();
  }, []);

  function retrieveData() {
    setLoading(true);

    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('transactions')
      .orderBy('date', 'desc')
      .limit(ITEMS_LOADED_AT_A_TIME)
      .get()
      .then(querySnapshot => {
        let documents = querySnapshot.docs.map(document => document.data());

        setData(documents);
        setLastVisible(querySnapshot.docs.at(-1));
        setLoading(false);
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));

  }

  function retrieveMore() {
    setRefreshing(true);

    // Cloud Firestore: Query (Additional Query)

    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('transactions')
      .orderBy('date', 'desc')
      .startAfter(lastVisible)
      .limit(ITEMS_LOADED_AT_A_TIME)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length === 0)
          return;

        console.log("QUERY SNAPSHOT:", querySnapshot);
        let documents = querySnapshot.docs.map(document => document.data());

        setData(prev => [...prev, ...documents]);
        setLastVisible(querySnapshot.docs.at(-1));
        setRefreshing(false)
      })
      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage ?? error.message));
  }

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      safeArea
    >
      <Box px="4">
        <BackButton navigation={navigation}/>
      </Box>
      <FlatList
        data={data}
        renderItem={({item}) => <TransactionItem {...item}/>}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 25 }}
        ListFooterComponent={loading && <ActivityIndicator/>}
        onEndReached={retrieveMore}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        ListHeaderComponent={(
          <Box mb="4">
            <HStack justifyContent="space-between">
              <Text fontWeight="600" fontSize={32}>Transactions</Text>
              <TouchableOpacity>
                <Center borderWidth={1.5} borderColor="#EFEEEE" w="12" h="12" rounded={15}>
                  <FontAwesomeIcon icon="fa-solid fa-calendar-days" color="#7C7B7A" size={18}/>
                </Center>
              </TouchableOpacity>
            </HStack>
          </Box>
        )}
      />
    </Box>
  )
}