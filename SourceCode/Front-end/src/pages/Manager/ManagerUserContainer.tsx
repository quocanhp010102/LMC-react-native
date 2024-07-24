import SideRightContainer from '../../containers/common/SideRightContainer'

function ManagerUserContainer() {
    return (
        <div className="lg:pl-[333px] relative lg:h-auto flex">
            <div className="lg:w-[80%] h-[100px] m-6 border-[1px] border-solid border-[#D4D4D4] rounded-md">
                <div className="">
                    <h1 className="uppercase">Tra cứu người dùng</h1>
                </div>
            </div>
            <SideRightContainer />
        </div>
    )
}

export default ManagerUserContainer
