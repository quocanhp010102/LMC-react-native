import React from "react";
import {Dimensions, ScrollView, TouchableOpacity,} from "react-native";
import {Box, Text} from "../../../rebass";
import {Icon} from "../../../components/svg-icon";

const {width, height} = Dimensions.get("screen");
export const ModalDelete = (props: {
    data?: any;
    setModalVisible: any;
    getData: any;
}) => {
    const {data, setModalVisible} = props;
    return (
        <Box
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
            }}
        >
            <Box
                style={{
                    width: "90%",
                    margin: 20,
                    backgroundColor: "white",
                    borderRadius: 20,
                    padding: 10,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Box alignItems="center" mt={3}>
                        <Icon name="delete" size={50}></Icon>
                        <Text fontSize={18} color="seen" textAlign="center" mt={3} mb={3}>
                            Bạn có chắc chắn muốn xóa dữ liệu này không ?
                        </Text>
                    </Box>

                    <Box flexDirection="row">
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Box
                                borderRadius={5}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                mt={2}
                                mr={2}
                                width={width * 0.4}
                                alignItems="center"
                                backgroundColor="rgba(99, 99, 99, 0.1)"
                            >
                                <Text style={{padding: 10}}>Hủy</Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box
                                borderRadius={5}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                mt={2}
                                backgroundColor="buttonColor"
                                width={width * 0.4}
                                alignItems="center"
                            >
                                <Text
                                    style={{padding: 10, color: "#ffffff", right: 0}}
                                    numberOfLines={1}
                                >
                                    Xóa
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
};
