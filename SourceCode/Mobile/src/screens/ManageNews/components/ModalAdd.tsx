import {Dimensions, ScrollView, TextInput, TouchableOpacity} from "react-native";
import {Box, Text} from "../../../rebass";

const {width} = Dimensions.get("screen");
export const ModalAdd = (props: {
    data?: any;
    setModalVisible: any
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
                    height: "70%",
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
                <Text fontSize={16} color="textColor" fontWeight="bold" mt={15} mb={15}>
                    THÊM NGƯỜI DÙNG
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Box
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                        }}
                        mt={2}
                    >
                        <Box width="50%">
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Họ và tên
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="90%"
                                marginBottom={14}
                            />
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Giới tính
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="90%"
                                marginBottom={14}
                            />
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Số điện thoại
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="90%"
                                marginBottom={14}
                            />
                        </Box>
                        <Box width="50%">
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Mã người dùng
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="90%"
                                marginBottom={14}
                            />
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Ngày sinh
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="90%"
                                marginBottom={14}
                            />
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Phân quyền
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="90%"
                            />
                        </Box>
                        <Box width="100%">
                            <Text fontSize={14} fontWeight="bold" marginBottom={2}>
                                Email
                            </Text>
                            <TextInput
                                //@ts-ignore
                                height={34}
                                borderWidth={1}
                                borderColor="rgba(99, 99, 99, 0.2)"
                                borderRadius={8}
                                width="95%"
                            />
                        </Box>
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
                                    Lưu
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
};
