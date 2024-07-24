import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Modal,
  Platform,
  RefreshControl,
} from "react-native";
import { Header, NotificationIcon } from "../../components/Header";
import { PopupNotification } from "../../components/PopupNotification";
import { Box } from "../../rebass";
import HeaderUserManual from "./components/HeaderUserManual";
import ItemVideoUserManual from "./components/ItemVideoUserManual";
import { useResultQuestion } from "./hooks/useResult";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";
const UserManualScreen = ({ navigation }: any) => {
  const {
    keyExtractor,
    onEndReached,
    quenstion,
    onRefresh,
    state,
    setState,
    navigate,
    removeText,
    updateQuestion,
    checkVadidate,
    changeModalVisibility,
  } = useResultQuestion();

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={5}
      enabled={Platform.OS === "ios"}
    >
      <Box bg="defaultBackground" position="relative" height="100%">
        <Box height="100%">
          <Header logo search>
            <NotificationIcon />
          </Header>
          <Box height={1} bg="#636363" opacity={0.3} mt={2} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={quenstion.data}
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
                ></ItemVideoUserManual>
              );
            }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <HeaderUserManual
                navigate={navigate}
                state={state}
                setState={setState}
                removeText={removeText}
                updateQuestion={updateQuestion}
                checkVadidate={checkVadidate}
              ></HeaderUserManual>
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.8}
            keyExtractor={keyExtractor}
            ListFooterComponent={
              <>
                {quenstion.isLoadMore && <ActivityIndicator />}
                <Box height={20} />
              </>
            }
          />
        </Box>
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.modalVisible}
          onRequestClose={() => {
            setState({ modalVisible: !state.modalVisible });
          }}
        >
          <PopupCloseAutomatically
            title="Gửi câu hỏi"
            titleEdit={state.titleNotifi}
            type={state.type}
            isOpen={state.modalVisible}
            setIsOpen={changeModalVisibility}
          />
        </Modal>
      </Box>
    </KeyboardAvoidingView>
  );
};
export default UserManualScreen;
