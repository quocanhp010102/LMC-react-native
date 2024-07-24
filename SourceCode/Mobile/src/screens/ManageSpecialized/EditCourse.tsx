import {
  ActivityIndicator,
  ListRenderItemInfo,
  Modal,
  TextInput,
  TouchableOpacity
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Header, NotificationIcon } from "../../components/Header";
import { PopupNotification } from "../../components/PopupNotification";
import { Box, Text } from "../../rebass";
import { lightColors } from "../../themes";
import { HeaderEditCourse } from "./components/HeaderEditCourse";
import ListTeacherManage from "./components/ListTeacherManage";
import ModalAddStudent from "./components/ModalAddStudent";
import { UserList } from "./components/UserList";
import { useEditCourse } from "./hooks/useEditCourse";
import { RefObject, useRef } from "react";
import PopupCloseAutomatically from "../../components/PopupCloseAutomatically";

const editCourse = ({ navigation, route }: any) => {
  const { courseName, lectureName, coursesSemester, courseID } =
    route.params.courseDetail;
  const { idDepartment, name_Department, NewCourse } = route.params;
  const {
    students,
    nameCourse,
    setNameCourse,
    courseSemester,
    setCourseSemester,
    setModalChoose,
    value,
    pickDocument,
    file,
    linkImage,
    onDeleteStudent,
    setModalAdd,
    setModalVisible,
    loadingAllStudent,
    setAll,
    chooseAll,
    all,
    selected,
    choose,
    onEndReachedStudent,
    onEditCourse,
    modalVisible,
    modalAdd,
    queryInputStu,
    checkVadidateStudent,
    setQueryInputStu,
    chooseAllNewStudent,
    onAddStudent,
    listStudent,
    chooseStudent,
    selectedStudent,
    modalVisibleNoti,
    setModalVisibleNoti,
    editTitle,
    type,
    modalChoose,
    setValue,
    keyExtractor,
    onEndReached,
    teachers,
    onRefresh,
    totalStudent,
    onEndReachedAllStudent,
    disabled
  } = useEditCourse({
    courseID: courseID,
    idDepartment: idDepartment,
    name_Department: name_Department,
    courseName: courseName,
    coursesSemester: coursesSemester,
    lectureName: lectureName,
    NewCourse: NewCourse
  });
  const textRefNameCourse = useRef<TextInput>(null);
  const textRefCourseSemester = useRef<TextInput>(null);
  const textRefFile = useRef<TextInput>(null);
  const textRefTeacher = useRef<TextInput>(null);
  const checkEmpty = (value: string, refCheck: RefObject<TextInput>) => {
    if (value?.trim()) {
      focusInput(refCheck);

      return true;
    }
    refCheck?.current?.setNativeProps({
      style: {
        opacity: 1,
        height: null,
      },
    });

    return false;
  };

  const checkValidate = () => {
    const checkNameCourse = checkEmpty(nameCourse, textRefNameCourse);
    const checkCourseSemester = checkEmpty(
      courseSemester,
      textRefCourseSemester
    );
    const checkFile = checkEmpty(file.uri || linkImage, textRefFile);
    const checkTeacher = checkEmpty(value?.label, textRefTeacher);
    if (checkNameCourse && checkFile && checkCourseSemester && checkTeacher) {
      onEditCourse()
    }
  };

  const focusInput = (refCheck: RefObject<TextInput>) => {
    refCheck?.current?.setNativeProps({
      style: {
        opacity: 0,
        height: 0,
      },
    });
  };

  return (
    <Box bg="defaultBackground" position="relative" height="100%">
      <Box height="100%">
        <Header logo search>
          <NotificationIcon />
        </Header>
        <Box height={1} bg="#636363" opacity={0.3} mt={2} />
        <FlatList
          data={students.data}
          ListHeaderComponent={
            <HeaderEditCourse
              nameCourse={nameCourse}
              courseName={courseName}
              setNameCourse={setNameCourse}
              courseSemester={courseSemester}
              setCourseSemester={setCourseSemester}
              setModalChoose={setModalChoose}
              value={value}
              pickDocument={pickDocument}
              file={file}
              linkImage={linkImage}
              onDeleteStudent={onDeleteStudent}
              setModalAdd={setModalAdd}
              setModalVisible={setModalVisible}
              loading={students.isRefreshing}
              setAll={setAll}
              chooseAll={chooseAll}
              all={all}
              textRefCourseSemester={textRefCourseSemester}
              textRefFile={textRefFile}
              textRefNameCourse={textRefNameCourse}
              textRefTeacher={textRefTeacher}
              focusInput={focusInput}
              isEmpty={students.isEmpty}
              disabled={disabled}
            />
          }
          renderItem={(items: ListRenderItemInfo<any>) => {
            const data = items.item;
            const isSelected = selected.includes(data.id);
            return (
              <Box
                marginX={16}
                borderLeftWidth={1}
                borderRightWidth={1}
                borderColor="#D4D4D4"
                backgroundColor={
                  items.index % 2 === 0 ? "#E5F3F8" : "white"
                }
              >
                <UserList
                  choose={choose}
                  isSelected={isSelected}
                  data={data}
                  index={items.index}
                  setModalAdd={setModalAdd}
                  setModalVisible={setModalVisible}
                ></UserList>
              </Box>
            );
          }}
          keyExtractor={(items, index) => `${index}-${items.id}`}
          onEndReached={onEndReachedStudent}
          ListFooterComponent={
            <Box height={40}>
              {students.data.length > 0 && !students.isRefreshing ? (
                <Box
                  marginX={16}
                  height={10}
                  borderWidth={1}
                  top={-5}
                  borderTopWidth={0}
                  borderBottomLeftRadius={8}
                  borderBottomRightRadius={8}
                  borderColor="#D4D4D4"
                ></Box>
              ) : null}
              {students.isLoadMore && <ActivityIndicator size={"small"} />}
            </Box>
          }
        />
        <Box flexDirection="row" justifyContent="space-between" marginX={16} mt={2}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("/quan-li-khoa-hoc", {
                id_course: idDepartment,
                department_name: name_Department,
                newCourse: totalStudent
                  ? {
                      courseID: courseID,
                      courseName: courseName,
                      coursesSemester: coursesSemester,
                      lectureName: lectureName,
                      totalStudent: totalStudent,
                    }
                  : null,
              });
            }}
            style={{
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: "47.5%",
              borderColor: lightColors.textColor,
              borderWidth: 1,
            }}
          >
            <Text ml={1} color="#059DCE" fontSize={18}>
              Quay lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={checkValidate}
            style={{
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00A8B5",
              height: 40,
              width: "47.5%",
            }}
          >
            <Text ml={1} color="#fff" fontSize={18}>
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
        </Box>
        <Box height={20} />
      </Box>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ModalAddStudent
          modalAdd={modalAdd}
          queryInputStu={queryInputStu}
          checkVadidateStudent={checkVadidateStudent}
          setQueryInputStu={setQueryInputStu}
          chooseAllNewStudent={chooseAllNewStudent}
          setModalVisible={setModalVisible}
          onAddStudent={onAddStudent}
          loading={loadingAllStudent}
          listStudent={listStudent.data}
          chooseStudent={chooseStudent}
          setModalAdd={setModalAdd}
          isEmpty={listStudent.isEmpty}
          selectedStudent={selectedStudent}
        ></ModalAddStudent>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleNoti}
        onRequestClose={() => {
          setModalVisibleNoti(!modalVisibleNoti);
        }}
      >
        <PopupCloseAutomatically
          titleEdit={editTitle}
          title="Sửa khóa học"
          type={type}
          isOpen={modalVisibleNoti}
          setIsOpen={setModalVisibleNoti}
        />
        {/* <PopupNotification
          titleEdit={editTitle}
          title="Sửa khóa học"
          type={type}
          setModalVisible={setModalVisibleNoti}
        ></PopupNotification> */}
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modalChoose}>
        <ListTeacherManage
          setValue={setValue}
          value={value}
          setModalChoose={setModalChoose}
          keyExtractor={keyExtractor}
          onEndReached={onEndReached}
          teachers={teachers.data}
          isRefreshing={teachers.isRefreshing}
          onRefresh={onRefresh}
        ></ListTeacherManage>
      </Modal>
    </Box>
  );
};
export default editCourse;

