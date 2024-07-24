import { LinearGradient } from "expo-linear-gradient";
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView
} from "react-native";



import { FastImage } from "components-base";
import { Box, Flex } from "../../src/rebass";

const HEIGHT = 200;
const Banner = (props: PropsWithChildren<object>) => {
  const screenWidth = Math.round(Dimensions.get("window").width) || 500;
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {

      setActiveIdx(
        Math.floor(e.nativeEvent.contentOffset.x / screenWidth + 0.5)
      );
    },
    [screenWidth]
  );

  return (
    <Box
      position="relative"
      width={screenWidth * 0.94}
      height={HEIGHT}
      justifyContent="center"
      alignItems="center"
      // ml={3}
      borderRadius={8}
    >
      <ScrollView
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
      >
        {props.children}
      </ScrollView>
      <Flex flexDirection="row" p={4} position="absolute" bottom={-10}>
        {(props.children as ReactNode[]).map((_, idx) => (
          <Box overflow="hidden" borderRadius={2} mx="2px" key={idx}>
            <Box
              height={2}
              width={20}
              bg={idx === activeIdx ? "#FFFFFF" : "rgba(99, 99, 99, 0.5)"}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

Banner.Item = (props: PropsWithChildren<{ image: string }>) => {
  const screenWidth = Math.round(Dimensions.get("window").width) || 500;
  return (
    <Box
      width={screenWidth * 0.941}
      height={HEIGHT}
      position="relative"
      bg="red"
      borderRadius={8}
    >
      <Flex
        bg="#C4C4C4"
        overflow="hidden"
        position="relative"
        borderRadius={8}
        justifyContent="center"
        alignItems="center"
      >
        <FastImage
          source={{ uri: props.image }}
          style={{ width: "100%", height: "100%" }}
        />
   
      </Flex>
      <Box position="absolute" bottom={0} width="100%">
        <Box position="absolute" width="100%" height="100%">
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "#262523"]}
            style={{ width: "100%", height: "100%", bottom: 0 }}
          />
        </Box>
        <Box width={2 / 3} p={3}>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
};

export { Banner };
