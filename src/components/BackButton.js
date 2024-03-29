import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useNavigation } from '@react-navigation/native'
import { AspectRatio, Box, Center } from 'native-base'
import { TouchableOpacity } from 'react-native';

export default function BackButton() {

  const navigation = useNavigation();

  return (
    <Box 
      style={{
        height: 73
      }}
      py="2.5"
    >
      <TouchableOpacity onPress={navigation.goBack}>
        <AspectRatio ratio={1} h="100%">
          <Center borderWidth={2} borderColor="#E6E4E5" rounded={15}>
            <FontAwesomeIcon icon="fa-solid fa-arrow-left-long" size={18}/>
          </Center>
        </AspectRatio>
      </TouchableOpacity>
    </Box>
  )
}