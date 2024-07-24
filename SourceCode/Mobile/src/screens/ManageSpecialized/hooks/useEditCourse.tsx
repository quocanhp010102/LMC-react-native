import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import React, { useCallback, useRef, useState } from "react";
import { BackHandler, Platform } from "react-native";
import { API } from "../../../services";
import { generateApiService } from "../../../services/ApiService";
import { ActivityHistoriesApi } from "../../../services/api/ActivityHistories/ActivityHistoriesApi";
import { CourseApi } from "../../../services/api/Course/CourseApi";
import { StudentApi } from "../../../services/api/Student/StudentApi";
import { useListStudentManage } from "../components/hooks/useListStudentManage";
import { useListTeacherManage } from "../components/hooks/useListTeacherManage";
import { useAllStudentManage } from "../components/hooks/useAllStudentManage";

export const useEditCourse = ({
  courseID,
  idDepartment,
  name_Department,
  courseName,
  coursesSemester,
  lectureName,
  NewCourse
}: any) => {
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false);
  const [type, setType] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChoose, setModalChoose] = useState(false);
  const { keyExtractor, onEndReached, teachers, onRefresh } =
    useListTeacherManage();
  const { onEndReachedStudent, students, onRefreshStudent } =
    useListStudentManage({ id: courseID });
  const { onEndReachedAllStudent, listStudent, onRefreshAllStudent, checkVadidateStudent, queryInputStu, setQueryInputStu } =
    useAllStudentManage({ id: courseID });
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>([]);
  const selectedStudent = useRef<any[]>([])
  const [all, setAll] = useState<boolean>(false);
  const [nameCourse, setNameCourse] = useState<string>("");
  const [courseSemester, setCourseSemester] = useState<string>("");
  const [linkImage, setLinkImage] = useState<string>("");
  const [file, setFile] = useState<any>({ uri: "", name: "", type : "" });
  const [notification, setNotification] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [totalStudent, setTotalStudent] = useState<number | null>(null);
  const [value, setValue] = useState<any>({});
  const [disabled, setDisabled] = useState<boolean>(true)

  const choose = useCallback(
    (id: number) => {
      let newData = [...selected];
      setDisabled(false);
      if (selected.includes(id)) {
        newData = newData.filter((x) => x !== id);
      } else {
        newData.push(id);
      }
      if (newData.length == 0) {
        setDisabled(true);
      }
      setSelected(newData);
    },
    [selected]
  );
  const chooseStudent = useCallback(
    (id: number) => {
      let newData = [...selectedStudent.current];
      if (selectedStudent.current.includes(id)) {
        newData = newData.filter((x) => x !== id);
      } else {
        newData.push(id);
      }
      selectedStudent.current = newData

    },
    [selectedStudent]
  );
  const chooseAll = () => {
    if (!all) {
      const allId = students.data.map((user: any) => user.id);
      setSelected(allId);
      setDisabled(false);
    } else {
      setSelected([]);
      setDisabled(true);
    }
    setAll(!all);
  };

  const chooseAllNewStudent = (isSelectedAll: boolean) => {
    if (isSelectedAll) {
      if (listStudent.data.length > 0) {
        const allId = listStudent.data.map((user: any) => user.id);
        selectedStudent.current = allId;
      }
    } else {
      selectedStudent.current = [];
    }
  };

  const onAddStudent = async () => {
    try {
      if (selectedStudent.current.length > 0) {
        const ids = selectedStudent.current;
        await generateApiService.post(CourseApi.addStudent(courseID), ids);
        let listUpdate = students.data;
        let listStudentUpdate = listStudent.data;
        for (let i = 0; i < ids.length; i++) {
          for (let index = 0; index < listStudent.data.length; index++) {
            if (listStudent.data[index].id === ids[i]) {
              listUpdate.push(listStudent.data[index]);
              listStudentUpdate.splice(index, 1);
            }
          }
        }
        onRefreshStudent();
        setTotalStudent((totalStudent || 0) + selectedStudent.current.length)
        selectedStudent.current = []
        setModalVisible(false);
        setSelected([]);
        setEditTitle("Thêm sinh viên thành công !");
        setType("success");
        setTimeout(() => {
          setModalVisibleNoti(true);
        }, 500);
      } else {
        setModalVisible(false);
      }
    } catch (e) {

      setModalVisible(false);
      setEditTitle("Thêm sinh viên thất bai !");
      setType("error");
      setTimeout(() => {
        setModalVisibleNoti(true);
      }, 500);
    }
  };
  const onDeleteStudent = async () => {
    if (selected.length > 0) {
      console.log("true");

      try {
        const ids = selected;
        await generateApiService.delete(CourseApi.deleteStudent(courseID), ids);
        let listUpdate = students.data;
        let listStudentUpdate = listStudent.data;
        for (let i = 0; i < ids.length; i++) {
          for (let index = 0; index < students.data.length; index++) {
            if (students.data[index].id === ids[i]) {
              listStudentUpdate.push(students.data[index]);
              listUpdate.splice(index, 1);
            }
          }
        }
        setTotalStudent((totalStudent || 0) - selected.length)
        onRefreshAllStudent()
        students.setData(listUpdate);
        if (all) {
          setAll(false);
        }
        setSelected([]);
        setModalVisible(false);
        setEditTitle("Xóa sinh viên thành công !");
        setType("success");
        setTimeout(() => {
          setModalVisibleNoti(true);
        }, 500);
        setDisabled(true);
      } catch (error) {
        setModalVisible(false);
        setEditTitle("Xóa sinh viên thất bai !");
        setType("error");
        setTimeout(() => {
          setModalVisibleNoti(true);
        }, 500);
      }
    }
  };
  const pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename || "");
      let type = match ? `image/${match[1]}` : `image`;
      if (type === `image/jpg`) {
        type = `image/jpeg`;
      }
      
      setFile({ uri: localUri, name: filename, type });
    }
  };

  const onGetDetailCourse = async () => {
    const response = await generateApiService.get(
      CourseApi.getCourseInfo(courseID)
    );
    if (response) {
      setNameCourse(response.courseName);

      setCourseSemester(response.courseSemester);

      setLinkImage(response.courseImage);

      setNotification(response.courseNotification);

      setDescription(response.courseDescription);

      setTotalStudent(Number(response.courseTotalStudent));

      setValue({
        value: response.lecturer.id,
        label: response.lecturer.lecturer_fullname,
      });
    }
  };

  const onEditCourse = async () => {
    try {
      let res;
      if (file?.uri) {
        const data = new FormData();
        data.append("file", {
          ...file,
          uri:
            Platform.OS === "android"
              ? file.uri
              : file.uri.replace("file://", ""),
          name: file.name,
          type: file.mimeType, // it may be necessary in Android.
        });
        res = await generateApiService.postImage(
          `${API.PUBLIC}services/lmsbackendtest/api/uploadImage`,
          data
        );
      
      }
      const body = {
        courseNotification: notification,
        courseName: nameCourse,
        courseDescription: description,
        courseTotalStudent: totalStudent,
        courseCreatedDate: moment(new Date()).format("YYYY-MM-YY"),
        courseSemester: courseSemester,
        courseImage: res ? res : linkImage,
        lecturer: {
          id: value.value,
        },
        subject: {
          id: idDepartment,
        },
        id: courseID,
      };
      const response = await generateApiService.put(
        CourseApi.getCourseById(courseID),
        body
      );

      if (response == 400) {
        setEditTitle("có lỗi xảy ra!");
        setType("warning");
        setModalVisibleNoti(true);
      } else {
        const bodyHistory = {
          name: " khóa học " + nameCourse,
          method: "PUT",
        };
        const history = await generateApiService.post(
          ActivityHistoriesApi.postHistories(),
          bodyHistory
        );
        setEditTitle("Sửa khóa học thành công !");
        setType("success");
        setModalVisibleNoti(true);
        navigation.navigate("/quan-li-khoa-hoc", {
          id_course: idDepartment,
          department_name: name_Department,
          newCourse: {
            courseID: courseID,
            courseName: response.courseName,
            coursesSemester: response.courseSemester,
            lectureName: response.lecturer.lecturer_fullname,
            totalStudent: response.courseTotalStudent,
          },
        });
      }
    } catch (error) {
      setEditTitle("Sửa khóa học thất bại !");
      setType("error");
      setModalVisibleNoti(true);
    }
  };

  React.useEffect(() => {
    if (NewCourse) {
      setEditTitle("Thêm khóa học thành công !");
      setType("success");
      setModalVisibleNoti(true);
    }
    onGetDetailCourse();

  }, []);

  React.useEffect(() => {
    const backAction = () => {
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
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [totalStudent]);

  const setModalAddShow = (value: boolean) => {

    setModalAdd(value)
    onRefreshAllStudent()
  }

  return {
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
    setModalAdd: setModalAddShow,
    setModalVisible,
    loadingAllStudent: listStudent.isRefreshing,
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
  }

};
