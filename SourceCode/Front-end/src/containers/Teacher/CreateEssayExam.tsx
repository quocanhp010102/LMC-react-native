import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ContextLayout } from '../../layout/Layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TextEditor from '../../components/TextEditor';
import { UploadService } from '../../services/UploadService';
import { ExamService } from '../../services/ExamService';
import { ContextMessage } from '../../Context/ShowMessage';
import { FileProtectOutlined } from '@ant-design/icons';
import { NewsService } from '../../services/NewsService';
import { CourseService } from './../../services/CourseService';
import { ContextModal } from '../../Context/ModalContext';
import { TemplateEssayExam } from '../../components/TemplateEssayExam';
import MultipleChoiceQuestionBank from './../Manager/MultipleChoiceQuestionBankModal';

type Files = {
    file: File | null
}

type Exam = {
    id?: string | number
    examName: string
    examOpenTime: string | null
    examCloseTime: string | null
    examLimittedWorkingTime: string
    questions: [
        {
            questionsName: string | null
            questionsFile: string | null
        },
    ]
    course: {
        id: string
    }
    typeOfExams: {
        id: 1 | 2
    }
}

function CreateEssayExam() {
    const [fileUpload, setUploadFile] = useState<File | null>(null)
    const [typeExam, setTypeExam] = useState<number>(1);
    const [contentExam, setContenExam] = useState<string>("");
    const {pushMessage} = useContext(ContextMessage);
    const [isEditExam, setIsEditExam] = useState<boolean>(true);
    const [timeOpen, setTimeOpen] = useState<number>();
    const {setModal, showModal} = useContext(ContextModal);
    const [message, setMessage] = useState("");
    const [Course, setCourse] = useState<{
        id: string,
        courseName: string
    }>()
    

    const [timeExam, setTimeExam] = useState<{
        examCloseTime: string
        examOpenTime: string
    }>({
        examOpenTime: '',
        examCloseTime: '',
    })

    const [urlAvatar, setUrlAvatar] = useState<{
        type?: string
        url?: string
    }>({
        type: 'img',
        url: '',
    })
    const navigate = useNavigate()

    const param = useParams()
    const [examPost, setExamPost] = useState<Exam>({
        examName: '',
        examCloseTime: '',
        examOpenTime: '',
        examLimittedWorkingTime: '',
        questions: [
            {
                questionsName: '',
                questionsFile: '',
            },
        ],
        course: {
            id: param.id,
        },
        typeOfExams: {
            id: 2,
        },
    })

    const TemplateExam:any[] = [
        {
            id: 1,
            department: "Kinh tế vĩ mô",
            questions: '<p><strong style="color: black;">Bài 1</strong><span style="color: black;">:</span></p><p> Trong năm 2010 có các chỉ tiêu thống kê của một quốc gia như sau:</p><p><span style="color: black;">Chỉ tiêu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Giá trị </span></p><p><span style="color: black;">Tổng đầu tư &nbsp;150 </span></p><p><span style="color: black;">Đầu tư ròng &nbsp;50 </span></p><p><span style="color: black;">Tiền lương &nbsp;&nbsp;&nbsp;230 </span></p><p><span style="color: black;">Tiền thuê đất  35 </span></p><p><span style="color: black;">Lợi nhuận &nbsp;&nbsp;&nbsp;&nbsp;60 </span></p><p><span style="color: black;">Xuất khẩu &nbsp;&nbsp;&nbsp;&nbsp;100 </span></p><p><span style="color: black;">Nhập khẩu &nbsp;&nbsp;&nbsp;50</span></p><p><span style="color: black;">Tiêu dùng hộ gia đình &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200</span></p><p><span style="color: black;">Chi tiêu của chính phủ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100</span></p><p><span style="color: black;">Tiền lãi cho vay &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25</span></p><p><span style="color: black;">Thuế gián thu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50</span></p><p><span style="color: black;">Thu nhập yếu tố ròng &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 50</span></p><p><span style="color: black;">Chỉ số giá tiêu dùng 2009 &nbsp;100</span></p><p><span style="color: black;">Chỉ số giá tiêu dùng 2010&nbsp;125</span></p><p><span style="color: black;">Yêu cầu:</span></p><p><span style="color: black;"> a) Tính GDP danh nghĩa năm 2010 theo giá thị trường bằng phương pháp tiếp cận hàng</span></p><p><span style="color: black;"> hoá cuối cùng ( tiếp cận chi tiêu ) và bằng phương pháp tiếp cận thu nhập</span></p><p><span style="color: black;"> b) Tính GNP danh nghĩa năm 2010 và tỷ lệ lạm phát năm 2010</span></p><p><span style="color: black;"> </span></p><br><p><strong  style="color: black;">Bài 2</strong><span style="color: black;"> </span>:</p><p><strong style="color: black;"> </strong>Trong một nền kinh tế đóng, giả sử có các hàm số sau:</p><p><strong style="color: black;">Hàm tiêu dùng: C= 55 + 0,75Yd</strong></p><p><strong style="color: black;">Hàm đầu tư: I = 70 + 0,15Y</strong></p><p><strong style="color: black;">Chi tiêu của chính phủ: G = 100</strong></p><p><strong style="color: black;">Hàm thuế ròng: T = 50 + 0,2Y</strong></p><p><strong style="color: black;">Sản lượng tiềm năng: Y* = 900</strong></p><p><span style="color: black;">Yêu cầu:</span></p><p><span style="color: black;">a) Xác định mức sản lượng cân bằng của nền kinh tế? Hãy nhận xét về tình hình ngân</span></p><p><span style="color: black;">sách của chính phủ?</span></p><p><span style="color: black;">b) Giả sử các doanh nghiệp tăng các khoản đầu tư là 20. Tính mức sản lượng cân bằng</span></p><p><span style="color: black;">mới? Tính số tiền thuế chính phủ thu thêm được?</span></p><p><span style="color: black;">c) Từ kết quả câu (b) để đạt được mức sản lượng tiềm năng chính phủ phải sử dụng chính</span></p><p><span style="color: black;">sách tài chính (hay còn gọi là chính sách tài khoá) như thế nào trong trường hợp chỉ sử</span></p><p><span style="color: black;">dụng công cụ G ? G phải tăng hay giảm và bằng bao nhiêu ?</span></p><p><span style="color: black;">&nbsp;&nbsp;</span></p><p><strong style="color: black;">Bài 3: </strong></p><p><span style="color: black;">Giả sử thị trường tiền tệ có các hàm số sau: Hàm cung tiền thực tế MS = 8.000 tỷ</span></p><p><span style="color: black;">đồng; Hàm cầu tiền thực tế MD= 12.000 tỷ - 500i (với i là lãi suất); Tiền cơ sở B = 1600 tỷ đồng</span></p><p><span style="color: black;">Yêu cầu:</span></p><p><span style="color: black;">a) Tìm mức lãi suất cân bằng và minh họa lên đồ thị của thị trường tiền tệ?</span></p><p><span style="color: black;">b) Giả sử sau đó ngân hàng trung ương bán ra 150 tỷ đồng trái phiếu chính phủ thì lãi</span></p><p><span style="color: black;">suất mới sẽ thay đổi thế nào? Chỉ ra sự thay đổi này trên đồ thị của câu a?</span></p>'
        },
        {
            id: 2,
            department: "Quản trị Marketing",
            questions: '<p><strong style="color: rgb(13, 13, 13);">Câu 1:</strong></p><p><span style="color: rgb(13, 13, 13);">Vì sao quan điểm kinh </span><span style="color: black;">doanh marketing đạo đức xã hội lại có cơ hội thành công hơn các</span><span style="color: rgb(13, 13, 13);"> </span><span style="color: black;">quan điểm kinh doanh khác ? Lấy ví dụ chứng minh. </span></p><p><span style="color: rgb(13, 13, 13);">&nbsp;</span></p><p><strong style="color: rgb(13, 13, 13);">Câu 2:</strong></p><p><span style="color: black;">Để bán được sản phẩm, người làm Marketing chỉ cần tập trung vào các biện pháp kích </span><span style="color: rgb(13, 13, 13);">&nbsp;</span><span style="color: black;">thích tiêu thụ”. Hãy cho biết đánh giá của anh, chị về quan điểm kinh doanh hướng về bán </span><span style="color: rgb(13, 13, 13);">&nbsp;</span><span style="color: black;">hàng và quan điểm kinh doanh theo cách thức marketing?</span></p><p><span style="color: rgb(13, 13, 13);">&nbsp;</span></p><p><strong style="color: rgb(13, 13, 13);">Câu 3:</strong></p><p><span style="color: black;">Lớp A đang chuẩn bị đi thu thập thông tin khách hàng bằng phương pháp phỏng vấn trực</span><span style="color: rgb(13, 13, 13);"> </span><span style="color: black;">tiếp cá nhân, bạn hãy đưa ra những lời khuyên cần thiết để lớp A không bị mắc sai lầm khi</span><span style="color: rgb(13, 13, 13);"> </span><span style="color: black;">đi thực hiện cuộc phỏng vấn này?</span></p><p><br></p><p></p><p><strong style="color: rgb(13, 13, 13);">Câu 4:</strong></p><p><span style="color: rgb(13, 13, 13);">Vì sao trong hoạt động kinh doanh các doanh nghiệp cần thiết phải nghiên cứu đối thủ cạnh tranh? Để thu thập thông tin về đối thủ cạnh tranh các doanh nghiệp phải sử dụng phương pháp thu thập thông tin nào? Vì sao?</span></p><p><span style="color: rgb(13, 13, 13);">&nbsp;</span></p><p><strong style="color: rgb(13, 13, 13);">Câu 5:</strong></p><p><span style="color: black;">Hãy phân tích các giai đoạn quá trình mua sắm máy vi tính của người tiêu dùng ? Hãy cho biết điểm khác biệt về quá trình mua của các tổ chức&nbsp;với quá trình mua sắm của người tiêu dùng cá nhân?</span></p><p><span style="color: black;">&nbsp;</span></p><p><strong style="color: black;">Câu 6:</strong></p><p><span style="color: black;">Vì sao khi doanh nghiệp tham gia trên thị trường người tiêu dùng lại có sự khác biệt với tham gia&nbsp;trên thị trường cac doanh nghiệp sản xuất? Đặc điểm nào cho thấy trên thị trường tổ chức phi lợi nhuận hoạt động Marketing của người bán lại rất ít có tác dụng?</span></p><p><span style="color: black;">&nbsp;</span></p><p><strong style="color: black;">Câu 7:</strong></p><p><span style="color: black;">Hãy sơ đồ hóa các phương án lưạ chọn thị trường mục tiêu? Phân tích căn cứ lựa chọn chiến lược Marketing nhằm đáp ứng chiến lược thị trường mục tiêu?</span></p><p><br></p>'
        },
        {
            id: 3,
            department: "Quản trị Doanh nghiệp",
            questions: '<p><strong style="color: black;">Bài 1: </strong></p><p><span style="color: black;">Công ty Bích Nga chuyên sản xuất bánh quy. Trong tháng 1 năm N, công ty lập dự toán sẽ &nbsp;sản xuất 20.000 hộp bánh, với tổng lượng nguyên liệu dự toán tiêu hao là 10.250 kg. Giá &nbsp;mua ước tính mỗi kg nguyên liệu là 25.000 đồng. Số liệu chi phí thực tế được ghi nhận &nbsp;trong tháng 1 năm N như sau:&nbsp;</span></p><p><span style="color: black;">Số lượng bánh quy sản xuất: 20.500 hộp bánh&nbsp;</span></p><p><span style="color: black;">Tổng lượng nguyên liệu sử dụng: 10.660 kg&nbsp;</span></p><p><span style="color: black;">Giá mua nguyên liệu: 24.000 đồng/kg&nbsp;</span></p><p><span style="color: black;">Yêu cầu: </span></p><p><span style="color: black;">1. Hãy phân tích biến động giá và biến động lượng nguyên vật liệu trực tiếp trong tháng 1 &nbsp;năm N.&nbsp;</span></p><p><span style="color: black;">2.&nbsp;Vẽ sơ đồ biểu diễn biến động chi phí nguyên vật liệu trực tiếp. </span></p><p><span style="color: black;">&nbsp;</span></p><p><strong style="color: black;">Bài 2:&nbsp;</strong></p><p><span style="color: black;">Công ty Phúc Điền có số liệu liên quan đến chi phí nhân công trực tiếp để sản xuất sản&nbsp;phẩm B như sau :&nbsp;</span></p><p><span style="color: black;">Khối lượng sản xuất định mức là 3.000 sản phẩm, thực tế là 3.000 sản phẩm; Số giờ công &nbsp;cần thiết để sản xuất 1 sản phẩm định mức là 2,5 giờ, thực tế là 2,3 giờ; Đơn giá giờ công &nbsp;định mức là 50.000 đồng/giờ, thực tế là 49.000 đồng/giờ.&nbsp;</span></p><p><span style="color: black;">Yêu cầu:&nbsp;</span></p><p><span style="color: black;">1. Hãy xác định số giờ công thực tế và định mức để thực hiện sản xuất 3.000 sản phẩm A. </span></p><p><span style="color: black;">2. Phân tích biến động chi phí nhân công trực tiếp và cho nhận xét. </span></p><p><span style="color: black;">3. Vẽ sơ đồ biến động chi phí nhân công trực tiếp. </span></p><p><span style="color: black;">4. Giả sử số lượng sản phẩm sản xuất thực tế là 4.000 thì mức độ biến động chi phí nhân công trực tiếp trong trường hợp này là bao nhiêu?</span></p><p><br></p><p><strong style="color: black;">Bài 3:&nbsp;</strong></p><p><span style="color: black;">Công ty Kim Ánh có số liệu liên quan đến biến phí sản xuất chung để sản xuất sản </span></p><p><span style="color: black;">phẩm A như sau :&nbsp;</span></p><p><span style="color: black;">Theo kế hoạch: Số lượng sản phẩm dự kiến sản xuất là 25.000 sản phẩm; Số giờ lao động cần thiết để sản xuất 1 sản phẩm định mức là 3,0 giờ/sản phẩm. &nbsp;Biến phí sản xuất chung định mức là 24.000 đồng/giờ gồm: </span></p><p><span style="color: black;">+ Chi phí lao động gián tiếp&nbsp;&nbsp;15.000&nbsp;&nbsp;&nbsp;</span></p><p><span style="color: black;">+ Chi phí dầu nhớt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.800&nbsp;&nbsp;</span></p><p><span style="color: black;">+ Chi phí điện&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.200&nbsp;&nbsp;</span></p><p><span style="color: black;">Thực tế: Số sản phẩm sản xuất là 20.000 sản phẩm, số giờ lao động cần thiết để sản &nbsp;xuất thực tế là 3,9 giờ/ sản phẩm. Biến phí sản xuất chung thực tế 25.000 đồng/giờ gồm: </span></p><p><span style="color: black;">+ Chi phí lao động gián tiếp&nbsp;&nbsp;15.200&nbsp;</span></p><p><span style="color: black;">+ Chi phí dầu nhớt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.600&nbsp;&nbsp;</span></p><p><span style="color: black;">+ Chi phí điện&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.200 </span></p><p><span style="color: black;">Yêu cầu:&nbsp;</span></p><p><span style="color: black;">1. Phân tích biến động chi phí của biến phí sản xuất chung và cho nhận xét. </span></p><p><span style="color: black;">2. Vẽ sơ đồ biểu diễn biến động chi phí của biến phí sản xuất chung.</span></p><p><br></p>'
        }
      
    ]

    const onChangeFile = (files: FileList | null) => {
        if(files![0].size <= 100000000) {
            setUploadFile(files![0])
            if (files![0].type.match('application/*')) {
            
                setUrlAvatar({
                    type: 'file',
                    url: URL.createObjectURL(files![0]),
                })
            } else {
                setUrlAvatar({
                    type: 'img',
                    url: URL.createObjectURL(files![0]),
                })
            }

        }else {
            pushMessage({
                title: "Cảnh bảo",
                message: "Tệp bài thi không quá 100MB",
                type: "WARN"
            })
        }
    }

    const { AttachChidrenSideRight } = useContext(ContextLayout)
    useEffect(() => {
        window.scrollBy(0, -document.documentElement.scrollTop)
        AttachChidrenSideRight(null)
    }, [])

    const chosseQuestion = (id:any)=> {
        const question = TemplateExam.find((template)=> template.id === id);
        setContenExam(question.questions);
        showModal(false);
    }


    useEffect(() => {
        if (param.idExam) {
            getExamToEdit(param.idExam)
        }
    }, [param.idExam])


    useEffect(()=> {

        if(param.id) {
            getCourse(param.id);
        }

    }, [param.id])

    const chosseExam = (Event:ChangeEvent<HTMLSelectElement>)=> {
        if(+Event.target.value === 1) {
            setUrlAvatar({
                type: 'img',
                url: '',
            })
            setUploadFile(null)
        } else if(+Event.target.value === 2) {
            setContenExam('')
        }else {
            setUrlAvatar({
                type: 'img',
                url: '',
            })
            setUploadFile(null)
            setModal(<MultipleChoiceQuestionBank submitFunc={submitFunc} type={1}/>)
            showModal(true);
        }

        setTypeExam(+Event.target.value)
    }

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === "examLimittedWorkingTime") {
            if(event.target.value.match('^[0-9]*$')) {
                setExamPost({
                    ...examPost,
                    [event.target.name]: event.target.value,
                })
            }
        }else {

            setExamPost({
                ...examPost,
                [event.target.name]: event.target.value,
            })
        }
    }

    const getCourse = async (id)=> {
        const data = await CourseService.getCourseExam(id)
        setCourse(data);
    }

    const getExamToEdit = (id:any)=> {
        ExamService.getExamById(id).then((data:Exam)=> {
           setExamPost({
               id: data.id,
               examCloseTime: data.examCloseTime,
               examOpenTime: data.examOpenTime,
               examName: data.examName,
               examLimittedWorkingTime: data.examLimittedWorkingTime,
               questions: [
                   {
                       questionsName: data.questions[0].questionsName,
                       questionsFile: data.questions[0].questionsFile
                   }
               ],
               typeOfExams: {
                   id: data.typeOfExams.id
               },
               course: {
                   id: data.course.id
               }
           })
           setTimeExam({
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

          if(new Date(data.examOpenTime).getTime() <= Date.now()) {
              setIsEditExam(false);
          }
          setTimeOpen(new Date(data.examOpenTime).getTime())

                if (data.questions[0].questionsFile !== null) {
                    setUrlAvatar({
                        type: data.questions[0].questionsFile.slice(-4),
                        url: data.questions[0].questionsFile,
                    })
                    setTypeExam(2)
                } else {
                    setContenExam(data.questions[0].questionsName)
                    setTypeExam(1)
                }
            })
            .catch(() => {})
    }

    const subMitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
     
        const isCheckTime = new Date(examPost.examOpenTime).getTime() + +examPost.examLimittedWorkingTime*60*1000 < new Date(examPost.examCloseTime).getTime();
        if(isCheckTime) {
            let file = null
                if (typeExam === 2 && fileUpload) {
                    const formData = new FormData()
                    formData.append('file', fileUpload)
                    file = await UploadService.uploadFile(formData)
                }
                if((typeExam === 1 || typeExam === 3) && (contentExam.trim() === "" || contentExam.trim() === "<p><br></p>")) { 

                        setMessage("Vui lòng nhập nội dung bài thi")
                        return;
                }
    
                if(param.idExam) {
                    if(isEditExam) {
                        if(timeOpen > Date.now()) {
                            await ExamService.putMultipleChoiceExam(param.idExam, {
                                ...examPost,
                                questions: [
                                    {
                                        questionsName: contentExam,
                                        questionsFile: file || examPost.questions[0].questionsFile
                                    }
                                ]
                            }).then((data) => {
                                pushMessage({
                                    title: "Thành công",
                                    type: "SUCCESS",
                                    message: `Sửa bài thi thành công` 
                                })
                
                                NewsService.postNewToHistory({
                                    method: "PUT",
                                    name: data.examsName 
                                 })
                
                                navigate(`/faculty/courseView/${param.id}`);
                    
                            }).catch((error) => {
                                pushMessage({
                                    title: "Thất bại",
                                    type: "ERROR",
                                    message: `Lỗi hệ thống` 
                                })
                            });
        
                        }else {
                            pushMessage({
                                title: "Cảnh báo",
                                type: "WARN",
                                message: `Không thể sửa bài thi!` 
                            })
                        }
        
                    }else {
                        pushMessage({
                            title: "Cảnh báo",
                            type: "WARN",
                            message: `Không thể sửa bài thi!` 
                        })
                    }
                }else {
                    await ExamService.postExamByCourse({
                        ...examPost,
                        questions: [
                            {
                                questionsName: contentExam,
                                questionsFile: file || null,
                            },
                        ],
                    })
                        .then((data) => {
                            pushMessage({
                                title: 'Thành công',
                                type: 'SUCCESS',
                                message: `Bài thi được tạo thành công`,
                            })
        
                            NewsService.postNewToHistory({
                                method: 'POST',
                                name: data.examsName,
                            })
        
                            goToCourse()
                        })
                        .catch((error) => {
                            pushMessage({
                                title: 'Thất bại',
                                type: 'ERROR',
                                message: `Lỗi hệ thông`,
                            })
                        })
                }
            }else {
                pushMessage({
                    title: "Cảnh báo",
                    message: "Thời gian đóng bài không hợp lệ!",
                    type: "WARN"
                })
            }
               

    }

    const showTemplate = ()=> {
        setModal(<TemplateEssayExam questions={TemplateExam} chosseQuestion={chosseQuestion} />);
        showModal(true)
    }

    const submitFunc = (data:any[]) => {

        let contenString: string = "";
        contenString = data.reduce((currentString, item)=> {
            return  currentString  + item.questionName + "</br></br>";
        }, contentExam)

        setContenExam(contenString);
        showModal(false);
    }

    const goToCourse = ()=> {
        navigate(`/faculty/courseView/${examPost.course.id || param.id}`);

    }
    function goBack () {
        navigate(-1)
    }

    return (
        <div className="w-full p-[3%]">
            <div className="flex m-6  items-center cursor-pointer" onClick={e => goBack()}>
                <span>
                    <img src="\img\goback.png" />
                </span>
                <span className="ml-2 uppercase text-xl text-[#636363] font-bold">Quay lại</span>
            </div>

            <div className="h-auto  mt-[2%] mb-[2%] py-[2%] px-[3%] border-solid border-2 border-[#D4D4D4] rounded-[10px]">
                <b className="text-[40px] text-primary_blue">{Course?.courseName}</b>
                <p className="text-[14px] font-medium">
                  <Link to="/faculty" className='text-color63'>Trung tâm kiểm soát</Link>  / <Link to={`/faculty/courseView/${Course?.id}`}  className='text-color63'>{Course?.courseName}</Link> 
                </p>
            </div>
             <div className="rounded-lg w-full border-solid border-2 p-6 mb-24 border-gray-300 text-lg text-color63 font-medium">
                        <form onSubmit={subMitForm}>
                            <label className="text-lg font-medium text-color63">
                                Tên bài thi <span className="text-red-600">*</span>
                            </label>
                            <br />
                            <input
                                type="text"
                                id="quiz-name"
                                name="examName"
                                value={examPost?.examName}
                                onChange={handleChangeInput}
                                readOnly={!isEditExam}
                                required
                                className="rounded-[10px] border-solid w-full  focus:border-transparent focus:outline-none focus:ring-2  border-2 my-2 h-[50px] mr-4 border-gray-300 p-2"
                            />
                            <div className="flex flex-row grow">
                                <div className="py-8 grow mr-10">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className='flex flex-col w-3/4'>
                                            <label className="text-lg font-medium text-color63">
                                                Thời gian mở làm bài <span className="text-red-600">*</span>
                                            </label>
                                            <div className="flex flex-row">

                                                <input type="datetime-local"
                                                required
                                                readOnly={!isEditExam}
                                                onChange={(event:ChangeEvent<HTMLInputElement>)=> {
                                                    setExamPost({
                                                        ...examPost,
                                                        examOpenTime: event.target.value,
                                                    })

                                                    setTimeExam({
                                                        ...timeExam,
                                                        examOpenTime: `${new Date(event.target.value).getFullYear()}-${`${
                                                            new Date(event.target.value).getMonth() + 1
                                                        }`.padStart(2, '0')}-${`${new Date(
                                                            event.target.value,
                                                        ).getDate()}`.padStart(2, '0')}T${`${new Date(
                                                            event.target.value,
                                                        ).getHours()}`.padStart(2, '0')}:${`${new Date(
                                                            event.target.value,
                                                        ).getMinutes()}`.padStart(2, '0')}`,
                                                    })
                                                }}
                                                value={timeExam.examOpenTime}
                                                name="examOpenTime"
                                                className="rounded-[10px] border-solid text-center px-4 max-w-[320px] focus:border-transparent focus:outline-none focus:ring-2  border-2 my-2 h-[50px] mr-4 border-gray-300 p-2"
                                                />
                                             </div>
                                        </div>
                                        <div className='flex flex-col w-3/4'>
                                            <label className="text-lg font-medium text-color63">
                                                Thời gian đóng bài <span className="text-red-600">*</span>
                                            </label>
                                            <div className="flex flex-row">

                                                {/* examCloseTime: new Date(event.target.value).toISOString() */}
                                                <input type="datetime-local"
                                                onChange={(event:ChangeEvent<HTMLInputElement>)=> {
                                                    setExamPost({
                                                            ...examPost,
                                                            examCloseTime: event.target.value
                                                        })
                                                        setTimeExam({
                                                            ...timeExam,
                                                            examCloseTime: `${new Date(event.target.value).getFullYear()}-${`${new  Date(event.target.value).getMonth()+1}`.padStart(2, "0")}-${`${new  Date(event.target.value).getDate()}`.padStart(2,"0")}T${`${new Date(event.target.value).getHours()}`.padStart(2,"0")}:${`${new  Date(event.target.value).getMinutes()}`.padStart(2, "0")}`
                                                        })
                                                }}
                                                readOnly={!isEditExam}
                                                value={timeExam.examCloseTime}
                                                name='examCloseTime'
                                                required
                                                className="rounded-[10px] border-solid text-center px-4 max-w-[320px] focus:border-transparent focus:outline-none focus:ring-2  border-2 my-2 h-[50px] mr-4 border-gray-300 p-2"  />
                                            
                                            </div>

                                        </div>                                
                                        <div className="flex flex-col">
                                                <label htmlFor='quiz-minute' className="">
                                                      Giới hạn thời gian làm bài<span className="text-red-600"> *</span>
                                                </label>
                                                <div>
                                                <input
                                                    type="text"
                                                    id="quiz-minute"
                                                    readOnly={!isEditExam}
                                                    value={examPost?.examLimittedWorkingTime}
                                                    onChange={handleChangeInput}
                                                    name="examLimittedWorkingTime"
                                                    required
                                                    className="rounded-[10px] border-solid text-center w-[80px]  focus:border-transparent focus:outline-none focus:ring-2  border-2 my-2 h-[50px] mr-4 border-gray-300 p-2"
                                                />
                                                <span className='text-slate-400 text-lg'>Phút</span>

                                                </div>
                                    
                                        </div>                                    
                                    {/* 3th col*/}                   
                                     </div>
                            {/* 3th col*/}
                                </div>
                             </div>

                    <div className=" h-auto mt-[2%] mb-[2%] py-[1%] border-solid border-1 border-[#D4D4D4] rounded-[10px] ">
                        <div className='flex items-end'>
                            {
                              
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="option_exam" className="block text-sm font-medium text-gray-700">
                                        Lựa chọn
                                    </label>
                                    <select
                                        onChange={chosseExam}
                                        defaultValue={1}
                                        id="option_exam"
                                        className="mt-1 block w-[300px] py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value={1}>
                                            Tự tạo câu hỏi
                                        </option>
                                        <option value={2}>Tải lên đề thi</option>
                                        <option value={3}>Ngân hàng câu hỏi</option>
                                    </select>
                                </div>

                                
                            }
                   

                        <div className='ml-7'>
                                <button type='button' onClick={showTemplate} className='w-[150px] h-[36px] rounded-lg bg-light_blue text-white'>Chọn bản mẫu</button>
                        </div>

                        

                        

                        </div>
                                {
                                    typeExam === 1  || typeExam === 3 ? (
                                        <div className="w-[100%] max-w-[100%] overflow-x-hidden h-auto mt-[1%] mb-[1%] py-[1%]">
                                        <TextEditor
                                        value={contentExam}
                                            onChange={(event:string)=> {
                                                setContenExam(event)
                                                setMessage("")
                                            }}
                                            readOnly={!isEditExam}
                                        
                                        ></TextEditor>
                                       {
                                        message !== "" && <span className='text-[#fe3333]'>{message}</span>
                                       }
                                    </div>
                    
                                    ): (
                                        <div className="grid mt-6">
                                            <div className="flex flex-col">
                                                <label htmlFor="file" className="text-lg font-medium mb-2">
                                                    Tải lên tệp bài kiểm tra:
                                                </label>
                                                <div className="grid grid-cols-2 rounded-[10px]  border-[1px]  p-3 border-solid border-[#D0D0D0]">
                                                    <div className="flex flex-col">
                                                        <p>Tải lên tệp định dạng PDF,DOC, ... ( Tối đa 100MB)</p>
                                                        <label
                                                            htmlFor="upload_file"
                                                            className="my-auto rounded-lg p-3 border-[1px] border-solid w-[120px] border-[#D0D0D0] text-lg   text-[#636363] flex items-center justify-center"
                                                        >
                                                             <img src="\img\PathUpload.png" className='w-[20px] h-[20px]' alt="upload file" />{' '}
                                                            <span className="ml-1 text-primary">Tải lên</span>
                                                            <input
                                                                type="file"
                                                                onChange={(event) => onChangeFile(event.target.files)}
                                                                // accept={'image/*'}
                                                                readOnly={!isEditExam}
                                                                hidden
                                                                required
                                                                id="upload_file"
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="">
                                                        <p>Xem trước tệp tải lên:</p>

                                                                <div className="w-[250px] h-[141px] flex items-center justify-center rounded-lg bg-[#E0E0E0]">
                                                                    {urlAvatar.type === 'file' ? (
                                                                        <div className="card w-[50%] p-[10px] mt-5 relative flex justify-center items-center aspect-square rounded-[15px] shadow hover:shadow-lg file_group ">
                                                                            <div className="h-4/6 flex justify-center items-center">
                                                                                <a
                                                                                    href={`${urlAvatar?.url}`}
                                                                                    className="w-full h-full items-center flex justify-center"
                                                                                    target="_blank"
                                                                                >
                                                                                    <span className="flex w-[100%]">
                                                                                        <FileProtectOutlined style={{ fontSize: 50 }} />
                                                                                    </span>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <img
                                                                            className="max-w-full max-h-full object-contain"
                                                                            src={urlAvatar.url !== '' ? urlAvatar.url : '/img/img_link.png'}
                                                                            alt=""
                                                                        />
                                                                    )}
                                                                </div>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                        )}

                        {/*Nút Tải file bài tập lên*/}
                        <div className="w-auto h-auto mt-[1%]">
                            <div className="flex justify-end mt-[2%]">
                                <button
                                    type="reset"
                                    onClick={goBack}
                                    className="px-[1.5%] py-[1%] bg-[#ffffff] text-primary border-solid border-text_light_blue border-2 rounded-[10px]"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-[1.5%] py-[1%] ml-[1%] bg-text_light_blue font-medium text-[#ffffff] rounded-[10px]"
                                >
                                    Lưu bài thi
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                
            </div>
        </div>
        
    )
}

export default CreateEssayExam
