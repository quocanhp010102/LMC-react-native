import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import { CheckOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import Paging from '../../components/Paging'
import { ExamService } from '../../services/ExamService'
import { Student } from '../../types'
import { Exam, ExamHistory } from '../../types/Exam'
import { ContextLayout } from '../../layout/Layout'
import { StudentService } from './../../services/StudentService/StudentServices'

function ViewScoresExam() {
    const [searchParams] = useSearchParams()
    const [currenPage, setCurrentPage] = useState<any | null>(searchParams.get('page') || 1)
    const [total, setTotal] = useState<number>(1)
    const [student, setStudent] = useState<Student>(null)
    const [listScores, setListScores] = useState<any[]>([])
    const [exam, setExam] = useState<Exam>()

    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(null)

        ;(async () => {
            const data: Exam = await ExamService.getExamById(params.id)
            setExam(data)
        })()
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
        getScores(currenPage)
    }, [currenPage])

    const getScores = async (page: any) => {
        const data: any = await ExamService.getScoresExam(params.id, {
            page: page - 1,
            size: 10,
            sort: 'student_fullname,asc',
        })
        setTotal(data.totalElements)
        setListScores(data.content)
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
                        <b className="text-[28px] font-bold"> Bài thi: {exam?.examName}</b>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <table className="manager_table w-full text-center rounded-lg border-[1px] border-solid border-[#6363631a]">
                    <thead>
                        <tr className="uppercase text-lg font-bold py-12">
                            <td>STT</td>
                            <td>Mã Sinh viên</td>

                            <td>Tên sinh viên</td>
                            <td>Điểm số</td>                         
                            <td>Xem bài thi</td>                           
                        </tr>
                    </thead>
                    <tbody>
                        {listScores.length > 0 ? (
                            listScores.map((value: any, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{(10)*(currenPage - 1) + index + 1}</td>
                                        <td>{value?.code}</td>

                                        <td>{value.fullname}</td>

                                        <td>{value?.point}</td>

                                        {
                                exam?.typeOfExams.id === 2 ? (
                                        <td>
                                            {value?.point === 'Chưa thi' ? (
                                               <EyeInvisibleOutlined size={32} />
                                            ) : (
                                                <Link
                                                    to={`/student-exam/detail/${exam?.course.id}/${params.id}/${value.id}`}
                                                >
                                                  <EyeOutlined size={32} />
                                                </Link>
                                            )}
                                        </td>

                                ): <td>  <EyeInvisibleOutlined size={32} /></td>
                            }

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

export default ViewScoresExam
