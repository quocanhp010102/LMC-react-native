import { useContext, useEffect, useState } from 'react'
import HeaderActivityHistory from '../../components/HeaderActivityHistory'
import { ContextModal } from '../../Context/ModalContext'
import { ContextLayout } from '../../layout/Layout'
import { HistoryActivityService } from '../../services/HistoryActivityService'
import CalendarContainer from './CalendarContainer'

const ONE_LOAD_SIZE = 10
const ActivityHistory: React.FC = () => {
    const [currentDateHisActList, setCurrentDateHisActList] = useState<any[]>([])
    const [sizeCurrentDate, setSizeCurrentDate] = useState<number>(0)
    const [totalDateList, setTotalDateList] = useState<number>(0)
    const [currentMonthHisActList, setCurrentMonthHisActList] = useState<any[]>([])
    const [sizeCurrentMonth, setSizeCurrentMonth] = useState<number>(0)
    const [totalMonthList, setTotalMonthList] = useState<number>(0)
    const { AttachChidrenSideRight } = useContext(ContextLayout)
    const {showModal} = useContext(ContextModal);
    useEffect(() => {
        AttachChidrenSideRight(<CalendarContainer />)
        
        return ()=> {
            showModal(false)
        }
    }, [])

    const loadDateData = async (page: number) => {
        HistoryActivityService.getCurrentDateHistoryActivity(page, ONE_LOAD_SIZE)
            .then((dat) => {
                setCurrentDateHisActList([...currentDateHisActList, ...dat.content])
                setTotalDateList(dat.totalElements)
            })
            .catch((err) => console.log(err))
    }
    const loadMonthData = async (page: number) => {
        HistoryActivityService.getCurrentMonthHistoryActivity(page, ONE_LOAD_SIZE)
            .then((dat) => {
                setCurrentMonthHisActList([...currentMonthHisActList, ...dat.content])
                setTotalMonthList(dat.totalElements)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        loadDateData(sizeCurrentDate)
        loadMonthData(sizeCurrentMonth)
    }, [])

    const loadMore = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (event.currentTarget.name === 'date') {
            loadDateData(sizeCurrentDate + 1)
            setSizeCurrentDate(sizeCurrentDate + 1)
        }
        if (event.currentTarget.name === 'month') {
            loadMonthData(sizeCurrentMonth + 1)
            setSizeCurrentMonth(sizeCurrentMonth + 1)
        }
    }
    return (
        <div className="w-full sc1920:p-[28px] sc1536:p-[27px] sc1366:p-[26px]">
            <h3 className="sc1920:text-[28px] sc1536:text-[28px] sc1366:text-[24px] font-[700] text-primary_blue uppercase mb-[36px]">
                Lịch sử hoạt động
            </h3>
            <div className="card p-0">
                {/* Hom nay */}
                <div className="w-full">
                    <HeaderActivityHistory title="Hôm nay" isShowAction={false} />
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="font-[700] uppercase py-12">
                                <td className="hidden" />
                                <td className="w-[75%]">Hoạt động</td>
                                <td className="w-[25%]">Thời gian</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDateHisActList.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="hidden" />
                                        <td>{value.historyName}</td>
                                        <td>
                                            {parseInt(value.historyTime.slice(0, 2)) > 0
                                                ? `${parseInt(value.historyTime.slice(0, 2))} giờ trước`
                                                : `${parseInt(value.historyTime.slice(3, 5))} phút trước`}
                                        </td>
                                    </tr>
                                )
                            })}
                            {currentDateHisActList.length < totalDateList && (
                                <tr>
                                    <td colSpan={3}>
                                        <button
                                            className="text-light_blue hover:underline"
                                            name="date"
                                            onClick={(e) => loadMore(e)}
                                        >
                                            Xem thêm
                                        </button>
                                    </td>
                                </tr>
                            )}
                            {currentDateHisActList.length == 0 && (
                                <tr>
                                    <td colSpan={3}>Không có hoạt động nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tuan nay */}
                <div className="w-full">
                    <HeaderActivityHistory title="Tháng này" isShowAction={false} />
                    <table className="manager_table w-full text-center text-__text_primary">
                        <thead>
                            <tr className="font-[700] uppercase py-xe12">
                                <td className="hidden" />
                                <td className="w-[75%]">Hoạt động</td>
                                <td className="w-[25%]">Thời gian</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMonthHisActList.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="hidden" />
                                        <td>{value.historyName}</td>
                                        <td>
                                            {value.historyTime == '0' ? 'Hôm nay' : `${value.historyTime} ngày trước`}
                                        </td>
                                    </tr>
                                )
                            })}
                            {currentMonthHisActList.length < totalMonthList && (
                                <tr>
                                    <td colSpan={3}>
                                        <button
                                            className="text-light_blue hover:underline"
                                            name="month"
                                            onClick={(e) => loadMore(e)}
                                        >
                                            Xem thêm
                                        </button>
                                    </td>
                                </tr>
                            )}
                            {currentMonthHisActList.length == 0 && (
                                <tr>
                                    <td colSpan={3}>Không có hoạt động nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ActivityHistory
