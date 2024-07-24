import { FastImage } from "components-base";
import React from "react";
import { calculateTime } from "../helpers/utils";
import { Box, Flex, Text } from "../rebass";
import { Logo } from "./Header";
import {HexagonImageNew} from "./image/HexagonImageNew";

export const NewPaper = React.memo((props: {
  image: string;
  name: string;
  minute?: Date;
  hexagonal?: boolean;
}) => {

  return (
    <Flex
      borderRadius={8}
      borderColor="rgba(158, 150, 150, .1)"
      borderWidth={0}
      mt={2}
    >
      <Flex
        borderRadius={8}
        flexDirection="row"
        alignItems="center"
        px={3}
        height={80}
        pl={0}
      >
        <Flex
          flex={1}
          alignItems="center"
          flexDirection="row"
          height={60}
          ml={2}
        >
          <Flex
            borderRadius={6}
            alignItems="center"
            height={props.hexagonal ? 81 : 66}
            width={props.hexagonal ? 90 : 120 }
            bg={props.hexagonal ? "transparent" : "#808080"}
            style={{ borderRadius: 6 }}
            pl={0}
          >
            {props.hexagonal ?  <HexagonImageNew
                height={91}
                width={90}
                uri={props.image || ""}
                paddingTop={2}
                paddingLeft={5}
            />  :     <FastImage
                source={{ uri: props.image }}
                style={{ width: "100%", height: "100%" , borderRadius : 6 }}
            />}
          </Flex>
          <Flex
            flex={1}
            ml={2}
            height={60}
            justifyContent="space-between"
            flexDirection="column"
          >
            <Text
              fontSize={12}
              numberOfLines={3}
              fontWeight={'500'}
              color={'#1C7988'}
            >
              {props.name}
            </Text>
            <Flex flexDirection="row" >
              <Logo  />
              <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                ml={1}
                opacity={0.5}
              >
                <Box height={5} width={5} bg="#636363" borderRadius={2.5} />
                <Text fontSize={11} color="#636363" ml={1}>
                  {props.minute ? calculateTime(props.minute) : ""}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
});
