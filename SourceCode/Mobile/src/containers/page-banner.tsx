import React from "react";
import {Dimensions} from "react-native";
import {Banner} from "../components/Banner";
import {Logo} from "../components/Header";
import {calculateTime} from "../helpers/utils";
import {NavLink} from "../platform/links";
import {Box, Flex, Text} from "../rebass";

export const PageBanner = React.memo(({news}: any) => {
    const screenWidth = Math.round(Dimensions.get("window").width) || 500;
    const screenHeight = Math.round(Dimensions.get("window").height) || 500;

    return (
        <Banner>
            {(news ?? []).map((node: any, index: number) => (
                <Box key={`${node.id}-${index}`} borderRadius={10}>
                    <Banner.Item image={node.news_image}>
                        <Box>
                            <Flex flexDirection="row" style={{paddingBottom: 9}}>
                                <Box backgroundColor={"#ffffff"} borderRadius={4}>
                                    <Box px={1}>
                                        <Logo></Logo>
                                    </Box>
                                </Box>
                                <Flex
                                    flexDirection="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    ml={1}
                                >
                                    <Box height={5} width={5} bg="#FFFFFF" borderRadius={2.5}/>
                                    <Text fontSize={2} color="white" ml={1}>
                                        {node.news_created_date
                                            ? calculateTime(node.news_created_date)
                                            : null}
                                    </Text>
                                </Flex>
                            </Flex>
                            <NavLink
                                {...{
                                    route: "/chi-tiet-tin",
                                    params: {
                                        id: node.id,
                                    },
                                }}
                            >
                                <Text
                                    fontSize={3}
                                    color="white"
                                    mb={2}
                                    width={screenWidth * 0.85}
                                    numberOfLines={3}
                                >
                                    {node.news_title}
                                </Text>
                            </NavLink>
                        </Box>
                    </Banner.Item>
                </Box>
            ))}
        </Banner>
    );
})
