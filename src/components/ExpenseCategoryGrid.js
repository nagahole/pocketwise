import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, HStack, Text, VStack } from "native-base";
import ExpenseCategoryGridItem from "./ExpenseCategoryGridItem";

export default function ExpenseCategoryGrid({items, itemsPerRow = 4, size = 60, iconSize = 20}) {

  const rows = [];

  for (let i = 0; i < Math.ceil(items.length / itemsPerRow) * itemsPerRow; i++) {
    if (i % itemsPerRow == 0) {
      rows.push([items[i]]);
      continue;
    } 
    
    rows[Math.floor(i / itemsPerRow)].push(items[i]?? null);
  }

  return (
    <VStack space={4}>
      {
        rows.map((row, i) => (
          <HStack justifyContent="space-between" key={i}>
            {
              row.map((item, j) => (
                item == null
                ? <Box style={{width: size, height: size}}/>
                : <ExpenseCategoryGridItem 
                    iconName={item.iconName} 
                    label={item.label} 
                    addNew={item.addNew}
                    onPress={item.onPress}
                  />
              ))
            }
          </HStack>
        ))
      }
    </VStack>
  )
}