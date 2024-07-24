import { useNavigation } from '@react-navigation/native'
import { Text, TouchableOpacity } from 'react-native'
import { Icon } from './svg-icon'

const ButtonBack = () => {
    const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
      style={{
        marginLeft: 5,
        flexDirection: "row",
      }}
    >
      <Icon name="backCourse"></Icon>
      <Text> Quay lại</Text>
    </TouchableOpacity>
  );
}

export default ButtonBack