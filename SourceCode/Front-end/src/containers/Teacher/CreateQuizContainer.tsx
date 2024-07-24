import { CheckOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CourseService } from '../../services/CourseService'
import { ExamService } from '../../services/ExamService'
import { __Date } from '../../types'
import { ContextMessage } from '../../Context/ShowMessage'
import { ContextModal } from '../../Context/ModalContext'
import MultipleChoiceQuestionBank from '../Manager/MultipleChoiceQuestionBankModal'
import { ContextLayout } from '../../layout/Layout'
import ListMemberCourseContainer from '../common/ListMemberCourseContainer'
import { NewsService } from '../../services/NewsService'

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
    const params = useParams()
    const navigate = useNavigate()
    const { pushMessage } = useContext(ContextMessage)
    const { courseId } = params
    const [courseData, setCourseData] = useState(null)
    const { showModal, setModal } = useContext(ContextModal)
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const getCourseData = () => {
        CourseService.getCourseById(courseId)
            .then((data) => setCourseData(data))
            .catch((err) => {})
    }

    const today = new Date()

    const [examData, setExamData] = useState({
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

    useEffect(() => {
        getCourseData()
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
            pushMessage({ title: 'Cảnh báo', type: 'WARN', message: 'Nhập các trường còn trống' })
            return
        }

        ExamService.postMultipleChoiceExam({
            ...examData,
            questions: listQuestion,
            examCloseTime: examData.examCloseTime,
            examOpenTime: examData.examOpenTime,
        })
            .then((res) => {
                pushMessage({ title: 'Thành công', type: 'SUCCESS', message: 'Thêm bài kiểm tra thành công' })
           
                navigate(`/faculty/courseView/${courseId}`)
                NewsService.postNewToHistory({
                    method: 'POST',
                    name: res.examsName,
                })
            })
            .catch((err) => {})
    }

    const [templateIndex, setTemplateIndex] = useState<number>(-1)
    const onChangeTemplate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTemplateIndex(parseInt(event.target.value))
        setListQuestion(
            parseInt(event.target.value) == -1
                ? [
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
                  ]
                : templateData[parseInt(event.target.value)],
        )
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
                        <span className="ml-2 uppercase text-[20px] text-color63 font-[700]">Quay lại</span>
                    </div>
                    <div className="border-solid border border-borderColor rounded-[10px] p-[23px] mt-[23px]">
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

                    <div className="rounded-[10px] border-solid border mt-[23px] p-[23px] border-borderColor text-[18px] text-color63 mb-[124px]">
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
                                    className="rounded-[10px] border-solid border border-borderColor h-[50px] w-full px-[20px] my-2"
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
                                            className="rounded-[10px] border-solid border border-borderColor h-[42px] w-full max-w-[320px] px-[9px] text-center my-2"
                                            name="examOpenTime"
                                            min={today.toISOString().slice(0, 16)}
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
                                            className="rounded-[10px] border-solid border border-borderColor h-[42px] w-full max-w-[320px] px-[9px] text-center my-2"
                                            name="examCloseTime"
                                            value={examData.examCloseTime}
                                            min={new Date(
                                                new Date(examData.examOpenTime).getTime() +
                                                    parseInt(examData.examLimittedWorkingTime || '0') * 60000,
                                            )
                                                .toISOString()
                                                .slice(0, 16)}
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
                                            className="rounded-[10px] border-solid border border-borderColor h-[42px] w-[80px] text-center my-2"
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

                                <select
                                    className="ml-auto rounded-[10px] border-solid border h-[42px] px-4 border-light_blue text-light_blue p-[9px]"
                                    onChange={(event) => onChangeTemplate(event)}
                                    value={templateIndex}
                                >
                                    <option key={-1} value={-1}>
                                        Chọn template
                                    </option>
                                    {templateData.map((value, idx) => {
                                        return <option key={idx} value={idx}>{`Template ${idx + 1}`}</option>
                                    })}
                                </select>
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
                                                            id={`Answer_${index + '_' + idx}`}
                                                            className="w-[16px] h-[16px]"
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
                                    className="rounded-[10px] border-solid border h-[50px] px-4 border-light_blue p-2 text-primary_blue"
                                    onClick={(event) => addQuestion(event)}
                                >
                                    Thêm câu hỏi
                                </button>
                            </div>

                            <div className="flex justify-end mt-[74px] mb-[56px]">
                                <button
                                    className="border border-solid px-[25px] rounded-[10px] py-[14px] text-[18px] mr-[13px] border-primary text-primary"
                                    onClick={() => navigate(`/faculty/courseView/${courseId}`)}
                                >
                                    Huỷ
                                </button>
                                <button
                                    className="border border-solid px-[25px] rounded-[10px] py-[14px] text-[18px] border-light_blue bg-light_blue text-white"
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

export const templateData: Question[][] = [
    [
        {
            questionsName: 'Kinh tế vĩ mô là môn học nghiên cứu:',
            answers: [
                {
                    answersName: 'Thị trường quốc gia về từng sản phẩm như gạo, thịt lợn.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Các tổng lượng phản ánh hoạt động của nền kinh tế.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Nền kinh tế nhỏ lẻ.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Nghiên cứu về hành vi của các doanh nghiệp lớn trong nền kinh tế',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Kinh tế vĩ mô nghiên cứu:',
            answers: [
                {
                    answersName: 'Thị trường quốc gia về từng sản phẩm như gạo, thịt lợn.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Mức giá chung và lạm phát.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tỉ lệ thất nghiệp và cán cân thanh toán.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các điều trên.',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Kinh tế vĩ mô ít đề cập nhất đến:',
            answers: [
                {
                    answersName: 'Sự thay đổi giá cả tương đối.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Sự thay đổi mức giá chung.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Thất nghiệp.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Mức sống.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName:
                'Chỉ tiêu nào dưới đây được coi là quan trọng nhất để đánh giá thành tựu kinh tế của một quốc gia trong dài hạn?',
            answers: [
                {
                    answersName: 'Tăng trưởng GDP danh nghĩa.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tăng trưởng GDP thực tế.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tăng trưởng GDP thực tế bình quân đầu người',
                    answersStatus: '1',
                },
                {
                    answersName: 'Tăng trưởng khối lượng tư bản.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'ổng sản phẩm trong nước (GDP) là:',
            answers: [
                {
                    answersName:
                        'Tổng giá trị của tất cả các hàng hóa và dịch vụ tạo ra trên lãnh thổ một nước trong một thời kỳ nhất định',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Tổng giá trị của tất cả các hàng hoá và dịch vụ cuối cùng tạo ra trên lãnh thổ một nước trong một thời kỳ nhất định',
                    answersStatus: '1',
                },
                {
                    answersName:
                        'Tổng giá trị của tất cả các hàng hoá và dịch vụ cuối cùng do các công dân trong nước sản xuất ra trong một thời kỳ nhất định.',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Tổng giá trị của tất cả các hàng hóa và dịch vụ sản xuất ra tại một thời điểm nhất định, ví dụ ngày 31 tháng 12 năm 2009.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Tổng sản phẩm trong nước (GDP) của Việt Nam đo lường thu nhập.',
            answers: [
                {
                    answersName: 'Mà người Việt Nam tạo ra ở cả trong và ngoài nước tạo ra trên lãnh thổ Việt Nam.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Của khu vực dịch vụ trong nước.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Của khu vực sản xuất vật chất trong nước.',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Tổng sản phẩm được tạo ra trên lãnh thổ Việt Nam không kể là người Việt Nam hay người nước ngoài tạo ra',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Tổng sản phẩm quốc dân (GNP) của Việt Nam đo lường thu nhập.',
            answers: [
                {
                    answersName: 'Mà người Việt Nam tạo ra ở cả trong và ngoài nước.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Tạo ra trên lãnh thổ Việt Nam.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Của khu vực dịch vụ trong nước.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Của khu vực sản xuất vật chất trong nước.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Một ví dụ về chuyển giao thu nhập trong hệ thống tài khoản quốc gia là:',
            answers: [
                {
                    answersName: 'Tiền thuê.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Trợ cấp cho đồng bào miền Trung sau cơn bão số 6.',
                    answersStatus: '1',
                },
                {
                    answersName:
                        'Kinh phí mà nhà nước cấp cho Bộ giáo dục &amp; Đào tạo để trả lương cho cán bộ công nhân viên.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Câu 2 và 3 đúng.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName:
                'Giá trị hao mòn của nhà máy và các trang thiết bị trong quá trình sản xuất hàng hoá và dịch vụ được gọi là:',
            answers: [
                {
                    answersName: 'Tiêu dùng.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Khấu hao',
                    answersStatus: '1',
                },
                {
                    answersName: 'Đầu tư.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Hàng hoá trung gian.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: '10 Khoản mục nào sau đây được coi là đầu tư trong hệ thống tài khoản thu nhập quốc dân?',
            answers: [
                {
                    answersName:
                        'Một người thợ gốm mua một chiếc xe tải mới để chở hàng và đi dự các buổi trưng bày nghệ thuật vào cuối tuần.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Gia đình bạn mua 100 cổ phiếu trên thị trường chứng khoán.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Gia đình bạnmua một ngôi nhà 100 năm tuổi nằm trong khu di tích lịch sử được bảo vệ.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các câu trên đều đúng.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Sản phẩm trung gian có thể được định nghĩa là sản phẩm:',
            answers: [
                {
                    answersName: 'Được bán cho người sử dụng cuối cùng.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Được sử dụng để sản xuất ra hàng hóa và dịch vụ khác.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Được tính trực tiếp vào GDP.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Được mua trong năm nay, nhưng được sử dụng trong những năm sau đó.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Lợi nhuận do một công ty Việt Nam tạo ra tại Mátxcơva sẽ được tính vào:',
            answers: [
                {
                    answersName: 'Cả GDP và GNP của Việt Nam.',
                    answersStatus: '0',
                },
                {
                    answersName: 'GDP của Việt Nam và GNP của Nga',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cả GDP và GNP của Nga.',
                    answersStatus: '0',
                },
                {
                    answersName: 'GNP của Việt Nam và GDP của Nga.',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Lợi nhuận do một công ty Nhật Bản tạo ra tại Việt Nam sẽ được tính vào:',
            answers: [
                {
                    answersName: 'Cả GDP và GNP của Việt Nam.',
                    answersStatus: '0',
                },
                {
                    answersName: 'GDP của Việt Nam và GNP của Nhật Bản',
                    answersStatus: '1',
                },
                {
                    answersName: 'Cả GDP và GNP của Nhật Bản.',
                    answersStatus: '0',
                },
                {
                    answersName: 'GNP của Việt Nam và GDP của Nhật Bản.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Giả sử hãng Honda vừa xây một nhà máy mới ở Vĩnh Phúc, thì:',
            answers: [
                {
                    answersName: 'Trong tương lai, GDP của Việt Nam sẽ tăng nhanh hơn GNP.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Trong tương lai, GDP của Việt Nam sẽ tăng chậm hơn GNP.',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Trong tương lai, cả GDP và GNP của Việt Nam đều giảm vì một phần thu nhập tạo ra phải trả cho người nước ngoài.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Đã có sự tăng lên về đầu tư nước ngoài gián tiếp tại Việt Nam.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Giả sử rằng khối lượng tư bản trong năm của một nền kinh tế tăng lên. Điều gì đã xảy ra?',
            answers: [
                {
                    answersName: 'Đầu tư ròng lớn hơn tổng đầu tư.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Đầu tư ròng lớn hơn không.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Khấu hao lớn hơn đầu tư ròng.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Khấu hao mang giá trị dương.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Điều nào dưới đây không phải là cách mà các hộ gia đình sử dụng tiết kiệm của mình?',
            answers: [
                {
                    answersName: 'Cho chính phủ vay tiền.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cho người nước ngoài vay tiền.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cho các nhà đầu tư vay tiền.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Đóng thuế.',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Giá trị sản lượng của một hãng trừ đi chi phí về các sản phẩm trung gian được gọi là:',
            answers: [
                {
                    answersName: 'Xuất khẩu ròng.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Giá trị gia tăng.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Lợi nhuận.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Khấu hao',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Sự chênh lệch giữa tổng đầu tư và đầu tư ròng:',
            answers: [
                {
                    answersName: 'Giống như sự khác nhau giữa GNP và GDP.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Giống như xuất khẩu ròng.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Giống như sự khác nhau giữa GNP và NNP.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Không phải những điều trên.',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Muốn tính GNP từ GDP của một nước chúng ta phải:',
            answers: [
                {
                    answersName: 'Trừ đi chuyển giao thu nhập của chính phủ cho các hộ gia đình.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cộng với thuế gián thu',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cộng với xuất khẩu ròng.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cộng với thu nhập ròng của dân cư trong nước kiếm được ở nước ngoài.',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Muốn tính thu nhập quốc dân NI từ GNP, chúng ta phải trừ đi:',
            answers: [
                {
                    answersName: 'Khấu hao.',
                    answersStatus: '0',
                },
                {
                    answersName: 'khấu hao và thuế gián thu.',
                    answersStatus: '1',
                },
                {
                    answersName: 'Khấu hao, thuế gián thu và lợi nhuận công ty.',
                    answersStatus: '0',
                },
                {
                    answersName: 'Khấu hao, thuế gián thu, lợi nhuận công ty và đóng bảo hiểm xã hội.',
                    answersStatus: '0',
                },
            ],
        },
    ],
    [
        {
            questionsName: 'Nhu cầu là gì?',
            answers: [
                {
                    answersName: 'Là cảm giác thiếu hụt một cái gì đó mà con người cảm nhận được',
                    answersStatus: '1',
                },
                {
                    answersName: 'Là một nhu cầu đặc thù tương ứng với trình độ văn hóa và nhân cách của cá thể',
                    answersStatus: '0',
                },
                {
                    answersName: 'Là mong muốn được kèm them điều kiện có khả năng thanh toán',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các phương án trên đều đúng',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Nhu cầu của con người có đặc điểm gì?',
            answers: [
                {
                    answersName: 'Đa dạng phong phú và luôn biến đổi',
                    answersStatus: '1',
                },
                {
                    answersName: 'Đa dạng phong phú và luôn cố định',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cụ thể và luôn biến đổi',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cả a và c',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Hàng hóa là gì?',
            answers: [
                {
                    answersName:
                        'Là những thứ có thể thỏa mãn được mong muốn hay nhu cầu, yêu cầu và được cung cấp cho thị trường nhằm mục đích thỏa mãn người sản xuất',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Là những thứ có thể thỏa mãn được mong muốn hay nhu cầu, yêu cầu và được cung cấp cho thị trường nhằm mục đích thỏa mãn người tiêu dùng',
                    answersStatus: '1',
                },
                {
                    answersName: 'Cả a và b',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả đều sai',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Theo Philip Kotler thì mối quan hệ giữa nhu cầu cụ thể và hàng hóa ở mấy cấp độ?',
            answers: [
                {
                    answersName: '3',
                    answersStatus: '1',
                },
                {
                    answersName: '4',
                    answersStatus: '0',
                },
                {
                    answersName: '5',
                    answersStatus: '0',
                },
                {
                    answersName: '6',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Tìm câu trả lời sai: Mối quan hệ giữa nhu cầu cụ thể và hàng hóa đuơc thể hiện ở',
            answers: [
                {
                    answersName: 'Nhu cầu cụ thể được thỏa mãn một phần',
                    answersStatus: '0',
                },
                {
                    answersName: 'Nhu cầu cụ thể không được thỏa mãn',
                    answersStatus: '0',
                },
                {
                    answersName: 'Nhu cầu cụ thể được thỏa mãn hoàn toàn',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả diều sai',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Trao đổi là gì:',
            answers: [
                {
                    answersName: 'Là hành vi trao và nhận một thứ gì đó mà cả 2 phía mong muốn',
                    answersStatus: '1',
                },
                {
                    answersName: 'Là hành vi trao và nhận một thứ gì đó mà cả 2 không mong muốn',
                    answersStatus: '0',
                },
                {
                    answersName: 'là hành vi trao và nhận một thứ gì đó mà chỉ có 1 bên mong muốn',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cả a và c',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Để thực hiện giao dịch người ta cần các điều kiện nào',
            answers: [
                {
                    answersName: 'Hai vật có giá trị',
                    answersStatus: '0',
                },
                {
                    answersName: 'Thỏa thuận các điều kiện giao dịch',
                    answersStatus: '0',
                },
                {
                    answersName: 'Thời gian và địa điểm được thỏa thuận',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các phương án trên',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Thị trường là gì?',
            answers: [
                {
                    answersName: 'Là một tập hợp những người mua hàng hiện có và sẽ có',
                    answersStatus: '1',
                },
                {
                    answersName: 'Là một tập hợp những người bán hàng hiện có và sẽ có',
                    answersStatus: '0',
                },
                {
                    answersName: 'Là một tập hợp những người sản xuất hiện có và sẽ có',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các phương án trên',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Marketing là?',
            answers: [
                {
                    answersName: 'Là hoạt động của con người nhằm thỏa mãn các nhu cầu thông qua trao đổi',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Là một quá trình mà ở đó cấu trúc nhu cầu về hàng hóa và dịch vụ được dự đoán và được thỏa mãn thông qua một quá trình bao gồn nhận thức thúc đẩy và phân phối',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Là sự dự đoán, sự quản lý, sự điều chỉnh và sự thỏa mãn nhu cầu thông qua quá trình trao đổi',
                    answersStatus: '1',
                },
                {
                    answersName: 'Tất cả đều đúng',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Quản lý Marketing là?',
            answers: [
                {
                    answersName: 'Là một quá trình phân tích xây dựng, thực hiện và kiểm tra',
                    answersStatus: '1',
                },
                {
                    answersName: 'Là một quá trình quản lý và kiểm tra',
                    answersStatus: '0',
                },
                {
                    answersName: 'Là một quá trình phân tích, quản lý và kiểm tra',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cả a và b',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'ND của quản lý marketing gồm',
            answers: [
                {
                    answersName: 'Quản lý hiện trạng cầu',
                    answersStatus: '1',
                },
                {
                    answersName: 'Quản lý các loại hình chiến lược và hẹ thống marketing hỗn hợp',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niêm quản lý Marketing',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các phương án trên',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName:
                'Theo Philip Kotler có mấy quan niệm cơ bản tạo cơ sở cho quá trình quản lý Marketing ở các doanh nghiệpTheo Philip Kotler có mấy quan niệm cơ bản tạo cơ sở cho quá trình quản lý Marketing ở các doanh nghiệp',
            answers: [
                {
                    answersName: '3',
                    answersStatus: '0',
                },
                {
                    answersName: '4',
                    answersStatus: '0',
                },
                {
                    answersName: '5',
                    answersStatus: '1',
                },
                {
                    answersName: '6',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName:
                'Theo Philip Kotler quan niệm cơ bản tạo cơ sở cho quá trình quản lý Marketing ở các doanh nghiệp gồm:',
            answers: [
                {
                    answersName: 'Hoàn thiện SX và hàng hóa',
                    answersStatus: '0',
                },
                {
                    answersName: 'Gia tăng nỗ lục TM',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niệm Marketing và quan niệm marketing đạo đức xã hội',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các phương án trên',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName:
                'Người Mỹ có câu ngạn ngữ vui “Nếu hoàn thiện được chiếc bẫy chuột thì trời đã tối” câu ngạn ngữ này muốn nói đến quan niệm nào?',
            answers: [
                {
                    answersName: 'Quan niệm Marketing',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niệm hoàn thiện SX',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niện gia tăng nỗ lực TM',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niệm hoàn thiện hàng hóa',
                    answersStatus: '1',
                },
            ],
        },
        {
            questionsName: 'Giải pháp hoàn thiện sản xuất bao gồm',
            answers: [
                {
                    answersName: 'Giải pháp về công nghệ',
                    answersStatus: '1',
                },
                {
                    answersName: 'Về quản lý',
                    answersStatus: '0',
                },
                {
                    answersName: 'Nâng cao kỹ năng của người lao động',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cả a, b, c',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName:
                '“Chỉ bán cái mà khách hàng cần chứ không bán cái doanh nghiệp có” doanh nghiệp đã vận dụng quan niệm nào?',
            answers: [
                {
                    answersName: 'Quan niệm hoàn thiện sản phẩm',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niệm gia tăng nỗ lực thương mại',
                    answersStatus: '0',
                },
                {
                    answersName: 'Quan niệm marketing',
                    answersStatus: '1',
                },
                {
                    answersName: 'Quan niệm hoàn thiện sản phẩm',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Quan niệm Marketing đạo đức Xã hội cần phải cân bằng mấy yếu tố',
            answers: [
                {
                    answersName: '2',
                    answersStatus: '0',
                },
                {
                    answersName: '3',
                    answersStatus: '1',
                },
                {
                    answersName: '4',
                    answersStatus: '0',
                },
                {
                    answersName: '5',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Xét ở góc độ Marketing theo Philip Kotler có những loại nhu cầu nào?',
            answers: [
                {
                    answersName: 'Cầu tiêu cực, cầu tiềm năng, cầu đầy đủ',
                    answersStatus: '0',
                },
                {
                    answersName: 'Cầu quá thừa, cầu suy giảm và cầu thất thường',
                    answersStatus: '1',
                },
                {
                    answersName: 'Không có cầu và nhu cầu có hại',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả các phương án trên',
                    answersStatus: '0',
                },
            ],
        },
        {
            questionsName: 'Chiến lược Marketing được hiểu là?',
            answers: [
                {
                    answersName:
                        'Một hệ thống các quyết định kinh doanh mang tính dài hạn mà doanh nghiệp cần thực hiện nhằm đạt tới các mục tiêu đặt ra',
                    answersStatus: '1',
                },
                {
                    answersName:
                        'Một hệ thống các quyết định kinh doanh mang tính ngắn hạn mà doanh nghiệp cần thực hiện nhằm đạt tới các mục tiêu đã đặt ra',
                    answersStatus: '0',
                },
                {
                    answersName:
                        'Một hệ thống các quyết định kinh doanh mang tính ngắn hạn và dài hạn mà doanh nghiệp cần thực hiện nhằm đạt tới các mục tiêu đã đề ra',
                    answersStatus: '0',
                },
                {
                    answersName: 'Tất cả đều sai',
                    answersStatus: '0',
                },
            ],
        },
    ],
]
