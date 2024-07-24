import EditQuizContainer from '../../containers/Teacher/EditQuizContainer'
// import ManagerLayout from "../../layout/ManagerLayout";

type Props = {}

const EditQuizPage = (props: Props) => {
    return (
        <div className="w-full grow">
            {/* <ManagerLayout> */}
            <EditQuizContainer />
            {/* </ManagerLayout> */}
        </div>
    )
}
export default EditQuizPage
