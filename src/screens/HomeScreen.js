import React, { useContext, useEffect, useState } from 'react'
import { AspectRatio, Box, Button, Circle, FlatList, HStack, ScrollView, Text, VStack } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BudgetItemWidget from '../components/BudgetItemWidget';
import SwitchSelector from "react-native-switch-selector";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { faker } from '@faker-js/faker';
import TransactionItem from '../components/TransactionItem';
import { Alert, Animated, Dimensions } from 'react-native';
import { DataContext, RecentTransactionsContext, startOfTheMonth, transactionsRef } from '../stacks/MainAppStack';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { RECENT_TRANSACTIONS_TO_SHOW } from '../data/Constants';
import DEFAULT_CATEGORIES from '../data/DefaultCategories';

//#region fake data
export const FAKEBUDGETDETAILSDATA = [
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
  {
    label: faker.commerce.department(),
    iconName: "fa-solid fa-shirt",
    budgetPerMonth: parseFloat(faker.finance.amount(40,250, 0)),
  },
]

//#endregion

export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const nScroll = new Animated.Value(0);

  const recentTransactions = useContext(RecentTransactionsContext);

  const dataCollection = useContext(DataContext);

  const rawOutlaysObject = dataCollection.docs.find(x => x.id === "outlays")?.data()?? {};

  let expenseOutlaysArr = [];

  const userGeneratedCategories = useContext(DataContext).docs.find(x => x.id === "categories")?.data() ?? {};

  for (let key in rawOutlaysObject) {

    const category = DEFAULT_CATEGORIES[key]?? userGeneratedCategories[key];

    if (category.type !== "expenses")
      continue;

    expenseOutlaysArr.push({
      id: key,
      outlay: rawOutlaysObject[key]
    })
  }

  const transactionsThisMonth = useContext(RecentTransactionsContext).filter(t => t.date >= startOfTheMonth.getTime());

  const groupedTransactions = transactionsThisMonth.reduce((acc, t) => {
    (acc[t.categoryID] = acc[t.categoryID] || []).push(t);

    return acc;
  }, {});

  expenseOutlaysArr.sort((a, b) => { 
    //Sorted by budget per month
    return (
      - a.outlay
      + b.outlay
    )
  });

  function handleSeeAllButton() {
    navigation.navigate("All Transactions");
  }

  return (
    <Box 
      w="100%"
      h="100%"
      bg="white"
    >
      {/* This box is for the top half of the screen */}
      <Box flex={1} bg="#6A48FA">
        <Box w="100%" h="100%" style={{
          paddingTop: insets.top
        }}>
          <Box flex={1}>
            { /* Need an extra box because padding messes up flex={1} */}
            <HStack w="100%" h="100%" px="5">
              <Box flex={1} alignItems="center" justifyContent="center">
                <TouchableOpacity onPress={navigation.openDrawer}>
                  <Box w="100%" h="100%" p="2.5">
                    <AspectRatio ratio={1} w="100%">
                      <Circle borderWidth={1} w="110%" h="110%" borderColor="#957FFB">
                        <FontAwesomeIcon icon="fa-solid fa-bars" color="white" size={20}/>
                      </Circle>
                    </AspectRatio>
                  </Box>
                </TouchableOpacity>
              </Box>
              <Box flex={4} alignItems="center" justifyContent="center">
                <Text fontSize={22} ml="1.5" color="white">Dashboard</Text>
              </Box>
              {/* Filler box to keep title centered */}
              <Box flex={1}></Box>
            </HStack>
          </Box>
          <Box flex={3.6}>
            <VStack w="100%" h="100%" px="8" style={{ paddingTop: 25 }}>
              <HStack space={2}>
                <Text color="white" fontSize="40">$ {transactionsThisMonth.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</Text>
                {/* <Box justifyContent="center">
                  <Box bg="#6EB6FF" rounded={100} px="2.5">
                    <Text color="white" fontWeight="600">+8%</Text>
                  </Box>
                </Box> */}
              </HStack>
              <Text color="white" fontSize="16" mt="1">Spent out of a ${Math.round(expenseOutlaysArr.reduce((acc, e) => acc + e.outlay, 0))} budget</Text>
              {/* <Box flex={1} justifyContent="center" mb="1.5">
                <Button
                  bg="#FED9DA"
                  _pressed={{
                    backgroundColor: "#e0bfc0"
                  }}
                  rounded={100}
                  w="50%"
                  h="12"
                  onPress={() => navigation.navigate("Budget")}
                >
                  <HStack alignItems="center" space={1.5}>
                    <FontAwesomeIcon color="#853B8A" icon="fa-solid fa-pencil" style={{ marginTop: 1 }}/>
                    <Text color="#853B8A" fontSize={16} fontWeight="600">Edit budget</Text>
                  </HStack>
                </Button>
              </Box> */}
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* This box is the bottom half of the screen */}
      <Box flex={2.2}>
        <Animated.FlatList
          data={recentTransactions.slice(0, Math.min(recentTransactions.length, RECENT_TRANSACTIONS_TO_SHOW))}
          renderItem={({item}) => <TransactionItem {...item} /> }
          keyExtractor={item => item.id}
          onScroll={Animated.event([{
            nativeEvent: {
              contentOffset: {
                y: nScroll
              }
            }
          }], {useNativeDriver: true})}
          scrollEventThrottle={5}
          contentContainerStyle={{
            paddingHorizontal: 30
          }}
          ListHeaderComponent={(
            <>
              <Box 
                position="absolute" 
                style={{
                  marginHorizontal: -30,
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height
                }}
              >

              { /* Decorative Parallax Objects */}
              <Animated.View
                style={{
                  position: 'absolute',
                  top: -100,
                  width: '35%',
                  height: '30%',
                  backgroundColor: '#bfbfff66',
                  transform: [{translateY: Animated.multiply(nScroll, 0.8)}],
                  borderBottomRightRadius: 40
                }}
              />
              <Animated.View
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 100,
                  width: '40%',
                  height: '40%',
                  backgroundColor: '#bfd5ff66',
                  transform: [{translateY: Animated.multiply(nScroll, 0.7)}],
                  borderTopLeftRadius: 35,
                  borderBottomLeftRadius: 35
                }}
              />
              <Animated.View
                style={{
                  borderRadius: 70,
                  position: 'absolute',
                  left: -Dimensions.get('window').width * 0.15,
                  top: 450,
                  width: '70%',
                  height: '25%',
                  backgroundColor: '#e0bfff66',
                  transform: [{translateY: Animated.multiply(nScroll, 0.65)}]
                }}
              />

              { /* Decorative Parallax Objects */}
              </Box>
              <Box mt="2">
                <Text fontSize={24} mt="4" mb="5" fontWeight="500">Budget details</Text>
                <Box>
                  <FlatList
                    horizontal={true}
                    contentContainerStyle={{
                      paddingBottom: 14
                    }}
                    showsHorizontalScrollIndicator={false}
                    overflow="visible"
                    data={expenseOutlaysArr}
                    renderItem={({item, index}) => (
                      <BudgetItemWidget 
                        index={index} 
                        {...item} 
                        totalAmount={groupedTransactions[item.id]?.reduce((acc, t) => acc + t.amount, 0)?? 0}
                      /> 
                    )}
                  />
                </Box>
              </Box>
              <HStack alignItems="center" justifyContent="space-between" mt="3" mb="2.5">
                <Text fontSize={21} fontWeight="500">Recent transactions</Text>
                <TouchableOpacity onPress={handleSeeAllButton}>
                  <HStack alignItems="center" mt="1">
                    <Text fontSize={14}>See all</Text>
                    <FontAwesomeIcon icon="fa-solid fa-chevron-right" size={14}/>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </>
          )}
        />
          
      </Box>
    </Box>
  )
}