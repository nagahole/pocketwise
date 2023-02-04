import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Center, HStack, Text, VStack } from "native-base";
import { transparentize } from "color2k";
import { useRef } from "react";
import useCategory from "../hooks/useCategory";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { Alert, Animated, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function TransactionItem({ 
  id, reference, categoryID, amount, type, iconSize=22, swipeable = true, date,
  onItemDelete = () => {}, onItemEdit = () => {}
}) {

  const category = useCategory(categoryID);

  const swipeableRow = useRef(null);

  const navigation = useNavigation();

  const component = (
    <Box
      key={id}
      bg="white"
      borderRadius="20"
      p="2.5"
      mx="-2"
      mb="3"
      style={{
        shadowRadius: 20,
        shadowOpacity: 0.08,
        shadowOffset: { width: -10, height: 10 },
        height: 70
      }}
    >
      <HStack space={3.5}>
        <AspectRatio ratio={1} h="100%">
          <Center bg={transparentize(category.color, 0.85)} rounded={10}>
            <FontAwesomeIcon color={category.color} icon={category.icon} size={iconSize}/>
          </Center>
        </AspectRatio>
        <VStack flex={3} justifyContent="space-between" py="1" mt="-0.5">
          <Text fontWeight="600" fontSize="16">{reference}</Text>
          <Text fontWeight="500" fontSize="12">{category.name.capitalize()}</Text>
        </VStack>
        <Box justifyContent="center">
          <Text 
            color={
              amount === 0
              ? "#bab9bc" 
              : type === "expenses"
              ? "#e44749"
              : type === "incomes"
              ? "#85c462"
              : "black"
            }
            textAlign="right"
            fontWeight="bold"
            mr="1.5"
          >
            {
              amount == 0
              ? amount.toFixed(2)
              : type === "expenses"
              ? `-$${amount.toFixed(2)}`
              : type === "incomes"
              ? `+$${amount.toFixed(2)}`
              : `$${amount.toFixed(2)}`
            }
          </Text>
        </Box>
      </HStack>
    </Box>
  )

  function renderRightAction(icon, color, x, progress, onPress = () => {})  {

    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
      extrapolate: "clamp"
    });

    const pressHandler = () => {
      onPress()
      close();
    };

    return (
      <Animated.View 
        style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction]}
          onPress={pressHandler}
        >
          <FontAwesomeIcon icon={icon} color={color} size={20}/>
        </RectButton>
      </Animated.View>
    );
  };

  function renderRightActions(progress) {
    return (
      <Box style={{ width: 192, paddingBottom: 12, paddingLeft: 8 }}>
        <Box 
          flexDir="row" 
          flex={1}
          overflow="hidden"
          rounded={20}
        >
          {renderRightAction('fa-solid fa-pencil', 'black', 192, progress, () => {
            navigation.navigate(
              "Edit Transaction", 
              {
                transactionInfo: {
                  reference,
                  id,
                  categoryID,
                  amount,
                  type,
                  date
                  //etc add more as transactions get more complicated
                },
                onFinishEditing(transactionObj) {
                  onItemEdit(transactionObj);
                }
              }
            );
          })}
          {renderRightAction('fa-solid fa-trash', 'black', 96, progress, () => {
            Alert.alert(
              "Delete this transaction?",
              "This cannot be undone. Continue?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress() {
                    firestore()
                      .collection("users")
                      .doc(auth().currentUser.uid)
                      .collection("transactions")
                      .doc(id)
                      .delete()
                      .then(() => onItemDelete())
                      .catch(error => Alert.alert(error.nativeErrorCode, error.nativeErrorMessage?? error.message));
                  }
                }
              ]
            )
          })}
        </Box>
      </Box>
    ) 
  }

  function updateRef(ref) {
    swipeableRow.current = ref;
  };

  function close() {
    swipeableRow.current.close();
  };

  if (swipeable) {
    return (
      <Swipeable 
        ref={updateRef}
        friction={2}
        leftThreshold={30}
        renderRightActions={renderRightActions}
        containerStyle={{ overflow: "visible" }}
      >
        {component}
      </Swipeable>
    )
  }

  return component;
}

const styles = StyleSheet.create({
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});