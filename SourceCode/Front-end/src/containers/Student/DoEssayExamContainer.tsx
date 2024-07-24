import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserService from '../../services/UserService'
import { Course, LECTURER, STUDENT } from '../../types'
import { ExamService } from '../../services/ExamService'
import { ContextLayout } from '../../layout/Layout'
import { Exam } from '../../types/Exam'
import { UploadService } from './../../services/UploadService'
import { ContextMessage } from '../../Context/ShowMessage'
import ModalContext, { ContextModal } from '../../Context/ModalContext'
import DialogConfirm from '../common/DialogConfirm'

type Files = {
    file: File | null
}

type ExamBT = {
    id: string | number
    examName: string
    questions: [
        {
            id?: string | number
            questionsName: string | null
            questionsFile: string | null
        },
    ]
    examsHistoryAnswer: string | null
    examsHistoryFileAnswer: string | null
    typeOfExams: {
        id: 1 | 2
    }
}

type ExamCookie = {
    currenTime: number
    answer: string
    idExam: string
}

function DoEssayExamContainer() {
    const [fileUpload, setUploadFile] = useState<File | null>(null)

    const onChangeFile = (files: FileList | null) => {
        if(files[0].size > 100000000) {
            pushMessage({
                title: "Cảnh bảo",
                message: "Tệp bài làm không quá 100MB",
                type: "WARN"
            })
        }else {
            setUploadFile(files[0])
        }
    }
    const navigate = useNavigate()
    const [exam, setExam] = useState<ExamBT>()
    const [course, setCourse] = useState<Course>()

    const [isDoExam, setDoExam] = useState<boolean>(true)

    const [time, setTime] = useState<number>(-3000);
    const [timeCloseExam, setTimeCloseExam] = useState<number>(60 * 60 * 1000);
    const [isCloseExam, setIsCloseExam] = useState<boolean>(true);
    const {setModal, showModal} = useContext(ContextModal);

    const [timeExam, setTimeExam] = useState<{
        minute: string
        second: string
    }>({
        minute: '-1',
        second: '-1',
    })

    const params = useParams()
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const { pushMessage } = useContext(ContextMessage)

    useEffect(()=> {
        if(params.id) {
            ;(async ()=> {
                const data:Exam = await ExamService.getExamById(params.id);
                setCourse(data.course);
                let exmCo 
                if(localStorage.getItem('exam')) {
                    exmCo = JSON.parse(localStorage.getItem('exam'));
                }
        
                setExam({
                    ...exam,
                    examName: data.examName,
                    id: data.id,
                    questions: [
                        {
                            id: data.questions[0]?.id,
                            questionsName: data.questions[0]?.questionsName,
                            questionsFile: data.questions[0]?.questionsFile,
                        },
                    ],
                    typeOfExams: {
                        id: data.typeOfExams.id,
                    },
                    examsHistoryAnswer: exmCo ? (+exmCo.id === +data?.id ? exmCo.value : "") : null,
                    examsHistoryFileAnswer: null
                });

                const timeClose = Date.now() - new Date(data.examOpenTime).getTime();
                if(timeClose - (+data?.examLimittedWorkingTime*1000*60) > 0) {
                  
                   pushMessage({
                       title: "Cảnh báo",
                       type: "WARN",
                       message: "Hết giờ làm bài thi"
                   })
                   setDoExam(false);
                    }else {
                        const  currentTime = +data?.examLimittedWorkingTime*1000*60 - timeClose;
                        console.log(currentTime)
            
                        setDoExam(true);
                        setTime(currentTime);
                        const timeCloseExamCurrent = new Date(data.examCloseTime).getTime() - new Date(data.examOpenTime).getTime() - currentTime
                        setTimeCloseExam(timeCloseExamCurrent)
                    }
                
            })()
        }

        AttachChidrenSideRight(null)
    }, [params.id])



    useEffect(()=> {
       
        let timeOutExam:any
      
      if(time > -2000) {
        timeOutExam  = setInterval(()=> {
              const currenTime = time;
            
              const second = Math.ceil(currenTime/1000);
              const minutes = Math.floor(second / 60);
              setTimeExam({
                  minute:`${minutes}`.length === 1 ? `00${minutes}`.slice(-2) : `${minutes}`,
                  second: `00${second - +minutes*60}`.slice(-2)
              })          
                  setTime(currenTime - 1000);
                 
                  if(+second === 0 && +minutes === 0) {
                     clearInterval(timeOutExam);
                     setTime(-2000);
                     setDoExam(false);
                     pushMessage({
                         title: "Cảnh báo",
                         type: "WARN",
                         message: "Hết giờ làm bài thi, vui lòng nộp bài thi"
                     })
                  }  
          }, 1000)    

      }
        
        return ()=> {
            clearInterval(timeOutExam);
        }
    }, [time])

    useEffect(() => {
        const timeout = setInterval(() => {
            const currentTimeClose = timeCloseExam
            if (currentTimeClose <= 0) {
                pushMessage({
                    title: 'Cảnh báo',
                    type: 'WARN',
                    message: 'Bài thi đã đóng',
                })
                setIsCloseExam(false)
                localStorage.removeItem("exam")
                navigate(`/faculty/courseView/${course?.id}`)
            }

            setTimeCloseExam(currentTimeClose - 1000)
        }, 1000)

        return () => {
            clearInterval(timeout)
        }
    }, [timeCloseExam])


    
    
    const SubmitForm = async (event:FormEvent<HTMLFormElement>)=> {
        event.preventDefault();
            let url: string = "";
            if(fileUpload) {
                const formData =  new FormData();
                formData.append('file', fileUpload)
                 url = await UploadService.uploadFile(formData);
            }
        ExamService.postExamByStudent({
            ...exam,
            examsHistoryFileAnswer: url,
        })
            .then((data) => {
                document.cookie = `exam=; expires=${Date.now() - 10000}; path=/;`

          localStorage.removeItem("exam")

            navigate(`/faculty/courseView/${course?.id}`)
            pushMessage({
                type: "SUCCESS",
                title: "Thành công",
                message:"Nộp bài thi thành công"
            })
            showModal(false);
        }).catch((error) => {
                pushMessage({
                    type: 'ERROR',
                    title: 'Thất bại',
                    message: 'Nộp bài thi thất bại',
                })
                showModal(false);
            })
    }
    

    const changeValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setExam({
            ...exam,
            examsHistoryAnswer: event.target.value,
        })
        const examCo = {
            id: params.id,
            value: event.target.value,
        }

       localStorage.setItem('exam', JSON.stringify(examCo))
    }



    const deleteFileName = () => {
        setUploadFile(null)
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <form onSubmit={SubmitForm} className="w-full">
        
            <div className="w-[92%] h-auto mx-[3%] mt-[2%] mb-[2%] py-[2%] px-[3%] border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                <b className="text-[40px] text-primary_blue">{course?.courseName}</b>
                <p className="text-[14px] font-medium">
                  <Link to="/faculty" className='text-color63'>{UserService.hasRole([LECTURER]) ? "Trung tâm kiểm soát" : "Khóa học của tôi"}</Link>  / <Link to={`/faculty/courseView/${course?.id}`}  className='text-color63'>{course?.courseName}</Link> 
                </p>
            </div>
            <div className="w-[92%] h-auto flex items-center justify-between mx-[3%] mt-[2%] mb-[2%] py-[2%] px-[3%] border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                <p className="text-[36px] font-medium text-primary_blue">{exam?.examName}</p>
                <div className="text-xl">
                    {+timeExam.minute >= 0 && (
                        <p>
                            {timeExam.minute}:{timeExam.second}
                        </p>
                    )}
                </div>
            </div>
            <div className="w-[92%] h-auto mx-[3%] mt-[2%] mb-[2%] py-[1%] px-[3%] border-solid border-2 border-[#D4D4D4] rounded-[10px] ">
                <div className="w-[100%] h-auto mx-[1%] mt-[1%] mb-[1%] py-[1%] px-[1%]">
                    {exam &&
                        (exam?.questions[0]?.questionsName !== null ? (
                            <div dangerouslySetInnerHTML={{ __html: exam?.questions[0]?.questionsName }}></div>
                        ) : (
                            <a
                                href={`${exam?.questions[0].questionsFile}`}
                                className="text-[#03a9f4] font-normal text-xl underline"
                                target="_blank"
                            >
                                Link bài thi {exam?.examName}
                            </a>
                        ))}

                    <textarea
                        rows={30}
                        readOnly={!isDoExam}
                        value={exam?.examsHistoryAnswer || ''}
                        onChange={changeValue}
                        className="mt-[1%] w-[100%] h-auto py-[2%] px-[2%] outline-none border-solid border-2 border-[#D4D4D4] rounded-[10px]"
                    ></textarea>
                </div>

                <div className="w-[100%] h-auto mx-[1%] mt-[1%] mb-[1%] py-[1%] px-[1%]">
                    <div className="mt-[1%] h-auto py-[2%] px-[2%] border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                        <p className="text-2xl text-[#636363] font-medium">Tải lên bài làm</p>
                        <div className="mt-[1%] flex items-center">
                            <input
                                id="load-file-exam"
                                type="file"
                                onChange={(event) => onChangeFile(event.target.files)}
                                hidden
                            />

                            <label
                                className="h-[50px] justify-center flex items-center  w-[129px] bg-[#93939313] border-solid button border-borderColor border-2 rounded-[5px]"
                                htmlFor="load-file-exam"
                            >
                              <img src="\img\PathUpload.png" className='w-[20px] h-[20px]' alt="upload file" />{' '}
                                <span className="ml-1 text-lg font-medium text-primary">Tải lên</span>
                            </label>

                            <span className="ml-[1%]">Tải lên bài làm có sẵn trong máy ( Tối đa 100mb)</span>
                        </div>
                        {fileUpload ? (
                            <div className="p-3  w-auto max-w-[50%] mt-6 max-h-[43px] flex justify-between items-center border-[1px] border-solid border-[#D0D0D0] rounded-md ">
                                <p className="text-[10px]">{fileUpload.name}</p>{' '}
                                <span className="cursor-pointer" onClick={deleteFileName}>
                                    <img src="\img\delete_file.png" />
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>

                {/*Tải file bài tập lên*/}
                {/*Nút Tải file bài tập lên*/}

                <div className="w-auto h-auto mt-[1%]">
                    <div className="flex justify-end mt-[2%]">
                        <button
                            type="reset"
                            onClick={goBack}
                            className="px-[1.5%] py-[1%] bg-[#ffffff] border-solid text-primary border-text_light_blue border-2 rounded-[10px]"
                        >
                            Quay lại
                        </button>
                        <button
                            disabled={!isCloseExam}
                            type="submit"
                            className="px-[1.5%] py-[1%] ml-[1%] bg-text_light_blue text-[#ffffff] rounded-[10px]"
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}


export default DoEssayExamContainer
