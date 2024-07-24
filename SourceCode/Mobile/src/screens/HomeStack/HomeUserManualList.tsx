import React from "react";
import { Box } from "../../rebass";

import {ActivityIndicator, Dimensions, FlatList, ListRenderItemInfo, RefreshControl} from "react-native";
import {useResultQuestion} from "../UserManualStack/hooks/useResult";
import ItemVideoUserManual from "../UserManualStack/components/ItemVideoUserManual";
import {useNavigation} from "@react-navigation/native";

export const HomeUserManualList = () => {
   const navigation = useNavigation()
    const {
        keyExtractor,
        onEndReached,
        quenstion,
        onRefresh,
        state,
        setState,
      } = useResultQuestion();
  return (
    <Box >
        <FlatList
            showsHorizontalScrollIndicator={false}
            data={quenstion.data}
            numColumns={2}
            keyboardDismissMode="on-drag"
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
                tintColor="#fff"
              />
            }
            renderItem={(items: ListRenderItemInfo<any>) => {
              return (
                <ItemVideoUserManual
                  index={items.index}
                  item={items.item}
                  state={state}
                  setState={setState}
                  navigation={navigation}
                  isHomeScreen
                ></ItemVideoUserManual>
              );
            }}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.8}
            keyExtractor={keyExtractor}
            // ListFooterComponent={
            //   <>
            //     {quenstion.isLoadMore && <ActivityIndicator />}
            //     <Box height={20} />
            //   </>
            // }
          />
    </Box>
  );
};
