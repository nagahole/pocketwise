import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Box, Center, Circle, HStack, Text } from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MyTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-around"
      style={{ 
        height: insets.bottom + 65,
        paddingBottom: insets.bottom + 8,
        paddingTop: 8,
        backgroundColor: 'white',
        shadowColor: "black",
        shadowRadius: 10,
        shadowOpacity: 0.05,

        //Hack to get shadow to be more even
        width: Dimensions.get('window').width * 2,
        left: -Dimensions.get('window').width * 0.5,
        paddingHorizontal: Dimensions.get('window').width / 2
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name === 'Add Transaction Button'? 'Add Transaction' : route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName;

        if (route.name === 'Home Drawer') {
          iconName = 'home-outline';
        } else if (route.name === 'Stats') {
          iconName = 'analytics-outline';
        } else if (route.name === 'Budget') {
          iconName = 'wallet-outline'
        } else if (route.name === 'Settings') {
          iconName = 'settings-outline'
        } else if (route.name === 'Add Transaction') {
          iconName = 'add-circle'
        }

        if (route.name === 'Add Transaction Button') {
          return (
            <TouchableOpacity
              key={label}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1.15, justifyContent: 'center', alignItems: 'center' }}
            >
              <Circle 
                justifyContent='center' 
                alignItems="center" 
                bg="#333333"
                mt="-7"
                style={{
                  width: 65,
                  height: 65
                }}
              >
                <FontAwesomeIcon icon="fa-solid fa-plus" size={20} color="white"/>
              </Circle>
            </TouchableOpacity>
          )
        }

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name={iconName} size={32} color={isFocused? "#6A48FA" : "#7775A6"} />
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
}