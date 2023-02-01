import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AspectRatio, Box, Center, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ExpenseCategoryGridItem({
  size = 60, label, iconName, addNew, iconSize=20, onPress
}) {
  return (
    <TouchableOpacity onPress={onPress?? null}>
      <VStack alignItems="center" space={1.5}>
        <Center
          borderWidth={addNew? 2.5: 0}
          bg={addNew? "white" : "#EFEDEF"}
          rounded={size * 0.3}
          style={{
            width: size,
            height: size
          }}
        >
          <FontAwesomeIcon icon={iconName} color={addNew? "black" : "#ABA9AB"} size={iconSize}/>
        </Center>
        <Text fontWeight="600" fontSize="13">{label?? "name"}</Text>
      </VStack>
    </TouchableOpacity>
  )
}