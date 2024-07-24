import { DATA_LIMIT } from '../containers/Student/QuizContainer'

export interface QuizType {
    id: number
    questionsName: string
    answers: { id: number; answersName: string; answersStatus?: '0' | '1' | null }[]
}

interface Props {
    quizes: QuizType[]
    currentPage: number
    isTimeOut?: boolean
    changeAnswer?: (quizId: number, answerIndex: number) => void
}
const Quiz = ({ quizes, currentPage, isTimeOut, changeAnswer }: Props) => {
    return (
        <div className="flex flex-col">
            {quizes.map((quiz, index) => (
                <div key={`${quiz.id}`} id={`${quiz.id}`}>
                    <div className="title mb-4 text-[24px] font-bold text-color63">
                        Câu {(currentPage - 1) * DATA_LIMIT + index + 1}: {quiz.questionsName}
                    </div>
                    <div className="flex flex-col mb-10">
                        {[0, 1, 2, 3].map(
                            (answer, idx) =>
                                quiz.answers[idx] && (
                                    <label key={`${idx}`} htmlFor={`ans-${quiz.id}${idx}`}>
                                        <div className="rounded-lg border mb-2 border-solid border-borderColor text-2xl font-normal flex flex-row hover:bg-[#f2f2f2] ">
                                            <div className="p-6">
                                                <input
                                                    type="radio"
                                                    name={`${quiz.id}`}
                                                    id={`ans-${quiz.id}${idx}`}
                                                    className="mr-6 w-6 h-6 relative top-1"
                                                    checked={quiz.answers[idx].answersStatus == '1'}
                                                    onChange={() => changeAnswer(quiz.id, idx)}
                                                    disabled={isTimeOut}
                                                />
                                                {quiz.answers[idx].answersName}
                                            </div>
                                        </div>
                                    </label>
                                ),
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Quiz
