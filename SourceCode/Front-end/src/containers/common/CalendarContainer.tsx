import Calendar from '../../components/Calendar'
import EventsCalendar from '../Student/EventsCalendar'
import { useEffect, useContext } from 'react';
import { ContextModal } from './../../Context/ModalContext';

function CalendarContainer() {
    const {showModal} = useContext(ContextModal)

    // useEffect(()=> {
    //     return ()=> {
    //         showModal(false);
    //         console.log("hide");
    //     }
    // }, [])

    return (
        <>
            <Calendar />
            <EventsCalendar />
        </>
    )
}

export default CalendarContainer
