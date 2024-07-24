import { useContext, useEffect, useState } from 'react'
import { ContextLayout } from './../../layout/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ExamService } from '../../services/ExamService'
import UserService from './../../services/UserService'
// import { Lecturer } from './../../../../../../../../Node/LMS_backend/User/src/Models/Lecturer';
import { ADMIN, Course, LECTURER, Student, STUDENT } from '../../types'
import { StudentService } from './../../services/StudentService'
import ListMemberCourseContainer from './../common/ListMemberCourseContainer'
import { CourseService } from './../../services/CourseService'
import { Exam, ExamHistory } from '../../types/Exam'
import { ChangeEvent } from 'react'
import { ContextMessage } from './../../Context/ShowMessage'
import { NewsService } from './../../services/NewsService'
import { FileImageOutlined, FileProtectOutlined } from '@ant-design/icons'
import Loading from '../../components/Loading'
type HasPoint = {
    id?: string | number,
    point: string,
}

function EssayExamContainer() {
    // flex flex-row justify-between items-center
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const [exam, setExam] = useState<ExamHistory>()
    const [course, setCourse] = useState<Course>(JSON.parse(localStorage.getItem('students')) || null)
    const navigate = useNavigate()
    const [currentStudent, setCurrentStudent] = useState<string | number>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { pushMessage } = useContext(ContextMessage)
    const [isMatch, setIsMatch] = useState(true);
    const params = useParams()

    useEffect(() => {
        return () => {
            localStorage.removeItem('students')
        }
    }, [])

    useEffect(() => {
        if (!course) {
            ;(async () => {
                const data: Course = await CourseService.getCourseById(params.courseId)
                const pointStudents = await ExamService.getScoresExam(params.examId);
                data.courseStudents.forEach((studentCourse, ix)=> {
                    let index  = -1;
                    pointStudents.content.forEach((student, i) => {
                        if(studentCourse.student.id === student.id) {
                            studentCourse.point = student.point
                            index = i

                        }
                    })

                    if(index !== -1) {
                        pointStudents.content.splice(index, 1);
                    }
                })

            
                localStorage.setItem('students', JSON.stringify(data))

                setCourse(data)
            })()
        } else {
            setCourse(JSON.parse(localStorage.getItem('students')))
        }

        if (params.examId && params.courseId) {
            if (!params.studentId) {
                getExamRandom()
            } else {
                getExamByStudent(params.studentId)
            }
        }
    }, [params])




  


    const getExamByStudent = (idStudent:any) => {
        setCurrentStudent(idStudent);
        setIsLoading(true);
    
        ExamService.getExamByStudent(idStudent, params.examId).then((data )=> {
            setExam(data);
            setIsMatch(true);
            NewsService.postNewToHistory({
                method: "GET",
                name: data.exams.examName 
             })
             setIsLoading(false);
        }).catch((error)=> {
            setIsLoading(false);
            const student = course?.courseStudents.find(student => student?.student.id === +idStudent);
      
            setIsMatch(false);
            pushMessage({
                title: "Thất bại",
                message: `Sinh viên ${student?.student.student_fullname} chưa nộp bài`,
                type: "ERROR"
            })
           

                setExam({
                    ...exam,
                    examsHistoryAnswer: null,
                    examsHistoryFileAnswer: null,
                    examsHistoryPoint: null,
                })
            })
    }

    const goToExamStudent = (idStudent: any) => {
        navigate(`/student-exam/detail/${course?.id}/${params.examId}/${idStudent}`)
    }


    const getExamRandom =  ()=> {
        setIsLoading(true);
    ExamService.getExamRandom(params.examId).then((data) => {
        setExam(data);
        setIsMatch(true);
        setCurrentStudent(data?.student.id);
        NewsService.postNewToHistory({
            method: "GET",
            name: data.exams.examName
         })
         setIsLoading(false);
    }).catch((error)=> {
        setIsLoading(false);
        const er = error.response;
    
        if(er?.data?.title.toUpperCase() === "NO CONTENT") {
            pushMessage({
                title: "Thành công",
                type: "SUCCESS",
                message: "Đã chấm bài kiểm tra"
            })
            navigate(-1);

        }else {
            pushMessage({
                title: "Thất bại",
                type: "ERROR",
                message: "Lỗi hệ thống"
            }) 
        }
    });
    }

    const makingExam = () => {
        if(exam.examsHistoryPoint !== null && exam.examsHistoryPoint !== "") {
            ExamService.markingExam(exam.id, {
                id: exam.id,
                examsHistoryTeacherComment: null,
                examsHistoryAnswer: exam.examsHistoryAnswer,
                examsHistoryPoint: exam.examsHistoryPoint,
                examsHistorySubmissionTime: exam.examsHistorySubmissionTime,
                examsHistoryStatus: exam.examsHistoryStatus,
                examsHistoryFileAnswer: exam.examsHistoryFileAnswer,
                exams: {
                    id: exam.exams.id,
                },
                student: {
                    id: exam.student.id,
                },
            })
                .then(() => {
                    const newCourses= course;
                    newCourses.courseStudents.forEach((student) => {
                        if(student.student.id === exam.student.id) {
                            student.point = exam.examsHistoryPoint;
                        }
                    });

                    setCourse({...newCourses});
                    localStorage.setItem('students', JSON.stringify(newCourses))

                    getExamRandom()
                })
                .catch(() => {
                    pushMessage({
                        title: 'Thất bại',
                        type: 'ERROR',
                        message: 'Lỗi hệ thống',
                    })
                })
        }else {
            pushMessage({
                title: 'Cảnh báo',
                type: 'WARN',
                message: 'Bạn chưa nhập điểm!',
            })
        }
    }

    useEffect(() => {
      
        AttachChidrenSideRight(
            <ListMemberCourseContainer
                onClick={goToExamStudent}
                currentStudent={+currentStudent}
                students={course?.courseStudents}
                lecturer={course?.lecturer}
                total={course?.courseTotalStudent}
            />,
        )
    }, [currentStudent, course])


    const handleEnterPoint = (event: ChangeEvent<HTMLInputElement>) => {

        if(event.currentTarget.value === "" || (event.currentTarget.value.match('^[0-9].*$')  && !event.currentTarget.value.startsWith("00"))) {
            if(+event.currentTarget.value <= 100 && +event.currentTarget.value >=0)
            setExam({
                ...exam,
                examsHistoryPoint: event.currentTarget.value.startsWith("0") &&  !event.currentTarget.value.includes(".") ? event.currentTarget.value.length == 2 ? event.currentTarget.value.slice(-1).trimEnd() : event.currentTarget.value.slice(-2).trimEnd() : event.currentTarget.value.trimEnd(),
            })

        }

    }


    const goBack = ()=> {
        navigate(-1);

    }

    

    return (
        <div className="w-full px-[3%]">
            <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>

            <div className="h-auto   mt-[2%] mb-[2%] px-[3%] py-[2%] text border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                <b className="text-[40px] text-primary_blue">{course?.courseName}</b>
                <p className="text-[14px] font-medium">
                  <Link to="/faculty" className='text-color63'>{UserService.hasRole([LECTURER]) ? "Trung tâm kiểm soát" : "Khóa học của tôi"}</Link>  / <Link to={`/faculty/courseView/${course?.id}`}  className='text-color63'>{course?.courseName}</Link> 
                </p>
            </div>
            <div className=" h-auto  mt-[2%] mb-[2%] py-[2%] px-[3%] text border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                {
                    isLoading ? <div className='flex justify-center items-center'> 
                        <Loading />
                    </div>: (
                        <p className="text-[36px] font-medium text-text_light_blue">{exam?.exams?.examName}</p>
                    )
                }
            </div>
            <div className="w-[100%] border-solid border-2 border-[#D4D4D4] rounded-[10px] h-auto p-[24px] mt-[2%] mb-[2%] py-[1%]">
                <div className="w-[100%] h-auto  mt-[1%] mb-[1%py] -[1%]">
                <div dangerouslySetInnerHTML={{ __html: exam?.exams?.questions[0]?.questionsName }}></div>
                    {
                        isLoading ? (
                            <div>
                                    <Loading/>
                            </div>

                        ) : (                    
                        exam?.examsHistoryAnswer !== null && exam?.examsHistoryAnswer !== '' ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: exam?.examsHistoryAnswer,
                                }}
                                className="mt-[1%] w-[100%] outline-none h-auto py-[2%] px-[2%] border-solid border-2 border-[#D4D4D4] rounded-[10px]"
                            ></div>) : (
                                exam?.examsHistoryFileAnswer !== null && exam?.examsHistoryFileAnswer !== '' && (
                                            <div className="w-[100%] h-auto mt-[1%] mb-[1%] py-[1%]">
                                                <div className="mt-[1%] w-[100%]  h-auto py-[2%] px-[2%] border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                                                    <p className="text-[36px] text-text_light_blue font-medium">Tệp bài làm của sinh viên</p>
                                                    <div>
                                                        <a
                                                            className="text-[#03a9f4] w-[200px] hover:underline text-lg"
                                                            href={exam?.examsHistoryFileAnswer}
                                                            target="_blank"
                                                        >
                                                           {exam?.examsHistoryFileAnswer}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                         
                            )
                            
                            

                            
                        )
                    }
                </div>


                {/*Nhận xét của giáo viên*/}
                <div className="w-[100%] h-auto  mt-[1%] mb-[1%] py-[1%]">
                    <div className="mt-[1%] w-[100%]  h-auto py-[2%] px-[2%] border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                        <div className="w-auto h-auto mt-[3%]">
                            <div className=" flex justify-end items-baseline">
                                <p className="text-[24px]  font-[500] text-[#636363] mr-3"> ĐIỂM:</p>
                                {UserService.hasRole([STUDENT]) && (
                                    <p className="text-[36px] font-bold text-[#FF0000] h-auto">
                                        {exam?.examsHistoryPoint}
                                    </p>
                                )}
                                {UserService.hasRole([LECTURER]) && (
                                    <input
                                        type="text"
                                        value={exam?.examsHistoryPoint || ''}
                                        onChange={handleEnterPoint}
                                        placeholder="50"
                                        readOnly={!isMatch}
                                        className="w-[100px] max-w-[130px] text-center text-[36px] text-[#FF0000] outline-none"
                                    />
                                )}
                                <p className="text-[24px] ml-2 font-[500] text-[#030303]">/100</p>
                            </div>
                            {UserService.hasRole([LECTURER]) && (
                                <div className="flex justify-end mt-[2%]">
                                    <button
                                        onClick={makingExam}
                                        className="px-[1.5%] py-[1%] ml-[1%] bg-primary_blue text-[#ffffff] rounded-[10px]"
                                    >
                                        Chấm bài
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EssayExamContainer
