import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, HStack, Text, VStack } from "native-base";

export default function IconGrid({icons, itemsPerRow = 4, size = 60, iconSize = 20}) {

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
                <Center key={j} bg={icon == null? "transparent" : "#EFEDEF"} rounded={size * 0.3} style={{
                  height: size,
                  width: size
                }}>
                  { icon && <FontAwesomeIcon icon={icon} color="#ABA9AB" size={iconSize}/> }
                </Center>
              ))
            }
          </HStack>
        ))
      }
    </VStack>
  )
}