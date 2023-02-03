import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Box, Center, HStack, Text, VStack } from "native-base";
import ExpenseCategoryGridItem from "./ExpenseCategoryGridItem";

// OBSELETE
export default function ExpenseCategoryGrid({
  items, itemsPerRow = 4, size = 60, iconSize = 20, setCategory, selectedCategory
}) {

  return (
    <Box flexDir="row" flexWrap="wrap" justifyContent="space-between">
      {
        items.map((item, i) => (
          <Box style={{marginRight: 10, marginBottom: 10}}>
            <ExpenseCategoryGridItem 
              key={i}
              iconName={item.iconName} 
              label={item.label} 
              addNew={item.addNew}
              size={size}
              iconSize={iconSize}
              selected={selectedCategory === item.value}
              onPress={() => {
                if (item.onPress != undefined && item.onPress != null) {
                  item.onPress();
                } else {
                  setCategory(item.value);
                }
              }}
            />
          </Box>
        ))
      }
    </Box>
  )
}