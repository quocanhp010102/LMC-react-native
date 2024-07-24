import { CheckOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ContextModal } from '../../Context/ModalContext'
import { ContextMessage } from '../../Context/ShowMessage'
import { CourseService } from '../../services/CourseService'
import { ExamService } from '../../services/ExamService'
import { NewsService } from '../../services/NewsService'
import { __Date } from '../../types'
import ListMemberCourseContainer from '../common/ListMemberCourseContainer'
import MultipleChoiceQuestionBank from '../Manager/MultipleChoiceQuestionBankModal'
import { ContextLayout } from './../../layout/Layout'

type Props = {}

type Answer = {
    answersName: string
    answersStatus: '1' | '0'
}
type Question = {
    questionsName: string
    answers: Answer[]
}

const CreateQuizContainer = (props: Props) => {
    const { pushMessage } = useContext(ContextMessage)
    const navigate = useNavigate()
    const params = useParams()
    const { courseId, quizId } = params
    const [courseData, setCourseData] = useState(null)
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const { showModal, setModal } = useContext(ContextModal)

    const getCourseData = () => {
        CourseService.getCourseById(courseId)
            .then((data) => setCourseData(data))
            .catch((err) => {})
    }

    const TIME_ZONE_OFFSET = new Date().getTimezoneOffset() * 60000

    const [examData, setExamData] = useState({
        id: quizId,
        course: {
            id: courseId,
        },
        examName: '',
        examCloseTime: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(
            2,
            '0',
        )}-${`${new Date().getDate()}`.padStart(2, '0')}T${`${new Date().getHours()}`.padStart(
            2,
            '0',
        )}:${`${new Date().getMinutes()}`.padStart(2, '0')}`,
        examOpenTime: `${new Date().getFullYear()}-${`${new Date().getMonth() + 1}`.padStart(
            2,
            '0',
        )}-${`${new Date().getDate()}`.padStart(2, '0')}T${`${new Date().getHours()}`.padStart(
            2,
            '0',
        )}:${`${new Date().getMinutes()}`.padStart(2, '0')}`,
        examLimittedWorkingTime: '',
        questions: [],
        examsHistoryAnswer: '',
        examsHistoryFileAnswer: '',
        typeOfExams: {
            id: 1,
        },
    })

    const getExamData = () => {
        ExamService.getExamById(quizId)
            .then((data) => {
                setExamData({
                    ...data,
                    examCloseTime: `${new Date(data.examCloseTime).getFullYear()}-${`${
                        new Date( data.examCloseTime).getMonth() + 1
                    }`.padStart(2, '0')}-${`${new Date(
                        data.examCloseTime,
                    ).getDate()}`.padStart(2, '0')}T${`${new Date(
                        data.examCloseTime,
                    ).getHours()}`.padStart(2, '0')}:${`${new Date(
                        data.examCloseTime,
                    ).getMinutes()}`.padStart(2, '0')}`,
                    examOpenTime: `${new Date( data.examOpenTime).getFullYear()}-${`${
                        new Date( data.examOpenTime).getMonth() + 1
                    }`.padStart(2, '0')}-${`${new Date(
                        data.examOpenTime,
                    ).getDate()}`.padStart(2, '0')}T${`${new Date(
                        data.examOpenTime,
                    ).getHours()}`.padStart(2, '0')}:${`${new Date(
                        data.examOpenTime,
                    ).getMinutes()}`.padStart(2, '0')}`,
                })
                setListQuestion(
                    data.questions?.map((item: Question) => {
                        return {
                            questionsName: item.questionsName,
                            answers: item.answers.map((element) => {
                                return { answersName: element.answersName, answersStatus: element.answersStatus }
                            }),
                        }
                    }),
                )
            })
            .catch((err) => {})
    }

    useEffect(() => {
        getCourseData()
        getExamData()
    }, [])

    useEffect(() => {
        if (courseData !== null) {
            AttachChidrenSideRight(
                <ListMemberCourseContainer
                    onClick={() => {}}
                    students={courseData?.courseStudents}
                    lecturer={courseData?.lecturer}
                    total={courseData?.courseTotalStudent}
                />,
            )
        }
    }, [courseData])

    const handleChangeExamData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[0-9\b]+$/
        if (event.target.name == 'examLimittedWorkingTime') {
            setExamData({
                ...examData,
                [event.target.name]:
                    event.target.value == '' || regex.test(event.target.value)
                        ? event.target.value
                        : examData.examLimittedWorkingTime,
            })
        } else if (event.target.name == 'examCloseTime' || event.target.name == 'examOpenTime') {
            setExamData({
                ...examData,
                [event.target.name]: event.target.value,
            })
        } else {
            setExamData({ ...examData, [event.target.name]: event.target.value })
        }
    }

    const [listQuestion, setListQuestion] = useState<Question[]>([
        {
            questionsName: '',
            answers: [
                {
                    answersName: '',
                    answersStatus: '0',
                },
                {
                    answersName: '',
                    answersStatus: '0',
                },
                {
                    answersName: '',
                    answersStatus: '0',
                },
                {
                    answersName: '',
                    answersStatus: '0',
                },
            ],
        },
    ])
    const [chosenQuestionList, setChosenQuestionList] = useState<number[]>([])

    const refCheckboxs = useRef<HTMLInputElement[] | any[]>([])

    const addQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setListQuestion([
            ...listQuestion,
            {
                questionsName: '',
                answers: [
                    {
                        answersName: '',
                        answersStatus: '0',
                    },
                    {
                        answersName: '',
                        answersStatus: '0',
                    },
                    {
                        answersName: '',
                        answersStatus: '0',
                    },
                    {
                        answersName: '',
                        answersStatus: '0',
                    },
                ],
            },
        ])
    }

    const handleChangeQuestion = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        let tempArr = listQuestion
        tempArr[index] = { ...tempArr[index], [event.target.name]: event.target.value }
        setListQuestion([...tempArr])
    }

    const handleChangeAnswer = (
        event: React.ChangeEvent<HTMLInputElement>,
        questionIndex: number,
        answerIndex: number,
    ) => {
        let tempArr = listQuestion
        tempArr[questionIndex].answers[answerIndex] = {
            ...tempArr[questionIndex].answers[answerIndex],
            answersName: event.target.value,
        }
        setListQuestion([...tempArr])
    }

    const handleChooseAnswer = (
        event: React.ChangeEvent<HTMLInputElement>,
        questionIndex: number,
        answerIndex: number,
    ) => {
        let tempArr = listQuestion

        for (let index in tempArr[questionIndex].answers) {
            tempArr[questionIndex].answers[index] = {
                ...tempArr[questionIndex].answers[index],
                answersStatus: index == answerIndex.toString() ? '1' : '0',
            }
        }
        setListQuestion([...tempArr])
    }

    const delQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const delArr = chosenQuestionList.sort((a, b) => b - a)
        let tempQuestionlist = [...listQuestion]
        delArr.forEach((item) => {
            tempQuestionlist = [
                ...tempQuestionlist.slice(0, item),
                ...tempQuestionlist.slice(item + 1, tempQuestionlist.length),
            ]
        })
        resetRef()
        setListQuestion([...tempQuestionlist])
        setChosenQuestionList([])
    }

    const resetRef = () => {
        refCheckboxs.current.forEach((item) => {
            if (item) item.checked = false
        })
    }

    const chooseAllQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const isCheckAll = listQuestion.length !== chosenQuestionList.length
        if (isCheckAll) {
            setChosenQuestionList(
                listQuestion.map((item, index) => {
                    return index
                }),
            )
        } else {
            setChosenQuestionList([])
        }
        refCheckboxs.current.forEach((item) => {
            item.checked = isCheckAll
        })
    }

    const handleCheckItems = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const isChecked = refCheckboxs.current[index].checked
        if (isChecked) {
            setChosenQuestionList([...chosenQuestionList, index])
        } else {
            setChosenQuestionList(chosenQuestionList.filter((item) => item != index))
        }
    }

    const checkFormatQuestion = () => {
        let isTrue = true
        for (let question of listQuestion) {
            if (!question.questionsName) {
                isTrue = false
                break
            }
            if (
                !question.answers[0].answersName ||
                !question.answers[1].answersName ||
                !question.answers[2].answersName ||
                !question.answers[3].answersName
            ) {
                isTrue = false
                break
            }
            if (
                question.answers[0].answersStatus == '0' &&
                question.answers[1].answersStatus == '0' &&
                question.answers[2].answersStatus == '0' &&
                question.answers[3].answersStatus == '0'
            ) {
                isTrue = false
                break
            }
        }
        return isTrue
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (
            !examData.examName ||
            !examData.examOpenTime ||
            !examData.examCloseTime ||
            !examData.examLimittedWorkingTime ||
            !checkFormatQuestion()
        ) {
            pushMessage({ type: 'WARN', title: 'Cảnh báo', message: 'Nhập các trường còn trống' })
            return
        }
        ExamService.putMultipleChoiceExam(quizId, {
            ...examData,
            questions: listQuestion,
            examCloseTime: examData.examCloseTime,
            examOpenTime: examData.examOpenTime,
        })
            .then((res) => {
                pushMessage({ type: 'SUCCESS', title: 'Thành công', message: 'Sửa bài kiểm tra thành công' })
                navigate(`/faculty/courseView/${courseId}`)
                NewsService.postNewToHistory({
                    method: 'PUT',
                    name: res.examsName,
                })
            })
            .catch((err) => {})
    }

    const addQuestionInBank = (questionList: any[]) => {
        let tempArr = questionList.map((value) => {
            return {
                questionsName: value.questionName as string,
                answers: [0, 1, 2, 3].map((item, idx) => {
                    return value.answerBanks[idx]
                        ? {
                              answersName: value.answerBanks[idx].answerName as string,
                              answersStatus: value.answerBanks[idx].answerStatus as '0' | '1',
                          }
                        : { answersName: '', answersStatus: '0' as '0' | '1' }
                }),
            }
        })
        setListQuestion((listQuestion) => listQuestion.concat(tempArr))
        showModal(false)
    }

    const showQuestionBankModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        showModal(true)
        setModal(<MultipleChoiceQuestionBank type={0} submitFunc={addQuestionInBank} />)
    }

    return (
        <>
            <div className="flex-row flex grow">
                <div className="quiz flex-1 flex-col p-[23px]">
                    <div className="flex mb-[25px] items-center cursor-pointer" onClick={() => navigate(-1)}>
                        <span>
                            <img src="\img\goback.png" />
                        </span>
                        <span className="ml-2 uppercase text-[20px] text-[#636363] font-[700]">Quay lại</span>
                    </div>
                    <div className="border-solid border border-[#D4D4D4] rounded-[10px] p-[23px] mt-[23px]">
                        <h1 className="uppercase font-[700] text-[32px] sc1536:text-[38px] sc1920:text-[40px] text-blue_bg will-change-contents">
                            {courseData?.courseName}
                        </h1>
                        <p className="text-[#636363] font-[500] text-[14px] mt-[32px]">
                            <Link className="text-inherit hover:underline" to="/faculty">
                                Trung tâm kiểm soát
                            </Link>{' '}
                            /{' '}
                            <Link className="text-inherit hover:underline" to={`/faculty/courseView/${courseId}`}>
                                {courseData?.courseName}
                            </Link>
                        </p>
                    </div>

                    <div className="mt-[43px]">
                        <h1 className="text-[24px] text-primary_blue uppercase font-[500]">
                            Thiết lập bài thi trắc nghiệm
                        </h1>
                    </div>

                    <div className="rounded-[10px] border-solid border mt-[23px] p-[23px] border-[#D4D4D4] text-[18px] text-[#636363] mb-[124px]">
                        <form
                            onSubmit={(event) => {
                                handleSubmit(event)
                            }}
                        >
                            <div>
                                <label htmlFor="quiz-name">
                                    Tên bài thi <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="examName"
                                    name="examName"
                                    className="rounded-[10px] border-solid border border-[#D4D4D4] h-[50px] w-full px-[20px] my-2"
                                    value={examData.examName}
                                    onChange={(event) => handleChangeExamData(event)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-[26px] mt-[32px]">
                                <div className="">
                                    <label className="">
                                        Thời gian mở làm bài <span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex flex-row items-baseline">
                                        <input
                                            type="datetime-local"
                                            className="rounded-[10px] border-solid border border-[#D4D4D4] h-[42px] w-full max-w-[320px] px-[9px] text-center my-2"
                                            name="examOpenTime"
                                            value={examData.examOpenTime}
                                            onChange={(event) => handleChangeExamData(event)}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <label className="">
                                        Thời gian khóa làm bài <span className="text-red-600">*</span>
                                    </label>
                                    <div className="flex flex-row items-baseline">
                                        <input
                                            type="datetime-local"
                                            className="rounded-[10px] border-solid border border-[#D4D4D4] h-[42px] w-full max-w-[320px] px-[9px] text-center my-2"
                                            name="examCloseTime"
                                            value={examData.examCloseTime}
                                            onChange={(event) => {
                                                handleChangeExamData(event)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="">
                                        Giới hạn thời gian làm bài
                                        <span className="text-red-600"> *</span>
                                    </label>
                                    <div className="flex flex-row items-baseline">
                                        <input
                                            type="text"
                                            id="examLimittedWorkingTime"
                                            className="rounded-[10px] border-solid border border-[#D4D4D4] h-[42px] w-[80px] text-center my-2"
                                            name="examLimittedWorkingTime"
                                            value={examData.examLimittedWorkingTime}
                                            onChange={(event) => handleChangeExamData(event)}
                                            placeholder="0"
                                        />
                                        <div className="px-3">
                                            Phút <span className="text-red-600"> *</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[42px]">
                                <h2>Tạo mới bài thi trắc nghiệm</h2>
                            </div>

                            <div className="flex flex-row mt-[32px] mb-[53px]">
                                <button
                                    onClick={chooseAllQuestion}
                                    className="rounded-[10px] border-solid border h-[42px] px-4 border-light_blue text-light_blue p-[9px]"
                                >
                                    Chọn tất cả
                                </button>
                                <button
                                    onClick={delQuestion}
                                    className="rounded-[10px] border border-solid h-[42px] px-4 ml-[23px] border-primary flex justify-center items-center"
                                >
                                    <img src="/img/red_delete_24px.png" alt="" />
                                    <span className="ml-2 text-primary">Xóa</span>
                                </button>
                                <button
                                    onClick={showQuestionBankModal}
                                    className="rounded-[10px] border-solid border h-[42px] px-4 ml-[23px] border-light_blue text-light_blue p-[9px]"
                                >
                                    Ngân hàng câu hỏi
                                </button>
                            </div>

                            {listQuestion.map((item, index) => {
                                return (
                                    <div key={index} className="mb-[65px]">
                                        <div className="flex items-center justify-between">
                                            <textarea
                                                placeholder="Nhập câu hỏi..."
                                                name="questionsName"
                                                className="w-[94%] sc1536:w-[93%] sc1920:w-[92%] mb-[20px] h-[103px] border border-solid border-borderColor py-2 px-6 rounded-[10px] flex flex-row"
                                                onChange={(event) => handleChangeQuestion(event, index)}
                                                value={item.questionsName}
                                            />

                                            <div className="w-[6%] sc1536:w-[7%] sc1920:w-[8%] mb-[20px] flex justify-end sc1920:justify-center">
                                                <input
                                                    type="checkbox"
                                                    name="user_item"
                                                    onChange={(event) => handleCheckItems(event, index)}
                                                    ref={(element) => {
                                                        refCheckboxs.current[index] = element
                                                    }}
                                                    hidden
                                                    id={`questionItem_${index}`}
                                                />
                                                <label htmlFor={`questionItem_${index}`} className="checkbox-item m-0">
                                                    <CheckOutlined />
                                                </label>
                                            </div>
                                        </div>
                                        {[0, 1, 2, 3].map((value, idx) => {
                                            return (
                                                <div className="flex justify-between" key={idx}>
                                                    <input
                                                        placeholder={`Đáp án ${idx + 1}`}
                                                        name={`answer_${idx}`}
                                                        className="w-[94%] sc1536:w-[93%] sc1920:w-[92%] h-[50px] mb-[10px] border border-solid border-borderColor py-2 px-6 rounded-[10px]"
                                                        value={item.answers[idx].answersName}
                                                        onChange={(event) => handleChangeAnswer(event, index, idx)}
                                                    />
                                                    <div className="w-[6%] sc1536:w-[7%] sc1920:w-[8%] mb-[10px] flex justify-end sc1920:justify-center items-center">
                                                        <input
                                                            type="radio"
                                                            className="w-[16px] h-[16px]"
                                                            id={`Answer_${index + '_' + idx}`}
                                                            name={`trueAnswer_${index}`}
                                                            onChange={(event) => {
                                                                handleChooseAnswer(event, index, idx)
                                                            }}
                                                            checked={item.answers[idx].answersStatus == '1'}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}

                            <div className="flex justify-end mt-[23px]">
                                <button
                                    className="rounded-[10px] border-solid border h-[50px] px-4 border-[#D4D4D4] p-2 text-[#636363]"
                                    onClick={(event) => addQuestion(event)}
                                >
                                    Thêm câu hỏi
                                </button>
                            </div>

                            <div className="flex justify-end mt-[74px] mb-[56px]">
                                <button
                                    className="border border-solid px-[25px] rounded-[10px] py-[14px] text-[18px] mr-[13px] border-[rgba(50,129,61,0.5)] text-blue_bg"
                                    onClick={() => navigate(`/faculty/courseView/${courseId}`)}
                                >
                                    Huỷ
                                </button>
                                <button
                                    className="border border-solid px-[25px] rounded-[10px] py-[14px] text-[18px] border-[rgba(50,129,61,0.5)] bg-light_blue text-white"
                                    type="submit"
                                >
                                    Lưu bài thi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateQuizContainer
