import { useNavigation, useIsFocused } from "@react-navigation/native"
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  RefObject,
} from "react"
import { BackHandler } from "react-native"
import { Department, ISubject } from "../../../../../types"
import { useCheckboxAll } from "../../../../hooks/useCheckboxAll"
import { useHandleResponsePagination } from "../../../../hooks/useHandleResponsePagination"
import { SubjectServices } from "../../../../services/api/Departments/subjectApi"
import { generateApiService } from "../../../../services/ApiService"
import { DepartmentApi } from "../../../../services/api/Departments/DepartmentApi"
import { TextInput } from "react-native"

export const useManagerSubject = (params: any) => {
  const navigation = useNavigation()
  const [modalVisibleNoti, setModalVisibleNoti] = useState(false)
  const [type, setType] = useState<string>("")
  const { id_course, department_name } = params
  const [modalVisible, setModalVisible] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [queryInput, setQueryInput] = React.useState<string>()
  const [editTitle, setEditTitle] = useState<string>("")
  const [modalChoose, setModalChoose] = useState(false)
  const [value, setValue] = useState<number[]>([])
  const [event, setEvent] = useState<boolean>(true)
  const [nameSubject, setNameSubject] = useState<string>("")
  const [codeSubject, setCodeSubject] = useState<string>("")
  const textRefName = useRef<TextInput>(null)
  const textRefCode = useRef<TextInput>(null)
  const isEdit = useRef<boolean>(false)

  const checkEmpty = (value: string) => {
    if (value && value.toString()?.trim()) {
      return ""
    }
    return "Không được bỏ trống"
  }

  const checkVadidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue)
    } else {
      setQueryInput("")
    }
  }

  const getDataDepartment = useCallback(
    (pageToken: number, pageSize: number): any => {
      return new Promise((resolve, reject) => {
        generateApiService
          .get(DepartmentApi.getAllDepartments(pageToken))
          .then((data) => {
            resolve({
              data: data.content,
              success: true,
            })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    [queryInput, id_course]
  )

  const setErrorShow = (value: string, refCheck: RefObject<TextInput>) => {
    if (value) {
      refCheck?.current?.setNativeProps({
        text: value,
        style: {
          opacity: 1,
        },
      })
    } else {
      refCheck?.current?.setNativeProps({
        text: "",
        style: {
          opacity: 0,
        },
      })
    }
  }

  const showModalDelete = () => {
    if (selected.length > 0) {
      setModalVisible(true)
    }
  }

  const getSubjects = useCallback(
    (pageToken: number, pageSize: number): any => {
      const params = queryInput
        ? {
            departmentId: id_course,
            page: pageToken,
            size: pageSize,
            search: queryInput,
          }
        : {
            departmentId: id_course,
            page: pageToken,
            size: pageSize,
          }
      return new Promise((resolve, reject) => {
        SubjectServices.get(params)
          .then((data) => {
            resolve({
              data: data.content,
              success: true,
            })
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    [queryInput, id_course]
  )

  const openNew = () => {
    isEdit.current = false
    setModalEdit(true)
  }

  const openEdit = () => {
    isEdit.current = true
    SubjectServices.getById(selected[selected.length - 1]).then((res: any) => {
      setCodeSubject(res.subject_code)
      setNameSubject(res.subject_name)
      let newListDepartments: number[] = []
      if (res.departments) {
        setEvent(false)
        res.departments.map((dataDepartment: any) => {
          newListDepartments.push(dataDepartment.id)
        })
      } else {
        setEvent(true)
      }
      setValue(newListDepartments)
      setModalEdit(true)
    })
  }

  const resetSubject = () => {
    setCodeSubject("")
    setNameSubject("")
    setValue([])
    setEvent(true)
  }

  const postSubject = () => {
    const checkFirstName = checkEmpty(nameSubject)
    const checkCode = checkEmpty(codeSubject)
    setErrorShow(checkFirstName, textRefName)
    setErrorShow(checkCode, textRefCode)
    if (!checkFirstName && !checkCode) {
      const outputArray = value.map((id) => ({ id }))
      if (isEdit.current) {
        setEditTitle("Sửa khóa học thành công!")
        SubjectServices.put({
          id: selected[selected.length - 1],
          subject_code: codeSubject,
          subject_name: nameSubject,
          departments: event ? null : outputArray,
        })
          .then((res) => {
            resetSubject()
            setModalEdit(false)
            refresh()

            setType("success")
            setModalVisibleNoti(true)
          })
          .catch((err) => {
            setEditTitle("Sửa thất bại!")
            setType("error")
            setModalVisibleNoti(true)
          })
      } else {
        setEditTitle("Thêm khóa học thành công!")
        SubjectServices.post({
          subject_code: codeSubject,
          subject_name: nameSubject,
          departments: event ? null : outputArray,
        })
          .then((res) => {
            resetSubject()
            setModalEdit(false)
            refresh()
            setType("success")
            setModalVisibleNoti(true)
          })
          .catch((err) => {
            setEditTitle("Sửa thất bại!")
            setType("error")
            setModalVisibleNoti(true)
          })
      }
    }
  }

  const {
    data,
    pullToRefresh,
    handleLoadMore,
    refresh,
    setData,
    isLoading,
    isEmpty,
    isLoadMore,
  } = useHandleResponsePagination<ISubject>(getSubjects, 12, false)

  const {
    data: items,
    pullToRefresh: pullToRefreshDe,
    handleLoadMore: handleLoadMoreDe,
    refresh: refreshDe,
    setData: setDataDe,
    isLoading: isLoadingde,
    isEmpty: isEmptyDe,
    isLoadMore: isLoadMoreDe,
  } = useHandleResponsePagination<Department>(getDataDepartment, 12, false)

  const isFocus = useIsFocused()

  const refTimeout = useRef<any>()
  useEffect(() => {
    if (refTimeout.current) clearTimeout(refTimeout.current)
    if (queryInput?.trim()) {
      refTimeout.current = setTimeout(() => {
        refresh()
      }, 250)
    } else {
      refresh()
    }
    return () => {
      if (refTimeout) clearTimeout(refTimeout.current)
    }
  }, [queryInput, isFocus])

  useEffect(() => {
    refreshDe()
  }, [])

  const goBack = () => {
    navigation.navigate("/quan-ly-chuyen-nganh", {
      newCourse: {
        course: data,
        id: id_course,
        countCourse: data.length,
      },
    })
  }
  React.useEffect(() => {
    const backAction = () => {
      goBack()
      return true
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    )
    return () => backHandler.remove()
  }, [data])
  const handleDelete = async () => {
    try {
      await SubjectServices.delete(selected)
      setEditTitle("Xóa khóa học thành công!")
      setType("success")
      setModalVisibleNoti(true)
      let newDataCourse = [...data]
      selected.forEach((item) => {
        var index = newDataCourse.findIndex((pCourse) => pCourse.id == item)
        if (index >= 0) {
          newDataCourse.splice(index, 1)
        }
      })
      setData(newDataCourse)
      setModalVisible(false)
      setSelected([])
    } catch (error) {
      console.log({ error })
    }
  }
  const checkAddItemValue = (id: number) => {
    const index = value.indexOf(id)
    if (index === -1) {
      setValue((prevValue) => [...prevValue, id])
    } else {
      setValue((prevValue) => {
        const newValue = [...prevValue]
        newValue.splice(index, 1)
        return newValue
      })
    }
  }

  const { choose, chooseAll, selected, setSelected, all, getChecked } =
    useCheckboxAll(data?.map((item) => item.id))
  return {
    choose,
    chooseAll,
    selected,
    setSelected,
    all,
    getChecked,
    data,
    pullToRefresh,
    handleLoadMore,
    refresh,
    setData,
    isLoading,
    isEmpty,
    isLoadMore,
    handleDelete,
    checkVadidate,
    modalVisibleNoti,
    setModalVisibleNoti,
    editTitle,
    setEditTitle,
    type,
    setType,
    department_name,
    modalVisible,
    setModalVisible,
    goBack,
    queryInput,
    setQueryInput,
    id_course,
    modalEdit,
    setModalEdit,
    modalChoose,
    setModalChoose,
    items,
    value,
    setValue: checkAddItemValue,
    LoadMoreDepartment: handleLoadMoreDe,
    event,
    setEvent,
    nameSubject,
    setNameSubject,
    codeSubject,
    setCodeSubject,
    postSubject,
    textRefName,
    textRefCode,
    resetSubject,
    openEdit,
    openNew,
    showModalDelete,
  }
}
