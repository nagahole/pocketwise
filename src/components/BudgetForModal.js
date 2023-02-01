import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect } from 'react'
import { AspectRatio, Box, Center, Checkbox, FlatList, HStack, Text } from 'native-base';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { EXPENSE_CATEGORIES } from '../screens/AddBudgetScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function BudgetForModal({visible, closeModal, modalHeight = 400}) {

  const insets = useSafeAreaInsets();

  const backgroundOpacity = useSharedValue(0);
  const yOffset = useSharedValue(modalHeight);

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
        <FlatList
          showsVerticalScrollIndicator={false}
          data={EXPENSE_CATEGORIES}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 30,
            paddingBottom: insets.bottom + 20
          }}
          renderItem={({item}) => (
            <HStack 
              alignItems="center" 
              key={item.label} 
              w="100%" 
              borderColor="#E9E9EA" 
              borderWidth={2} 
              p="1.5" 
              rounded={15} 
              mb="2.5"
              justifyContent="space-between"
            >
              <HStack alignItems="center" space={3}>
                <Center h="12" w="12" bg="#E2FFE8" rounded={12}>
                  <FontAwesomeIcon icon={item.iconName} color="#53D062" size={20}/>
                </Center>
                <Text fontWeight="600" fontSize={15}>{item.label}</Text>
              </HStack>
              <Checkbox mr="3" rounded={100} size="md" aria-label={item.label}/>
            </HStack>
          )}
        />
      </Animated.View>
    </Modal>
  )
}