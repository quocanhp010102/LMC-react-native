import CreateQuizContainer from '../../containers/Teacher/CreateQuizContainer'
// import ManagerLayout from "../../layout/ManagerLayout";

type Props = {}

const CreateQuizPage = (props: Props) => {
    return (
        <div className="w-full grow">
            {/* <ManagerLayout> */}
            <CreateQuizContainer />
            {/* </ManagerLayout> */}
        </div>
    )
}
export default CreateQuizPage
