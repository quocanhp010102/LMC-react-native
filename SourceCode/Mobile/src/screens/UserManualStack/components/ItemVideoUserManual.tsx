import { TouchableOpacity } from "react-native";
import { CardVideo } from "../../../components/CardVideo";
import { calculateTime } from "../../../helpers/utils";
import { Box, Text } from "../../../rebass";
import React from "react";

interface IItemVideoUserManual {
    index : number 
    setState : (data : any) => void
    item : any
    navigation :any
    state : any
    isHomeScreen ?: boolean
}

const ItemVideoUserManual = React.memo((props :IItemVideoUserManual ) => {
const { index, item, navigation , setState ,state , isHomeScreen } = props
var aDay = new Date(item.tutorial_createdDate);
 
  return (
    <Box
      borderRadius={10}
      borderWidth={1}
      borderColor="#00A8B5"
      style={{
        marginTop: 17,
      }}
      width={isHomeScreen ? "45%" :"95%"}
      marginLeft={"2.5%"}
      key={String(index)}
    >
      <TouchableOpacity
        onPress={() => setState({ choose: item.id })}
        delayPressIn={150}
      >
        <CardVideo
          key={String(index)}
          image={item.tutorial_image}
          title={item.tutorial_title}
          link={item.tutorial_video}
          createdDate={item.tutorial_createdDate}
          id={item.id}
          choose={state.choose}
          navigation={navigation}
          isHomeVideo={isHomeScreen}
          setState={setState}
        ></CardVideo>
      </TouchableOpacity>
      <Box ml={2}>
        <Box>
          <Text
            fontSize={14}
            fontWeight="500"
            color="#1C7988"
            lineHeight={17}
            numberOfLines={2}
            mt={15}
          >
            {item.tutorial_title}
          </Text>
          <Text fontSize={11} color="#636363" mt={2}>
            Admin HCMUSSH - LMS
          </Text>
          <Box>
            <Text fontSize={10} color="#636363" mt={1} mb={1}>
                {item.tutorial_view} lượt xem -{" "}
              <Text fontSize={10} color="#636363">
                {calculateTime(aDay)}
              </Text>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default ItemVideoUserManual;
