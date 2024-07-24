import React from "react";
import {ActivityIndicator, FlatList} from "react-native";
import {Header, NotificationIcon} from "../../components/Header";
import {PageNewPaper} from "../../containers/page-newpaper";
import {Box, Text} from "../../rebass";

import {useResultNews} from "./hooks/useResult";
import {PageBanner} from "../../containers/page-banner";

export const HomeScreenBase = () => {
    const {keyExtractor, onEndReached, news, onRefresh, displayNews} =
        useResultNews();
    return (
        <Box bg="defaultBackground" position="relative" flex={1}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={news.data}
                keyboardDismissMode="on-drag"
                renderItem={(items: any) => {
                    return <Box px={2}><PageNewPaper hexagonal={false} node={items.item} key={items.id}/></Box>
                }}
                ListHeaderComponentStyle={{backgroundColor: "white"}}
                style={{backgroundColor: "#E5F3F8"}}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Box px={2} mb={16} mt={17}>
                        <Text
                            fontWeight="bold"
                            fontSize={20}
                            color="textColor"
                            lineHeight={30}
                        >
                            TIN TỨC NỔI BẬT
                        </Text>
                        <PageBanner news={displayNews}/>
                        {displayNews.map((news: any) => {
                            return <PageNewPaper hexagonal={false} node={news} key={news.id}/>;
                        })}
                        <Text
                            fontWeight="bold"
                            fontSize={20}
                            color="textColor"
                            lineHeight={30}
                            mt={17}
                        >
                            DANH SÁCH TIN TỨC TỔNG HỢP HCMUSS
                        </Text>
                    </Box>
                }
                onEndReached={onEndReached}
                onEndReachedThreshold={0.8}
                keyExtractor={keyExtractor}
                ListFooterComponent={
                    <>
                        {news.isLoadMore && <ActivityIndicator/>}
                        <Box height={20}/>
                    </>
                }
            />
        </Box>
    );
};
const NewsScreen = () => {
    return (
        <Box bg="defaultBackground" height="100%" flex={1}>
            <Box height="100%">
                <Header title="Tin tức" search leftButton="back">
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <HomeScreenBase/>
            </Box>
        </Box>
    );
};

export default NewsScreen;
