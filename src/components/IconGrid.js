import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { transparentize } from "color2k";
import { Box, Center, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";

export default function IconGrid({
  icons, itemsPerRow = 4, size = 60, iconSize = 20, color, selectedIcon, setSelectedIcon
}) {

  const rows = [];

  for (let i = 0; i < Math.ceil(icons.length / itemsPerRow) * itemsPerRow; i++) {
    if (i % itemsPerRow == 0) {
      rows.push([icons[i]]);
      continue;
    } 
    
    rows[Math.floor(i / itemsPerRow)].push(icons[i]?? null);
  }

  return (
    <VStack space={4}>
      {
        rows.map((row, i) => (
          <HStack justifyContent="space-between" key={i}>
            {
              row.map((icon, j) => (
                <TouchableOpacity onPress={() => setSelectedIcon(icon)} disabled={icon == null} key={`${i} ${j}`}>
                  <Center 
                    bg={
                      icon == null
                      ? "transparent" 
                      : selectedIcon === icon
                      ? color 
                      : transparentize(color, 0.85)
                    } 
                    rounded={size * 0.3} 
                    style={{
                      height: size,
                      width: size
                    }}
                  >
                    { icon && <FontAwesomeIcon icon={icon} size={iconSize} color={selectedIcon === icon? "white" : color}/> }
                  </Center>
                </TouchableOpacity>
              ))
            }
          </HStack>
        ))
      }
    </VStack>
  )
}