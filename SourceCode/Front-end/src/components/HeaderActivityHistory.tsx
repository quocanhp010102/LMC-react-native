type Props = {
    title: string
    isShowAction?: boolean
}

const HeaderActivityHistory: React.FC<Props> = (props) => {
    const { title, isShowAction } = props
    return (
        <div className="h-[90px] px-[21px] flex border-[1px] border-solid border-[#D4D4D4] justify-between items-center">
            {!isShowAction ? (
                <div className="flex items-center">
                    <img className="mr-4" src="/img/action_history.png" />
                    <h1 className="text-__text_primary font-[500] text-[24px]">{title}</h1>
                </div>
            ) : (
                <div className="flex items-center">
                    <div className="flex items-center mr-6 cursor-pointer">
                        <img src="\img\delete.png" className="mr-2" alt="" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeaderActivityHistory
