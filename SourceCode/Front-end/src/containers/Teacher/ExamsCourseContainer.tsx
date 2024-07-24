import { EyeOutlined } from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import Paging from '../../components/Paging'
import { ContextLayout } from '../../layout/Layout'
import { ExamService } from '../../services/ExamService'

type ExamOfCourse = {
    id: string | number
    questions: any[]
    typeOfExams: []
    examTotalStudentSubmitted: string | number
    examTotalStudent: string | number
    examStatus: string | number
    examPercentageSubmitted: string | number
    examOpenTime: string
    examName: string
    examLimittedWorkingTime: string
    examCloseTime: string
    examTotalIsNotGraded: number
    course: any[]
}

type Data = {
    totalElements: number
    content: ExamOfCourse[]
}

function ExamsCourseContainer() {
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any | null>(searchParams.get('page') || 1)

    const [exams, setExams] = useState<ExamOfCourse[]>([])
    const [total, setTotal] = useState<number>(1)

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(null)
    }, [])



    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        getExam(currenPage)
    }, [currenPage])

    useEffect(() => {
        if (searchParams.get('page')) {
            const page = searchParams.get('page')
            setCurrentPage(page)
        }
    }, [searchParams])

    const getExam = async (page: number) => {
        const data: Data = await ExamService.getExamsByCourse(params.courseId, {
            page: page - 1,
            size: 5,
            sort: "id,desc"
        })
     
        setExams(data.content)
        setTotal(data.totalElements)
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className="w-full h-auto p-[24px]">
            {/* Thanh tiêu đề */}
            <div className="flex m-6  items-center cursor-pointer" onClick={goBack}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>

            <div className="flex flex-row w-full pl-2 mb-10 justify-between items-center">
                <div className="w-6/12">
                    <div className="pr-[25%] text-primary_blue">
                        <b className="text-[28px] font-bold"> Danh sách các bài thi đã tạo</b>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <table className="manager_table w-full text-center rounded-lg border-[1px] border-solid border-[#6363631a]">
                    <thead>
                        <tr className="uppercase text-lg font-bold py-12">
                            <td>STT</td>

                            <td>Tên bài thi</td>
                            <td>Số lượng học viên nộp bài</td>

                            <td>chấm bài</td>
                            <td>Số bài thi đã chấm</td>
                            <td>Xem điểm</td>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam, index) => {
                            return (
                                <tr key={index}>
                                    <td>{(6)*(currenPage - 1) + index + 1}</td>
                                    <td>{exam?.examName}</td>

                                    <td>
                                        {exam?.examTotalStudentSubmitted ? exam?.examTotalStudentSubmitted : 0 }/{exam?.examTotalStudent ? exam?.examTotalStudent : 0}
                                    </td>

                                    <td>
                                        {+exam?.examStatus === 0 && exam?.examTotalStudentSubmitted > 0 && (
                                            <Link to={`/student-view-exam/${exam.id}/${params.courseId}`}>
                                                <img
                                                    className="block m-auto"
                                                    src="/img/exam.png"
                                                    alt="button chấm điểm"
                                                />
                                            </Link>
                                        )}
                                        {+exam?.examStatus === 1 && 'Đã chấm'}

                                        {+exam?.examStatus === 0 &&
                                            +exam?.examTotalStudentSubmitted === 0 &&
                                            'Chưa có sinh viên nộp bài'}
                                    </td>
                                    <td>{`${+exam?.examTotalStudentSubmitted - +exam?.examTotalIsNotGraded}/${
                                        exam?.examTotalStudentSubmitted ? exam?.examTotalStudentSubmitted : 0
                                    }`}</td>
                                    <td>
                                        <Link to={`/teacher-course/view-scores/${exam.id}`}>
                                           
                                                  <EyeOutlined size={32} />
                                            
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {<Paging currenPage={currenPage} setCurrentPage={setCurrentPage} total={Math.ceil(total / 6)} />}
            </div>
        </div>
    )
}

export default ExamsCourseContainer
