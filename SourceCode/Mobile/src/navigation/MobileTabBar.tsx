import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { SafeAreaView } from "react-native";
import { TabBar } from "../components/TabBar";
import { Box } from "../rebass";
const MobileTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const role = state.routes[14].name;

  const onPress = state.routes.map((route, idx) => () => {
    const isFocused = state.index === idx;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  });
  const onLongPress = state.routes.map(
    (route) => () =>
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      })
  );
  if (Number(role) === 1) {
    return (
      <Box bg="tabBar">
        <SafeAreaView>
          <TabBar>
            <TabBar.Item
              title="Trang chủ"
              icon="home"
              isActive={state.index === 0}
              onPress={onPress[0]}
              onLongPress={onLongPress[0]}
            />
            <TabBar.Item
              title="Học Tập"
              icon="course"
              isActive={state.index === 1}
              onPress={onPress[1]}
              onLongPress={onLongPress[1]}
            />
            {Number(role) === 1? (
              <TabBar.Item
                title="Quản lý khóa học"
                icon="manageCourse"
                isActive={state.index === 6}
                onPress={onPress[6]}
                onLongPress={onLongPress[6]}
              />
            ) : null}
            <TabBar.Item
              title="Lịch"
              icon="calendar"
              isActive={state.index === 2}
              onPress={onPress[2]}
              onLongPress={onLongPress[2]}
            />
            <TabBar.Item
              title="Hướng Dẫn Sử Dụng"
              icon="user-manual"
              isActive={state.index === 3}
              onPress={onPress[3]}
              onLongPress={onLongPress[3]}
            />
            <TabBar.Item
              title="Cá Nhân"
              icon="user"
              isActive={state.index === 4}
              onPress={onPress[4]}
              onLongPress={onLongPress[4]}
            />
          </TabBar>
        </SafeAreaView>
      </Box>
    );
  } else if (Number(role) === 1) {
    return (
      <Box bg="tabBar">
        <SafeAreaView>
          <TabBar>
            <TabBar.Item
              title="Trang chủ"
              icon="home"
              isActive={state.index === 0}
              onPress={onPress[0]}
              onLongPress={onLongPress[0]}
            />
            <TabBar.Item
              title="Quản lý người dùng"
              icon="manageUser_ic"
              isActive={state.index === 7}
              onPress={onPress[7]}
              onLongPress={onLongPress[7]}
            />
            <TabBar.Item
              title="Quản lý chuyên ngành"
              icon="ManageSpecialized"
              isActive={state.index === 8}
              onPress={onPress[8]}
              onLongPress={onLongPress[8]}
            />
            <TabBar.Item
              title="Quản lý lớp"
              icon="course"
              isActive={state.index === 15}
              onPress={onPress[15]}
              onLongPress={onLongPress[15]}
            />
            <TabBar.Item
              title="Quản lý thông báo"
              icon="ManageNotification"
              isActive={state.index === 9}
              onPress={onPress[9]}
              onLongPress={onLongPress[9]}
            />
            <TabBar.Item
              title="Quản lý tin tức"
              icon="ManageNews"
              isActive={state.index === 10}
              onPress={onPress[10]}
              onLongPress={onLongPress[10]}
            />
            <TabBar.Item
              title="Quản lý lịch"
              icon="calendar"
              isActive={state.index === 11}
              onPress={onPress[11]}
              onLongPress={onLongPress[11]}
            />
            <TabBar.Item
              title="Quản lý phản hồi"
              icon="user-manual"
              isActive={state.index === 12}
              onPress={onPress[12]}
              onLongPress={onLongPress[12]}
            />
            <TabBar.Item
              title="Quản lý hướng dẫn sử dụng"
              icon="ManageUserManual"
              isActive={state.index === 13}
              onPress={onPress[13]}
              onLongPress={onLongPress[13]}
            />
          </TabBar>
          <TabBar.Item
            title="Cá Nhân"
            icon="user"
            isActive={state.index === 4}
            onPress={onPress[4]}
            onLongPress={onLongPress[4]}
          />
        </SafeAreaView>
      </Box>
    );
  } else {
    return (
      <Box bg="tabBar">
        <SafeAreaView>
          <TabBar>
            <TabBar.Item
              title="Trang chủ"
              icon="home"
              isActive={state.index === 0}
              onPress={onPress[0]}
              onLongPress={onLongPress[0]}
            />
            <TabBar.Item
              title="Học Tập"
              icon="course"
              isActive={state.index === 1}
              onPress={onPress[1]}
              onLongPress={onLongPress[1]}
            />
            <TabBar.Item
              title="Lịch"
              icon="calendar"
              isActive={state.index === 2}
              onPress={onPress[2]}
              onLongPress={onLongPress[2]}
            />
            <TabBar.Item
              title="Hướng Dẫn Sử Dụng"
              icon="user-manual"
              isActive={state.index === 3}
              onPress={onPress[3]}
              onLongPress={onLongPress[3]}
            />
          </TabBar>
        </SafeAreaView>
      </Box>
    );
  }
};

export default MobileTabBar;
