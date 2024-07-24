import {DrawerActions, useIsFocused, useNavigation} from "@react-navigation/native";
import {FastImage} from "components-base";
import React, {PropsWithChildren, useEffect, useState} from "react";
import {
    Dimensions,
    Keyboard,
    NativeSyntheticEvent,
    NativeTouchEvent,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useTheme} from "styled-components/native";
import {useAppSelector} from "../hooks/ReduxHook";
import {useGoBack} from "../platform/go-back";
import {useNavigationLink} from "../platform/links";
import {Box, Flex, Text} from "../rebass";
import {NotificationScreen} from "../screens/NotificationScreen";
import {Search} from "../screens/Search";
import {lightColors} from "../themes";
import {Icon, IconName} from "./svg-icon";
import ICLogo from "./svg-icon/ICLogo";
import {useIsDrawerOpen} from '@react-navigation/drawer';

const ImageBannerLogin = require('../../assets/LogoGroupHeader.png');
export const Logo = React.memo((props: { size?: "lg" | "md" }) => {
    const navigate = useNavigationLink("/");

    const {height, width} = Dimensions.get("window")
    return (
        <TouchableOpacity
            onPress={() => {
                navigate();
            }}
            style={{
                paddingVertical: 2,
                height: props.size === "lg" ? 50 : undefined,
                justifyContent: "center",
            }}
        >
            <ICLogo
                height={props.size === "lg" ? 43 : 17}
                width={props.size === "lg" ? width * 0.53 : 91}
                fillText={props.size !== "lg"}
            ></ICLogo>
        </TouchableOpacity>
    );
});

export interface HeaderProps {
    logo?: boolean;
    title?: string;
    search?: boolean;
    profile?: boolean;
    leftButton?: "back" | "dismiss";
    leftButtonClick?: () => void;
    isSearch?: boolean;
    menu?: boolean;
    isNotification?: boolean;
}

export interface UserProps {
    activated: false;
    email: string;
    firstName: string;
    id: string;
    imageUrl: string;
    langKey: string;
    lastName: string;
    login: string;
}

