import { Outlet } from 'react-router-dom'
// import StudentLayout from "../../layout/StudentLayout";

type Props = {}

const DashboardStudent = (props: Props) => {
    return (
        <>
            {/* <StudentLayout> */}
            <Outlet />
            {/* </StudentLayout> */}
        </>
    )
}
export default DashboardStudent
