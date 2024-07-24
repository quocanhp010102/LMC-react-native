import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Dimensions,
    Keyboard,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import {FlatList} from "react-native-gesture-handler";
import {InputWithIcon} from "../components/InputWithIcon";
import {Box, Flex, Text} from "../rebass";
import {SearchApi} from "../services/api/Search/SearchApi";
import {generateApiService} from "../services/ApiService";
import {FastImage} from "components-base";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";

interface SearchInputProps {
    onPressSearch: () => void
}

const SearchInput = ({onPressSearch}: SearchInputProps) => {
    const {top: statusBarHeight} = useSafeAreaInsets()
    const [queryInput, setQueryInput] = React.useState<string>();
    const [newData, setNewData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const checkValidate = (inputValue: any) => {
        if (inputValue.length <= 255) {
            setQueryInput(inputValue);
        } else {
            setQueryInput("");
        }
    };
    useEffect(() => {
        if (queryInput) {
            setLoading(true);
            // only change query if there is no typing within 500ms
            const timeout = setTimeout(() => {
                setQueryInput(queryInput);
                getData(queryInput.trim());
            }, 800);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            setLoading(false);
            setNewData([]);
        }
    }, [queryInput]);

    const getData = async (query: string) => {
        setLoading(true);
        const response = await generateApiService.get(
            SearchApi.getAllSearch(query)
        );

        if (response) {
            setNewData(response.content);
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Box height={Dimensions.get("window").height - statusBarHeight} mt={20}>
                <Box
                    mb={2}
                    flexDirection="row"
                    alignItems="center"
                    borderBottomColor="tabBar"
                >
                    <InputWithIcon
                        autoFocus={true}
                        icon="search"
                        flex={1}
                        value={queryInput}
                        onChangeText={(e) => checkValidate(e)}
                        iconColor="#00A8B5"
                        placeholderTextColor="black"
                        // placeholder="Nhập từ khóa"
                        iconSize={16}
                        onPress={() => setQueryInput("")}
                        border
                        borderColor={"#00A8B5"}

                    />
                </Box>
                {loading == true ? (
                    <Box flexDirection="row" alignItems="center" justifyContent="center">
                        <Text textAlign="center" color="lightText" py={4} marginRight={1}>
                            Đang tìm kiếm
                        </Text>
                        <ActivityIndicator size="small"/>
                    </Box>
                ) : queryInput && newData.length === 0 ? (
                    <Box>
                        <Text textAlign="center" p={4} mt={2}>
                            Không tìm thấy kết quả!
                        </Text>
                        <Text textAlign="center" color="lightText">
                            Hãy thử các từ khóa khác nhau
                        </Text>
                    </Box>
                ) : queryInput !== undefined && newData.length !== 0 ? (
                    <>
                        <Text color="normalText" my={3} fontSize={3}>
                            Kết quả tìm kiếm:{" "}
                            <Text mt={2} p={3} color="#00A8B5" fontWeight="bold" fontSize={3}>
                                {queryInput}{" "}
                            </Text>{" "}
                            ({newData.length} kết quả)
                        </Text>
                        <Box style={{flexGrow: 1, flex: 1}}>
                            <FlatList
                                data={newData ?? []}
                                // initialNumToRender={10}
                                onEndReachedThreshold={0.2}
                                keyExtractor={(item, index) => String(item.id)}
                                renderItem={({item}) => {
                                    return (
                                        <Flex key={item.id}>
                                            {item && (
                                                <SearchItem
                                                    id={item.id}
                                                    title={item.news_title}
                                                    image={item.news_image}
                                                    displayInfo={item.news_description}
                                                    onPressSearch={onPressSearch}
                                                />
                                            )}
                                            <Box
                                                height={1}
                                                width="100%"
                                                bg="separator"
                                                mb={1}
                                                mt={1}
                                            />
                                        </Flex>
                                    );
                                }}
                            />
                            <Box mb={2}/>
                        </Box>
                    </>
                ) : undefined}
            </Box>
        </TouchableWithoutFeedback>
    );
};

interface SearchProps {
    onPressSearch: () => void
}

export const Search = ({onPressSearch}: SearchProps) => {

    return (
        <SafeAreaView
        >
            <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
            <Box px={2}>
                <SearchInput onPressSearch={onPressSearch}></SearchInput>
            </Box>
        </SafeAreaView>
    );
};

const SearchItem = (props: {
    id: string;
    title?: string;
    image?: string | null;
    displayInfo?: string | null;
    onPressSearch: () => void
}) => {

    const navigation = useNavigation()
    const pressNews = () => {
        props.onPressSearch();
        navigation.navigate("/chi-tiet-tin", {
            id: props.id,
        });
    };

    return (
        <TouchableOpacity onPress={pressNews}>
            <Flex alignItems="center" flexDirection="row">
                <Flex
                    bg="#C4C4C4"
                    overflow="hidden"
                    position="relative"
                    borderRadius={4}
                    justifyContent="center"
                    alignItems="center"
                    width={108}
                    height={61}
                >
                    {!!props.image && (
                        <FastImage
                            source={{uri: props.image}}
                            style={{width: 108, height: 61}}
                        />
                    )}
                </Flex>
                <Flex
                    flex={1}
                    ml={3}
                    flexDirection="column"
                    justifyContent="space-between"
                >
                    <Text
                        color="#1C7988"
                        fontSize={2}
                        fontWeight="bold"
                        numberOfLines={2}
                    >
                        {props.title}
                    </Text>
                    <Text color="normalText" style={{
                        marginTop : 5,
                        marginBottom : 6
                    }} fontSize={1}  numberOfLines={1} >
                        Danh mục: News
                    </Text>
                    <Text
                        color="normalText"
                        fontSize={1}
                        mb={2.5}
                        numberOfLines={1}
                        width="80%"
                    >
                        Mô tả: {props.displayInfo}
                    </Text>
                </Flex>
            </Flex>
        </TouchableOpacity>
    );
};