const HeaderDismiss = (props: { leftButtonClick?: () => void }) => {
    return (
        <TouchableOpacity onPress={props.leftButtonClick}>
            <Box p={3}>
                <Icon name="notification" size={20} color="headerText"/>
            </Box>
        </TouchableOpacity>
    );
};
export const HeaderBack = (props: { leftButtonClick?: () => void }) => {
    const navigaion = useNavigation()

    return (
        <TouchableOpacity onPress={() => {
            props.leftButtonClick ? props.leftButtonClick() : navigaion.goBack()
        }}
                          style={{height: 50, justifyContent: "center"}}
        >
            <Box px={3}>
                <Icon name="back" size={20} color="headerText"/>
            </Box>
        </TouchableOpacity>
    );
};
export const HeaderClose = (props: {
    leftButtonClick?: () => void;
    icon?: IconName;
}) => {
    const goBack = useGoBack();
    const header = (
        <TouchableOpacity onPress={props.leftButtonClick ?? goBack}>
            <Box p={3}>
                <Icon name="cross" size={16} color="headerText"/>
            </Box>
        </TouchableOpacity>
    );
    return <SafeAreaView>{header}</SafeAreaView>;
};
export const NotificationIcon = (_props: {
    onPress?: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
    isNotification?: Boolean
}) => {
    const totalUnRead = useAppSelector(
        (state1) => state1.NoteRealTime.numberNotification
    );


    return (
        <TouchableOpacity onPress={_props?.onPress} style={{height: 50, justifyContent: "center"}}>
            <Box p={2} position="relative">
                <Icon
                    name="notification"
                    size={20}
                    color={_props?.isNotification ? lightColors.textColor : lightColors.headerText}
                />
                {totalUnRead && totalUnRead !== 0 ? (
                    <Box
                        position="absolute"
                        right="8px"
                        top="7px"
                        overflow="hidden"
                        bg="red"
                        height={13}
                        minWidth={13}
                        style={{borderRadius: 20}}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text
                            fontSize={8}
                            color="white"
                            fontWeight="bold"
                            style={{position: "relative", left: -0.1, top: -0.1}}
                        >
                            {totalUnRead ? totalUnRead : 0}
                        </Text>
                    </Box>
                ) : null}
            </Box>
            {_props.isNotification && (
                <Box
                    style={{
                        height: 2,
                        position: "absolute",
                        backgroundColor: lightColors.textColor,
                        width: "100%",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        top: 59,
                    }}
                />
            )}
        </TouchableOpacity>
    );
};
export const Header = React.memo((props: PropsWithChildren<HeaderProps>) => {
    const user = useAppSelector((state) => state.users.userList[0]);
    const role = user.role;
    const theme = useTheme();
    const navigation = useNavigation();
    const [showSearch, setShowSearch] = useState<Boolean>(false)
    const {top: statusBarHeight} = useSafeAreaInsets()
    const [showNotification, setShowNotification] = useState<Boolean>()
    const isFocused = useIsFocused();
    const isOpen: boolean = useIsDrawerOpen();

    const PressSearch = () => {
        setShowNotification(false);
        setShowSearch(!showSearch);
    };
    const PressNotification = () => {
        setShowSearch(false);
        setShowNotification(!showNotification);
    };

    useEffect(() => {

        if (!isFocused || isOpen) {
            setShowNotification(false);
            setShowSearch(false);
        }
    }, [isFocused, isOpen]);

    const header = (

        <Box height={50}>
            <Box flexDirection={"row"}>
                {props.logo ? (
                    <Box flex={1} pl={2} flexDirection="row" alignItems="center">
                        <Logo size="lg"/>
                    </Box>
                ) : (
                    <Flex flex={1} flexDirection="row" alignItems="center">
                        {props.leftButton === "back" ? (
                            <HeaderBack leftButtonClick={props.leftButtonClick}/>
                        ) : props.leftButton === "dismiss" ? (
                            <HeaderDismiss leftButtonClick={props.leftButtonClick}/>
                        ) : null}
                        <Text
                            fontWeight="bold"
                            fontSize={4}
                            color={theme.colors.headerText}
                            flex={1}
                            numberOfLines={1}
                            lineHeight={28}
                        >
                            {props.title}
                        </Text>
                    </Flex>
                )}
                {
                    role != "2" && (
                        <NotificationIcon isNotification={showNotification} onPress={PressNotification}></NotificationIcon>)
                }
                <Box style={{width: 5}}></Box>
                {props.search && <SearchIcon isSearch={showSearch} onPress={PressSearch}/>}
                <Box width={10}></Box>
                <TouchableOpacity
                    style={{
                        marginLeft: 10,
                        marginRight: 20,

                        height: 50, justifyContent: "center"
                    }}
                    onPress={async () => {
                        await Keyboard.dismiss();
                        navigation?.dispatch(DrawerActions.openDrawer())
                    }}
                >
                    <Box>
                        <Icon name="sortType2Course" size={20} color="headerText"/>
                    </Box>
                </TouchableOpacity>
            </Box>
        </Box>

    );

    return (
        <Box mt={statusBarHeight}>
            <Box>
                <FastImage
                    source={ImageBannerLogin}
                    style={{
                        height: 16,
                        width: 181,
                        resizeMode: 'contain',
                        marginLeft: 15,
                        marginBottom: 9
                    }}
                />
            </Box>
            <Box>{header}</Box>
            <Box>
                {showSearch && <Search onPressSearch={PressSearch}></Search>}
                {showNotification && <NotificationScreen></NotificationScreen>}
            </Box>
        </Box>
    );
});

export const SearchIcon = React.memo((_props: {
    isSearch: Boolean;
    onPress: () => void;
}) => {
    const navigation = useNavigation()

    const navigate = () => {
        _props.isSearch ? navigation.goBack() : navigation.navigate("search");
    };

    return (
        <TouchableOpacity
            onPress={() => {
                _props.onPress()
            }}
            style={{height: 50, justifyContent: "center"}}
        >
            <Box p={2}>
                <Icon
                    name="search"
                    size={20}
                    color={_props.isSearch ? "textColor" : "headerText"}
                />
            </Box>
            {_props.isSearch && (
                <Box
                    style={{
                        height: 2,
                        position: "absolute",
                        backgroundColor: lightColors.textColor,
                        width: "100%",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        top: 59,
                    }}
                />
            )}
        </TouchableOpacity>
    );
});
export const ProfileIcon = (_props: {
    count?: number;
    onPress?: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
}) => {
    const navigate = useNavigationLink("profile");
    return (
        <TouchableOpacity onPress={navigate}>
            <FastImage
                style={{
                    padding: 2,
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    overflow: "hidden",
                    borderWidth: 2,
                    marginRight: 10,
                    resizeMode: "center",
                }}
                source={{
                    uri: "data:image/png;base64,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",
                }}
            ></FastImage>

        </TouchableOpacity>
    );
}
