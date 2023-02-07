import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { HStack, Text } from "native-base";
import { TouchableOpacity } from "react-native";

export default function SettingsButton({text, onPress, textStyle, iconStyle}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <HStack h="12" my="1" justifyContent="space-between" alignItems="center">
        <Text fontSize={17} fontWeight="600" {...textStyle}>{text}</Text>
        <FontAwesomeIcon icon="fa-solid fa-chevron-right" {...iconStyle}/>
      </HStack>
    </TouchableOpacity>
  )
}