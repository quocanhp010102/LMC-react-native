import clsx from "clsx";
import { useContext, useState } from "react"
import { Question } from "../containers/Teacher/QuestionsBank"
import { ContextModal } from './../Context/ModalContext';
import DialogConfirm from './../containers/common/DialogConfirm';
import { FormAddEssayQuestion } from "../containers/common/FormAddEssayQuestion";
import { FormAddQuestion } from './../containers/common/FormAddQuestion';
import { QuestionBank } from "../types";

type Props = {
    question: QuestionBank,
    index: number,
    deleteQ: (id:any)=>void,
    editQ: (id, ques:QuestionBank)=> void
}

export function QuestionBankItem({question, index, deleteQ, editQ}:Props) {
    const [isAnswer, setIsShow] = useState(false);
    const {showModal, setModal} = useContext(ContextModal);
    const Question = ["A", "B", "C", "D"]
    

    const editQuestion = ()=> {
        if(+question.questionType === 1) {
            setModal(<FormAddEssayQuestion type="EDIT" question={question} editQ={editQ} />)
            showModal(true);

        }else {
            setModal(<FormAddQuestion type="EDIT" question={question} editQ={editQ} />)
            showModal(true);
        }
    }

    const deleteQuestionConfirm = ()=> {
        setModal(<DialogConfirm title="Bạn chắc chắn muốn xóa câu hỏi này không?" onClick={()=>deleteQ(question.id)} />)
        showModal(true)
    }

    const showDetail = ()=> {
        if(+question.questionType === 1) {
            setModal(<FormAddEssayQuestion type="VIEW" question={question} />)
            showModal(true);

        }else {
            setModal(<FormAddQuestion  type="VIEW" question={question}  />)
            showModal(true);
        }
    }


  

    return (
        <div className="h-auto min-h-[210px] rounded-md p-[12px] border-[1px] flex flex-col justify-between border-[#ccc]">
        <div className="flex justify-between items-center">
                <div className="flex items-center">
                        <span>
                            <img src={`${+question.questionType === 0 ? "./img/tn_icon.png" : "./img/tl_icon.png"}`} alt="tl icon" />
                        </span>
                        <span className="text-base font-bold cursor-pointer mx-[10px] text-primary_blue" onClick={showDetail}>Câu hỏi {index + 1}</span>
                        <span className="text-xs font-normal text-sub_text_color">#{question.id}</span>
                </div>
                <div className="flex items-center">
                        <span className="cursor-pointer" onClick={editQuestion}>
                            <img src="./img/edit_question.png" />
                        </span>
                        <span className="ml-[23px] cursor-pointer" onClick={deleteQuestionConfirm}>
                            <img src="./img/lmsDelete.png" />
                        </span>
                </div>
        </div>

        <div className="my-[18px] ml-[24px] relative question-name">
                <span className="text-text_light_blue text-base font-normal">{question.questionName.length <= 70 ? question.questionName : question.questionName.slice(0, 67    ) + "..."}</span>
        
                <span className="absolute question-name-hide">{question.questionName}</span>
        </div>

        <div className="mb-[16px] flex items-center">
            <span className={clsx("cursor-pointer duration-200", {"rotate-90": isAnswer})} onClick={()=> setIsShow(!isAnswer)}>                                
                <img src="./img/icon_select_qt.png" className="w-2 h-2" />
            </span>
            {
                isAnswer ? (
                    <span className="text-color32 text-xs font-normal ml-[20px]">{+question?.questionType === 0 ?  `Đáp án: ${question.answerBanks.find(item => +item.answerStatus === 1).answerName}` : (question.answerBanks[0].answerName.length <= 56 ?  question.answerBanks[0].answerName : question.answerBanks[0].answerName.slice(0, 53) + "..."    )}</span>

                ) : (<span className="text-color32 text-xs font-normal ml-[20px]">Xem đáp án</span>)
            }
        </div>

        <div className="flex items-center">
                <div className="text-color63 flex items-center p-[4px] bg-btn_bg h-auto w-fit text-xs font-normal ml-[20px]">Ngành: {question?.course?.department?.department_name.length <= 20 ? question?.course?.department?.department_name : question?.course?.department?.department_name.slice(0, 17) + "..."}</div>
                <div className="text-color63 flex items-center p-[4px] bg-btn_bg h-auto w-max text-xs font-normal ml-[20px]">Khóa học: {question?.course?.courseName.length <= 20 ? question?.course?.courseName : question?.course?.courseName.slice(0, 17) + "..." }</div>
        </div>

</div>
    )
}