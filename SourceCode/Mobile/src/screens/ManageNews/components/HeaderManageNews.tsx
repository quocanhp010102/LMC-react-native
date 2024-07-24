import {Dimensions, TouchableOpacity} from 'react-native';
import {Icon} from '../../../components/svg-icon';
import {Box, Text} from '../../../rebass';

interface IHeaderManageNews {
    setAll: (value: boolean) => void;
    all: boolean
    chooseAll: () => void;

}

const HeaderManageNews = (props: IHeaderManageNews) => {
    const {setAll, all, chooseAll} = props

    const {width} = Dimensions.get("screen")
    return (
        <Box
            width={width * 0.95}
            mt={2}
            ml="2.5%"
            borderWidth={1}
            borderTopLeftRadius={8}
            borderTopRightRadius={8}
            borderBottomWidth={0}
            borderColor="#D4D4D4"
            backgroundColor={'#00A8B5'}
        >
            <Box
                style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                }}
            >
                <Box
                    style={{
                        width: "10%",
                    }}
                >
                    <Box
                        height={50}
                        style={{alignItems: "center", justifyContent: "center"}}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setAll(!all), chooseAll();
                            }}
                        >
                            {all ? (
                                <Icon name="chooseBox" color={'white'}></Icon>
                            ) : (
                                <Icon name="CheckBox" color={'white'}></Icon>
                            )}
                        </TouchableOpacity>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "10%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,
                            backgroundColor: "#00A8B5",
                        }}
                    ></Box>
                    <Box
                        height={50}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            style={{
                                color: "#636363",
                                fontSize: 12,
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        ></Text>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "55%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,
                            backgroundColor: "#00A8B5",
                        }}
                    ></Box>
                    <Box
                        height={50}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 12,
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            tiêu đề
                        </Text>
                    </Box>
                </Box>
                <Box
                    style={{
                        width: "25%",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        style={{
                            width: 1,
                            backgroundColor: "#00A8B5",
                        }}
                    ></Box>
                    <Box
                        height={50}
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 12,
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            ngày đăng
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default HeaderManageNews