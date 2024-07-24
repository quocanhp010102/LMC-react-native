import { ChangeEvent, useContext, useEffect, useState } from "react"
import { ContextModal } from "../../Context/ModalContext";
import { CourseService } from "../../services/CourseService";
import { DepartmentService } from "../../services/DepartmentService";
import { Course, Department, QuestionBank } from "../../types";
import { Question } from "../Teacher/QuestionsBank";
import { FormAddEssayQuestion } from "./FormAddEssayQuestion";
import { FormAddQuestion } from "./FormAddQuestion";

type Props = {
    addQ: (ques:QuestionBank)=> void
}

export function CreateQuestionBank({addQ}:Props) {
    const {setModal, showModal} = useContext(ContextModal)
    const [isEssay, setIsEssay] = useState<number>(0);
    const [department, setDepartment] = useState<Department[]>([]);
    const [courses, setCourses] = useState<Course[]>([])


    useEffect(()=> {
        getDepartment()
    }, [])

    const getDepartment = async ()=> {
        const department = await DepartmentService.getDepartment();
        setDepartment(department.content);
    }

 
    const [ques, setQues] = useState<QuestionBank>({
        questionName: "",
        questionType: 0,
        course: {
            id: ""
           
        },
        answerBanks: []
    })
    const showForm = ()=> {
        if(isEssay === 0) {
            setModal(<FormAddQuestion question={ques} type="ADD" addQ={addQ} />)
        }else {
            setModal(<FormAddEssayQuestion question={ques} type="ADD" addQ={addQ} />)
        }

    }

    const showCourses = (event:ChangeEvent<HTMLSelectElement>)=> {
        const dp = department.find(depart => depart.id === +event.target.value);
     
        setCourses(dp?.courses)
    }
    
    return (
        <div className="w-[854px]  h-[600px] p-[44px] flex flex-col justify-between bg-white rounded-[10px]">
            {/* b1 */}
                    <h1 className="uppercase text-[#014F59] font-bold text-[28px] text-center">Tạo câu hỏi mới</h1>
                    <div className="w-full">
                                <span className="text-color63 text-base">Chuyên nghành: </span>
                                <select defaultValue={-1} onChange={showCourses} className="w-full text-base mt-3 text-sub_text_color rounded-[10px] border-solid   focus:border-transparent focus:outline-none focus:ring-2  border-2 h-[60px] mr-4 border-gray-300 p-2">
                                         <option  value={-1} disabled>--Chọn chuyên ngành--</option>
                                      {
                                                  department.length > 0 && department.map((dp)=>{
                                                        return (
                                                            <option key={dp.id} value={dp.id}>{dp.department_name}</option>

                                                        )
                                                    })
                                                }
                                </select>
                    </div>
                    <div className="w-full">
                                <span className="text-color63 text-base">Khóa học: </span>
                                <select defaultValue={-1} onChange={(event:ChangeEvent<HTMLSelectElement>)=> {
                                       setQues({
                                        ...ques,
                                        course: {
                                            id: event.target.value,
                                        }
                                    })
                                }} className="w-full text-base mt-3 text-sub_text_color rounded-[10px] border-solid   focus:border-transparent focus:outline-none focus:ring-2  border-2 h-[60px] mr-4 border-gray-300 p-2">
                                        <option  value={-1}  disabled>--Chọn Khóa học--</option>
                                       {
                                                    courses.map((course, index)=> {
                                                        return (

                                                            <option key={index} value={course.id}>{course.courseName}</option>
                                                        )
                                                    })
                                        }
                                </select>
                    </div>
                    <div className="w-full">
                                <span className="text-color63 text-base">Dạng câu hỏi</span>
                                <select defaultValue={isEssay} onChange={(event:ChangeEvent<HTMLSelectElement>)=> {
                                        setIsEssay(+event.currentTarget.value)
                                        setQues({
                                            ...ques,
                                            questionType: +event.target.value === 0 ? 0 : 1
                                        })
                                }} className="w-full text-base mt-3 text-sub_text_color rounded-[10px] border-solid   focus:border-transparent focus:outline-none focus:ring-2  border-2 h-[60px] mr-4 border-gray-300 p-2">
                                        <option value={0}>Trắc nghiệm</option>
                                        <option value={1}>Tự luận</option>
                                </select>
                    </div>
                    <div className="flex justify-end">
                    <button onClick={()=>showModal(false)} className="border-[1px] w-[180px] h-[50px] rounded-[10px] border-solid text-lg mr-2 border-light_blue bg-white text-text_light_blue">Hủy</button>
                    <button className="bg-light_blue w-[180px] h-[50px] rounded-[10px] text-white text-lg" onClick={showForm}>Tiếp theo</button>
                    </div>     
                {/* b2 */}
                           
                </div>

    )
}