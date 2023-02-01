import React, { useEffect } from 'react'
import { AspectRatio, Box, Button, Circle, FlatList, HStack, ScrollView, Text, VStack } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BudgetItemWidget from '../components/BudgetItemWidget';
import SwitchSelector from "react-native-switch-selector";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { faker } from '@faker-js/faker';
import TransactionItem from '../components/TransactionItem';
import { Animated, Dimensions } from 'react-native';

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

export const FAKERECENTTRANSACTIONSDATA = [
  {
    title: faker.commerce.product(),
    category: faker.commerce.department(),
    transaction: parseFloat(faker.finance.amount(-20,0, 0))
  },
  {
    title: faker.commerce.product(),
    category: faker.commerce.department(),
    transaction: parseFloat(faker.finance.amount(-20,0, 0))
  },
  {
    title: faker.commerce.product(),
    category: faker.commerce.department(),
    transaction: parseFloat(faker.finance.amount(-20,0, 0))
  },
  {
    title: faker.commerce.product(),
    category: faker.commerce.department(),
    transaction: parseFloat(faker.finance.amount(-20,0, 0))
  }
]

const options = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" }
];

export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();

  const nScroll = new Animated.Value(0);

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
            <VStack w="100%" h="100%" px="8" pt="2">
              <HStack space={2}>
                <Text color="white" fontSize="36">$ 460.50</Text>
                {/* <Box justifyContent="center">
                  <Box bg="#6EB6FF" rounded={100} px="2.5">
                    <Text color="white" fontWeight="600">+8%</Text>
                  </Box>
                </Box> */}
              </HStack>
              <Text color="white" fontSize="16" mt="1">Spent out of a $1,000 budget</Text>
              <Box flex={1} justifyContent="center" mb="1.5">
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
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* This box is the bottom half of the screen */}
      <Box flex={1.5}>
        <Animated.FlatList
          data={FAKERECENTTRANSACTIONSDATA}
          onScroll={Animated.event([{
            nativeEvent: {
              contentOffset: {
                y: nScroll
              }
            }
          }], {useNativeDriver: true})}
          scrollEventThrottle={5}
          keyExtractor={item => item.transaction}
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
                  backgroundColor: '#bfbfff',
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
                  backgroundColor: '#bfd5ff',
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
                  backgroundColor: '#e0bfff',
                  transform: [{translateY: Animated.multiply(nScroll, 0.65)}]
                }}
              />

              { /* Decorative Parallax Objects */}
              </Box>
              <Box justifyContent="center" alignItems="center" pt="5" mt="2">
                <SwitchSelector
                  options={options}
                  initial={0}
                  onPress={value => console.log(`Call onPress with value: ${value}`)}
                  buttonColor="white"
                  backgroundColor="#F2F1F8"
                  selectedColor="#6C4AFA"
                  hasPadding
                  valuePadding={5}
                  borderColor="#F2F1F8"
                  textColor="#242D4C"
                  height={55}
                  fontSize={16}
                  textStyle={{
                    fontWeight: '500'
                  }}
                  selectedTextStyle={{
                    fontWeight: '500'
                  }}
                />
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
                    data={FAKEBUDGETDETAILSDATA}
                    renderItem={({item, index}) => <BudgetItemWidget index={index} {...item}/> }
                  />
                </Box>
              </Box>
              <HStack alignItems="center" justifyContent="space-between" mt="3" mb="2.5">
                <Text fontSize={21} fontWeight="500">Recent transactions</Text>
                <TouchableOpacity>
                  <HStack alignItems="center" mt="1">
                    <Text fontSize={14}>See all</Text>
                    <FontAwesomeIcon icon="fa-solid fa-chevron-right" size={14}/>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </>
          )}
          renderItem={({item}) => <TransactionItem {...item} />}
        />
          
      </Box>
    </Box>
  )
}