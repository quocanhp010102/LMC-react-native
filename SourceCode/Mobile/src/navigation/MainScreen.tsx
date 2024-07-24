import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon, IconColor } from "../components/svg-icon";
import { useAppSelector } from "../hooks/ReduxHook";
import { CalendarStackScreen } from "../screens/CalendarStack";
import { CourseStackScreen } from "../screens/CourseStack";
import { HistoryActionStackScreen } from "../screens/HistortyActionStack";
import { HomeStackScreen } from "../screens/HomeStack";
import { ManageClassScreen } from "../screens/ManageClass";
import { ManageCourseStackScreen } from "../screens/ManageCourse";
import { ManageFeedbackScreen } from "../screens/ManageFeedback";
import { ManageNewsScreen } from "../screens/ManageNews";
import { ManageNotificationScreen } from "../screens/ManageNotification";
import { ManageSpecializedScreen } from "../screens/ManageSpecialized";
import { ManageUserScreen } from "../screens/ManageUser";
import { ManageUserManualScreen } from "../screens/ManageUserManual";
import { ProfileStackScreen } from "../screens/ProfileStack";
import { QuestionBankStackScreen } from "../screens/QuestionBank";
import { UserManualtackScreen } from "../screens/UserManualStack";
import CustomDrawer from "./CustomDrawer";

const MainScreen = () => {
  const Drawer = createDrawerNavigator();
  const role = useAppSelector((state1) => state1.users.userList[0].role);

  if (role == 0) {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
          
        }}
        drawerContentOptions={{
          activeTintColor:"#014F59",
          inactiveTintColor:"#6D6F73",
          activeBackgroundColor:"rgba(119, 173, 255, 0.1)"
        }}
        backBehavior="firstRoute"
      >
        <Drawer.Screen
          
          name="Trang chủ"
          component={HomeStackScreen}
          options={{
            drawerIcon: ({ color }: { color: string }) => (
              <Icon name="home" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Khoá học của tôi"
          component={CourseStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="course" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Lịch"
          component={CalendarStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="calendar" color={color as IconColor} />
            ),
            
          }}
        />
        <Drawer.Screen
          name="Hướng dẫn sử dụng"
          component={UserManualtackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="user-manual" color={color as IconColor} />
            ),
          }}
        />

        <Drawer.Screen
          name="Lịch sử hoạt động"
          component={HistoryActionStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="historyIcon" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Cá nhân"
          component={ProfileStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="user" color={color as IconColor} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  } else if (role == 1) {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
     
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
        }}
        drawerContentOptions={{
          activeTintColor:"#014F59",
          inactiveTintColor:"#6D6F73",
          activeBackgroundColor:"rgba(119, 173, 255, 0.1)"
        }}
        backBehavior="firstRoute"
      >
        <Drawer.Screen
          name="Trang chủ"
          component={HomeStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="home" color={color as IconColor} />
            ),
          }}
          
        />
        <Drawer.Screen
          name="Trung tâm kiểm soát"
          component={CourseStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="course" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý khóa học"
          component={ManageCourseStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="manageCourse" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Ngân hàng câu hỏi"
          component={QuestionBankStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="questionBankIcon" color={color as IconColor} />
              
            ),
            
          }}
          
        />
        <Drawer.Screen
          name="Lịch"
          component={CalendarStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="calendar" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Hướng dẫn sử dụng"
          component={UserManualtackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="user-manual" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Lịch sử hoạt động"
          component={HistoryActionStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="historyIcon" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Cá nhân"
          component={ProfileStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="user" color={color as IconColor} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  } else if (role == 2) {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
        }}
        drawerContentOptions={{
          activeTintColor:"#014F59",
          inactiveTintColor:"#6D6F73",
          activeBackgroundColor:"rgba(119, 173, 255, 0.1)" ,
      
        }}
        detachInactiveScreens
        backBehavior="history"
        initialRouteName="Trang chủ"
      >
        <Drawer.Screen
          name="Trang chủ"
          component={HomeStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="home" color={color as IconColor} />
            ),
            
          }}
          
        />
        <Drawer.Screen
          name="Quản lý người dùng"
          component={ManageUserScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="manageUser_ic" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý chuyên ngành"
          component={ManageSpecializedScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="ManageSpecialized" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý lớp"
          component={ManageClassScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="course" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý thông báo"
          component={ManageNotificationScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="ManageNotification" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý tin tức"
          component={ManageNewsScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="ManageNews" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý lịch"
          component={CalendarStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="calendar" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý phản hồi"
          component={ManageFeedbackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="user-manual" color={color as IconColor} />
            ),
          }}
        />
        <Drawer.Screen
          name="Quản lý hướng dẫn sử dụng"
          component={ManageUserManualScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="ManageUserManual" color={color as IconColor} />
            ),
          }}
        />

        <Drawer.Screen
          name="Lịch sử hoạt động"
          component={HistoryActionStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="historyIcon" color={color as IconColor} />
            ),
          
          }}
          
        />
        <Drawer.Screen
          name="Cá nhân"
          component={ProfileStackScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="user" color={color as IconColor} />
            ),
          }}
        
        />
      </Drawer.Navigator>
    );
  }
  return null;
};
export default MainScreen;
