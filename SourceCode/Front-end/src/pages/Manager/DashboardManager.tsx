import { Outlet } from 'react-router-dom'
// import ManagerLayout from "../../layout/ManagerLayout";

type Props = {}

const DashboardManager = (props: Props) => {
    return (
        <>
            {/* <ManagerLayout> */}
            <Outlet />
            {/* </ManagerLayout> */}
        </>
    )
}
export default DashboardManager
