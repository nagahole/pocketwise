import React, { useContext, useEffect, useState } from 'react'
import { AspectRatio, Box, Button, Center, Circle, FlatList, HStack, ScrollView, Text, VStack } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BudgetItemWidget from '../components/BudgetItemWidget';
import SwitchSelector from "react-native-switch-selector";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TransactionItem from '../components/TransactionItem';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import { DataContext, RecentTransactionsContext, startOfTheMonth } from '../stacks/MainAppStack';
import { RECENT_TRANSACTIONS_TO_SHOW, SHOW_PARALLAX_OBJECTS } from '../data/Constants';
import DEFAULT_CATEGORIES from '../data/DefaultCategories';
import { lighten } from 'color2k';
import { groupTransactionsByCategory } from '../../utils/NagaUtils';

export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const nScroll = new Animated.Value(0);

  const recentTransactions = useContext(RecentTransactionsContext);

  const dataCollection = useContext(DataContext);

  const rawOutlaysObject = dataCollection?.docs.find(x => x.id === "outlays")?.data()?? {};

  let expenseOutlaysArr = [];

  const userGeneratedCategories = dataCollection?.docs.find(x => x.id === "categories")?.data() ?? {};

  for (let key in rawOutlaysObject) {

    const category = DEFAULT_CATEGORIES[key]?? userGeneratedCategories[key]?? null;

    if (category.type !== "expenses")
      continue;

    expenseOutlaysArr.push({
      id: key,
      outlay: rawOutlaysObject[key]
    })
  }

  const transactionsThisMonth = useContext(RecentTransactionsContext).filter(t => t.date >= startOfTheMonth.getTime());

  const groupedTransactions = groupTransactionsByCategory(transactionsThisMonth);

  expenseOutlaysArr.sort((a, b) => { 
    //Sorted by budget per month
    return (
      - a.outlay
      + b.outlay
    )
  });

  function handleSeeAllButton() {
    navigation.navigate("See Transactions", { category: "all", dateRange: "all" });
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
            <HStack w="100%" h="100%" px="5" alignItems="center">
              <Box flex={1} alignItems="center" justifyContent="center">
                {/* <TouchableOpacity onPress={navigation.openDrawer}>
                  <Box w="100%" h="100%" p="2.5">
                    <AspectRatio ratio={1} w="100%">
                      <Circle borderWidth={1} w="110%" h="110%" borderColor="#957FFB">
                        <FontAwesomeIcon icon="fa-solid fa-bars" color="white" size={20}/>
                      </Circle>
                    </AspectRatio>
                  </Box>
                </TouchableOpacity> */}
              </Box>
              <Box flex={4} alignItems="center" justifyContent="center">
                <Text fontSize={22} color="white">Dashboard</Text>
              </Box>
              {/* Filler box to keep title centered */}
              <Box flex={1}></Box>
            </HStack>
          </Box>
          <Box flex={3.6}>
            <VStack w="100%" h="100%" px="8" style={{ paddingTop: 14 }}>
              <HStack space={2}>
                <Text color="white" fontSize="40">$ {transactionsThisMonth.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</Text>
              </HStack>
              <Text color="white" fontSize="16" mt="1">Spent out of a ${Math.round(expenseOutlaysArr.reduce((acc, e) => acc + e.outlay, 0))} budget</Text>
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
            paddingHorizontal: 27
          }}
          ListHeaderComponent={(
            <>
              <Box 
                position="absolute" 
                style={{
                  marginHorizontal: -27,
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height
                }}
              >
                {
                  SHOW_PARALLAX_OBJECTS && (
                    <>
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
                    </>
                  )
                }
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
                    keyExtractor={item => item.id}
                    renderItem={({item, index}) => (
                      <BudgetItemWidget 
                        first={index === 0}
                        last={index === expenseOutlaysArr.length - 1}
                        {...item} 
                        totalAmount={groupedTransactions[item.id]?.reduce((acc, t) => acc + t.amount, 0)?? 0}
                      /> 
                    )}
                    ListEmptyComponent={(
                      <Box 
                        style={{
                          marginHorizontal: -27,
                          width: Dimensions.get('window').width,
                          height: 200,
                          paddingHorizontal: 50,
                        }}
                      >
                        <Box flex="1" rounded={30} bg={lighten("#6a48fa", 0.05)} p="5" style={{
                          shadowRadius: 25,
                          shadowOpacity: 0.1,
                          shadowOffset: { width: -5, height: 5 },
                        }}>
                          <Text textAlign="center" fontWeight="600" fontSize="24" color="white">New here?</Text>
                          <Text textAlign="center" fontWeight="400" fontSize="16" color="white" mt="2">Start laying out your budget now!</Text>

                          <Box flex={1} justifyContent="center" alignItems="center" mt="9" px="0">
                            <TouchableOpacity onPress={() => navigation.navigate("Budget")}>
                              <Center
                                bg="#FED9DA"
                                rounded={100}
                                w="48"
                                h="12"
                              >
                                <HStack alignItems="center" space={1.5}>
                                  <FontAwesomeIcon color="#853B8A" icon="fa-solid fa-pencil" style={{ marginTop: 1 }}/>
                                  <Text color="#853B8A" fontSize={16} fontWeight="600">Create budget</Text>
                                </HStack>
                              </Center>
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      </Box>
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