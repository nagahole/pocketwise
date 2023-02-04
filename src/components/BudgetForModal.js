import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AspectRatio, Box, Center, Checkbox, FlatList, HStack, Text } from 'native-base';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DEFAULT_CATEGORIES from '../data/DefaultCategories';
import { transparentize } from 'color2k';
import { DataContext } from '../stacks/MainAppStack';
import { FlashList } from "@shopify/flash-list";

export default function BudgetForModal({visible, closeModal, modalHeight = 400, selectCategory}) {

  const insets = useSafeAreaInsets();

  const backgroundOpacity = useSharedValue(0);
  const yOffset = useSharedValue(modalHeight);

  const userGeneratedCategories = useContext(DataContext).docs.find(x => x.id === "categories")?.data()?? {};
  const outlays = useContext(DataContext).docs.find(x => x.id === "outlays")?.data()?? {};

  const allUnaddedExpenseCategories = 
    Object.values(DEFAULT_CATEGORIES).filter(x => x.type === "expenses")
      .concat(Object.values(userGeneratedCategories).filter(x => x.type === "expenses"))
      .filter(c => !outlays.hasOwnProperty(c.id));

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(backgroundOpacity.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: withTiming(yOffset.value, {
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      }]
    };
  });

  useEffect(() => {
    if (visible)
      playOpenAnimation();
  }, [visible])

  function playOpenAnimation() {
    backgroundOpacity.value = 0.3;
    yOffset.value = 0;
  }

  function playExitAnimation() {
    backgroundOpacity.value = 0;
    yOffset.value = modalHeight;
    setTimeout(() => closeModal(), 500);
  }

  function handleItemPressed(item) {
    selectCategory(item);
    playExitAnimation();
  }

  return (
    <Modal
      visible={visible}
      transparent
    >
      <TouchableWithoutFeedback onPress={playExitAnimation}>
        <Animated.View style={[{
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          position: 'absolute'
        }, opacityStyle]}></Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View 
        style={[{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
          borderRadius: 20,
          height: modalHeight
        }, modalStyle]}
      >
        <FlashList
          showsVerticalScrollIndicator={false}
          data={allUnaddedExpenseCategories}
          estimatedItemSize={50}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 30,
            paddingBottom: insets.bottom + 20
          }}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleItemPressed(item)}>
              <HStack 
                alignItems="center" 
                key={item.label} 
                w="100%" 
                borderColor="#E9E9EA" 
                borderWidth={2} 
                py="2" 
                px="2.5"
                rounded={15} 
                mb="2.5"
                space={3}
              >
                <Center h="12" w="12" bg={transparentize(item.color, 0.85)} rounded={12}>
                  <FontAwesomeIcon icon={item.icon} color={item.color} size={20}/>
                </Center>
                <Text fontWeight="600" fontSize={15}>{item.name.capitalize()}</Text>
              </HStack>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </Modal>
  )
}