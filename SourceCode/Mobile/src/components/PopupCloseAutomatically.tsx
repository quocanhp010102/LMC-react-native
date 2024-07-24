import { useEffect } from "react";
import { PopupNotification } from "./PopupNotification";

interface Iparams {
    title?: string;
    setIsOpen: (value: boolean) => void;
    isOpen: any;
    type?: string;
    titleEdit?: string;
    delayTime?: number;
}

const PopupCloseAutomatically = (props: Iparams) => {

    const { title, setIsOpen, isOpen, type, titleEdit, delayTime = 4000 } = props;

    useEffect(() => {
        if (isOpen) {
            // only change query if there is no typing within 4000ms
            const timeout = setTimeout(() => {
                setIsOpen(!isOpen);
            }, delayTime);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isOpen]);

    return (
        <PopupNotification
            title={title}
            titleEdit={titleEdit}
            type={type}
            setModalVisible={setIsOpen}
        />
    );
};

export default PopupCloseAutomatically;