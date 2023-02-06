import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { darken, lighten, transparentize } from "color2k";
import { AspectRatio, Box, Center, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ExpenseCategoryGridItem({
  size = 60, label, iconName, addNew, iconSize=20, onPress, 
  selected = false, marginBottom = 10, color = "#777777",
  onLongPress
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{marginBottom}} onLongPress={onLongPress}>
      <VStack alignItems="center" space={1.5}>
        <Center
          borderWidth={
            addNew
            ? 2.5
            : 0
          }
          borderColor={addNew? "black" : darken(color, 0.1)}
          bg={addNew? "white" : selected? color : transparentize(color, 0.85)}
          rounded={size * 0.3}
          style={{
            width: size,
            height: size
          }}
        >
          <FontAwesomeIcon icon={iconName} color={addNew? "black" : selected? "white" : color} size={iconSize}/>
        </Center>
        <Text fontWeight="500" fontSize="12" textAlign="center" color={addNew? "black" : darken(color, 0.05)}>{label?? "name"}</Text>
      </VStack>
    </TouchableOpacity>
  )
}