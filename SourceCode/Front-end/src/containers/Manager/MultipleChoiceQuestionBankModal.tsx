import { useContext, useEffect, useRef, useState } from 'react'
import { ContextModal } from '../../Context/ModalContext'
import { CourseService } from '../../services/CourseService'
import { DepartmentService } from '../../services/DepartmentService'
import { QuestionBankService } from '../../services/QuestionBankService'

type Props = {
    type: 0 | 1
    departmentId?: number | string
    courseId?: number | string
    submitFunc?: (chosenQuestionArray: any[]) => void
}
const MultipleChoiceQuestionBank = (props: Props) => {
    const { showModal } = useContext(ContextModal)
    const [departmentsList, setDepartmentsList] = useState<any[]>([])
    const [coursesList, setCoursesList] = useState<any[]>([])
    const [questionList, setQuestionList] = useState<any[]>([])
    const [filterData, setFilterData] = useState({
        departmentId: props.departmentId ? props.departmentId : '',
        courseId: props.courseId ? props.courseId : '',
        searchKeyword: '',
    })

    const [chosenQuestionList, setChosenQuestionList] = useState<any[]>([])

    const getDepartmentsList = () => {
        DepartmentService.getDepartment()
            .then((dat) => setDepartmentsList(dat.content))
            .catch((err) => console.log(err))
    }
    const getCoursesList = () => {
        filterData.departmentId == ''
            ? CourseService.getCourses()
                  .then((dat) => setCoursesList(dat.content))
                  .catch((err) => console.log(err))
            : CourseService.getCourseByDepartmentId(filterData.departmentId)
                  .then((dat) => setCoursesList(dat.content))
                  .catch((err) => console.log(err))
    }

    const onChangeFilterData = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilterData({ ...filterData, [event.target.name]: event.target.value })
    }

    const typingTimeoutRef = useRef(null)
    const getQuestionList = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            QuestionBankService.getFilter(
                props.type,
                filterData.departmentId,
                filterData.courseId,
                filterData.searchKeyword,
            )
                .then((dat) => setQuestionList(dat.content))
                .catch((err) => console.log(err))
        }, 300)
    }

    const handleChooseQuestion = (event: React.MouseEvent<HTMLDivElement>, value: any) => {
        let tempArr = []
        tempArr = chosenQuestionList.includes(value)
            ? chosenQuestionList.filter((element) => value.id != element.id)
            : chosenQuestionList.concat([value])
        setChosenQuestionList(tempArr)
    }

    // useEffect(() => console.log(questionList), [questionList])
    // useEffect(() => console.log(chosenQuestionList), [chosenQuestionList])

    useEffect(() => {
        getDepartmentsList()
    }, [])
    useEffect(() => {
        getCoursesList()
        setFilterData({ ...filterData, courseId: '' })
    }, [filterData.departmentId])
    useEffect(() => {
        getQuestionList()
    }, [filterData])

    const handleCancle = () => {
        showModal(false)
    }
    return (
        <div className="w-[854px] h-[1040px] bg-white rounded-[20px] p-[45px] flex flex-col">
            <div className="uppercase text-primary_blue text-center text-[28px] font-bold">
                Thêm câu hỏi từ ngân hàng câu hỏi
            </div>

            <div className="mt-[55px] grid grid-cols-2 gap-[12px]">
                <div>
                    <label className="text-primary_blue text-[18px] font-medium" htmlFor="departmentId">
                        Chuyên ngành
                    </label>
                    <select
                        className="w-full h-[50px] text-light_blue text-[16px] border border-borderColor rounded-[5px] mt-2 px-2 bg-white"
                        id="departmentId"
                        name="departmentId"
                        value={filterData.departmentId}
                        onChange={(e) => onChangeFilterData(e)}
                    >
                        <option key={-1} value={''}>
                            Chọn chuyên ngành
                        </option>
                        {departmentsList.map((value, index) => {
                            return (
                                <option key={index} value={value.id}>
                                    {value.department_name}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <label className="text-primary_blue text-[18px] font-medium" htmlFor="courseId">
                        Khóa học
                    </label>
                    <select
                        className="w-full h-[50px] text-light_blue text-[16px] border border-borderColor rounded-[5px] mt-2 px-2 bg-white"
                        id="courseId"
                        name="courseId"
                        value={filterData.courseId}
                        onChange={(e) => onChangeFilterData(e)}
                    >
                        <option key={-1} value={''}>
                            Chọn khóa học
                        </option>
                        {coursesList.map((value, index) => {
                            return (
                                <option key={index} value={value.id}>
                                    {value.courseName}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <label className="text-primary_blue text-[18px] font-medium">Dạng câu hỏi</label>
                    <div className="w-full h-[50px] flex items-center text-light_blue text-[16px] border border-borderColor rounded-[5px] mt-2 px-2 bg-white">
                        {props.type == 0 ? 'Trắc nghiệm' : 'Tự luận'}
                    </div>
                </div>
            </div>

            <div className="mt-[30px] flex-1 flex flex-col">
                <p className="text-primary_blue text-[18px] font-medium">Chọn câu hỏi:</p>
                <div className="mt-2 border rounded-[10px] border-borderColor p-[20px] flex-1 flex flex-col">
                    <div className="relative flex items-center w-full">
                        <svg
                            className="absolute left-0 z-20 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                        <input
                            type="text"
                            className="w-full h-[50px] pl-10 pr-4 border border-borderColor rounded focus:border-transparent focus:outline-none focus:ring-2 ring-opacity-90 text-light_blue"
                            name="searchKeyword"
                            value={filterData.searchKeyword}
                            onChange={(e) => onChangeFilterData(e)}
                        />
                    </div>
                    <div className="flex-1 max-h-[410px] mt-[20px] hideScroll overflow-y-scroll">
                        <div className="grid grid-cols-2 gap-3">
                            {questionList.map((value, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        onClick={(e) => handleChooseQuestion(e, value)}
                                        className={`border ${
                                            chosenQuestionList.includes(value)
                                                ? 'border-light_blue'
                                                : 'border-borderColor'
                                        } rounded-[5px] p-[15px] flex cursor-pointer`}
                                    >
                                        <div className="mr-2 w-[18px]">
                                            <img src="/img/list_alt_24px.png" alt="" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="text-primary_blue text-[14px] font-bold flex justify-start">
                                                Câu hỏi {idx + 1}
                                                <span className="text-light_gray text-[10px] ml-2">
                                                    {'#' + value.id}
                                                </span>
                                            </div>
                                            <p className="mt-[12px] text-light_blue text-[12px]">
                                                {value.questionName}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[28px] flex justify-end">
                <button
                    className="border border-light_blue rounded-[10px] text-[18px] font-medium text-primary h-[50px] w-[180px]"
                    onClick={() => {
                        handleCancle()
                    }}
                >
                    Hủy
                </button>
                <button
                    className="border border-light_blue rounded-[10px] text-[18px] font-medium bg-light_blue text-[#fff] h-[50px] w-[180px] ml-2"
                    onClick={() => props.submitFunc(chosenQuestionList)}
                >
                    Xác nhận
                </button>
            </div>
        </div>
    )
}

export default MultipleChoiceQuestionBank
