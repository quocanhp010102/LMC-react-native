import { useContext, useEffect } from 'react'
import QuizContainer from '../../containers/Student/QuizContainer'
import { ContextLayout } from '../../layout/Layout'
// import QuizTestLayout from "../../layout/QuizTestLayout";

type Props = {}

const QuizTestPage = (props: Props) => {
    const { AttachChidrenSideRight } = useContext(ContextLayout)

    useEffect(() => {
        AttachChidrenSideRight(null)
    }, [])

    return (
        <div className="w-full grow">
            {/* <QuizTestLayout> */}
            <QuizContainer />
            {/* </QuizTestLayout> */}
        </div>
    )
}
export default QuizTestPage
