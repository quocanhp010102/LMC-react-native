import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import Paging from '../../components/Paging'
import { ExamService } from '../../services/ExamService'
import { ExamHistory } from '../../types/Exam'
import { fomatDate } from './../fomartDate'
import { ContextLayout } from '../../layout/Layout'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { StudentService } from '../../services/StudentService'
import { Student } from '../../types'

function CourseTeacherDetailStudentContainer() {
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any | null>(searchParams.get('page') || 1)
    const [total, setTotal] = useState<number>(1)
    const [exams, setExam] = useState<ExamHistory[]>([])
    const [student, setStudent] = useState<Student>();

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(null)
        getStudent();
    }, [])

    

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(page)
        }
    }, [searchParams])

    useEffect(() => {
        getExams(currenPage);
    }, [currenPage])
    
    const getExams = async (page)=> {
        const data: any = await ExamService.getExamsByCourse_Student(params.idStudent, params.idCourse, {page: page - 1, size: 10, sort: "id,desc"})
        setTotal(data.totalElements)
        setExam(data.content)
    }

    const getStudent = async ()=> {
        const student:Student = await StudentService.getStudentDetail(params.idStudent);
        setStudent(student);
    }


    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className="w-full h-auto">
            {/* Thanh tiêu đề */}
            <div className="flex mt-[29px] mb-[25px] ml-[18px] items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-[20px] text-[#636363] font-[700]">Quay lại</span>
            </div>

            <div className="mb-[29px] flex flex-row w-full justify-between items-center relative">
                <div className="ml-[18px]">
                    <h1 className="text-[28px] font-[700] text-blue_bg"> HỌC VIÊN: {student?.student_fullname}</h1>
                </div>
            </div>

            <div className="w-full">
                <table className="manager_table w-full text-center border-2 border-solid border-[#6363631a]">
                    <thead className="uppercase text-[18px] font-[700]">
                        <tr>
                            <td className="w-[5%]">STT</td>
                            <td className="w-auto">Tên bài thi</td>
                            <td className="w-[14%]">Ngày nộp bài</td>
                            <td className="w-[17%]">Trạng thái</td>
                            <td className="w-[14%]">Xem bài thi </td>
                            <td className="w-[19%]">Điểm</td>
                        </tr>
                    </thead>
                    <tbody className="text-[18px] font-[500]">
                        {exams.length > 0 ? (
                            exams.map((value: ExamHistory, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{(10)*(currenPage - 1) + index + 1}</td>
                                        <td>{value?.examsName}</td>

                                        <td>{fomatDate(value.examsDateSubmit)}</td>

                                        <td>{!value?.examsPoint ? 'Chưa chấm' : 'Đã Chấm'}</td>

                                        <td>
                                         

                                                {value.typeOfExams === 1 ? (
                                                    <EyeInvisibleOutlined size={32} />
                                                 ) : (
                                                     <Link
                                                     to={`/student-exam/detail/${value?.courseId}/${value?.examsId}/${params.idStudent}`}
                                                     >
                                                       <EyeOutlined size={32} />
                                                     </Link>
                                                 )
                                            }
                                        </td>
                                        <td>{value?.examsPoint ? value?.examsPoint : 'Chưa có điểm'}</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr key={-1}>
                                <td colSpan={6}>Sinh viên chưa nộp bài thi nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={Math.ceil(total / 10)} />}
            </div>
        </div>
    )
}

export default CourseTeacherDetailStudentContainer
