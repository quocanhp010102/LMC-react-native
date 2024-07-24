import dayjs from "dayjs";
//@ts-ignore
import _ from "lodash";
import moment from "moment";
import * as React from "react";
import {Alert, Dimensions, Modal, Platform, StyleSheet, TouchableOpacity, View,} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useTheme} from "styled-components/native";
import {useAppSelector} from "../../hooks/ReduxHook";
import {Box, Flex, Text, TextInput} from "../../rebass";
import {generateApiService} from "../../services/ApiService";
import {NotesApi} from "../../services/api/Notes/NotesApi";
import {Devider} from "../Devider";
import {Icon} from "../svg-icon";
import {months, weekDays} from "./const";
import {DefaultTheme} from "./theme";
import {generateMatrix} from "./utils";
import PopupCloseAutomatically from "../PopupCloseAutomatically";

interface _Date {
    day: string;
    month: string;
    year: string;
    weekday: string;
}

//@ts-ignore
const majorVersionIOS = parseInt(Platform.Version, 10);


const screenWidth = Math.round(Dimensions.get("window").width) || 500;

function Calendar({date = new Date()}: { date: Date }) {
    const [activeDate, setActiveDate] = React.useState(date);
    const [previous, setPrevious] = React.useState<number>();
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [time, setTime] = React.useState<string>("");
    const [showTime, setShowTime] = React.useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
    const [noteByDay, setNoteByDay] = React.useState<any>([]);
    const [idNote, setIdNote] = React.useState<number>();
    const [noteTitle, setNoteTitle] = React.useState<string>("");
    const [noteContent, setNoteContent] = React.useState<string>("");
    const [noteDate, setNoteDate] = React.useState<string>(
        moment(new Date()).format()
    );
    const [modalVisibleNoti, setModalVisibleNoti] = React.useState(false);
    const [type, setType] = React.useState<string>("");
    const [notes, setNotes] = React.useState<any>([]);
    const [listDayOfNotes, setListDayOfNotes] = React.useState<any>([]);
    const [titleNoti, setTitleNoti] = React.useState<string>("");
    const theme = useTheme();
    // list day current month
    const [arrDays, setArrdays] = React.useState<_Date[]>([]);
    const Days = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
    ];

    const [datePicker, setDatePicker] = React.useState<_Date>({
        day: `00${date.getDate()}`.slice(-2),
        month: `00${date.getMonth() + 1}`.slice(-2),
        year: `${date.getFullYear()}`,
        weekday: "Hôm nay",
    });

    React.useEffect(() => {
        if (activeDate != date) {
            // setActiveDate(date);
            const datePre = new Date(date.getFullYear(), date.getMonth(), 0);
            const preMonthday = new Date(
                +date.getMonth() === 1 ? +date.getFullYear() - 1 : +date.getFullYear(),
                +date.getMonth() === 1 ? 12 : +date.getMonth() - 1,
                0
            );
            const preMonth = preMonthday.getDate();
            setPrevious(preMonth);
        }
        renderCalender(datePicker.year, datePicker.month);
    }, [datePicker]);

    const renderCalender = (year: string, month: string) => {
        // pre month
        const preMonthday = new Date(
            +month === 1 ? +year - 1 : +year,
            +month === 1 ? 12 : +month - 1,
            0
        );
        const preMonth = preMonthday.getDate();

        // current month
        const currentMonth = new Date(+year, +month, 0);

        const lastDate = currentMonth.getDate();
        currentMonth.setDate(1);

        const offsetPreDays = currentMonth.getDay();

        // next month
        let nextMonth = new Date(+year, +month + 1, 0);
        const nextDays = nextMonth.getDate();

        const newArr: _Date[] = [];

        for (let i = (offsetPreDays === 0 ? 7 : offsetPreDays) - 1; i > 0; i--) {
            preMonthday.setDate(preMonth - i + 1);

            newArr.push({
                day: `00${preMonth - i + 1}`.slice(-2),
                month: `00${+month === 1 ? 12 : +month - 1}`.slice(-2),
                year: `${+month === 1 ? +year - 1 : +year}`,
                weekday: hanldeDay(preMonthday.getDay()),
            });
        }

        for (let i = 1; i <= lastDate; i++) {
            currentMonth.setDate(i);
            newArr.push({
                day: `00${i}`.slice(-2),
                month: `00${month}`.slice(-2),
                year: year,
                weekday: hanldeDay(currentMonth.getDay()),
            });
        }
        for (let i = 1; i <= nextDays; i++) {
            nextMonth.setDate(i);
            newArr.push({
                day: `00${i}`.slice(-2),
                month: `00${+month === 12 ? 1 : +month + 1}`.slice(-2),
                year: `${+month === 12 ? +year + 1 : +year}`,
                weekday: hanldeDay(nextMonth.getDay()),
            });
        }
        setArrdays(newArr.slice(0, 42));
    };
    const hanldeDay = (day: number) => {
        return Days[day === 0 ? 7 - 1 : day - 1];
    };
    const _onPress = (item: number, row: _Date) => {
        if (typeof item !== "string" && item != -1) {
            const newDate = new Date(activeDate.setDate(item));
            setActiveDate(newDate);
        }
    };
    const matrix = generateMatrix(activeDate);
    const renderRow = () => {
        var rows = null;
        rows = arrDays.map((row, index) => {

            let date = `${row.year}-${row.month}-${row.day}`;
            const isHaveNote = listDayOfNotes.includes(date);
            return (
                <TouchableOpacity
                    key={index}
                    onPress={
                        +row.month == +datePicker.month
                            ? () => {
                                _onPress(+row.day, row);
                                handleGetNoteByDate();
                            }
                            : () => {
                            }
                    }
                    style={[
                        styles.date,
                        +row.day == activeDate.getDate() && +row.month == +datePicker.month
                            ? styles.activeDate
                            : styles.inActiveDate,
                    ]}
                >
                    <Text
                        style={{
                            color:
                                +row.month !== +datePicker.month
                                    ? "#ccc"
                                    : +row.day == activeDate.getDate() &&
                                    +row.month == +datePicker.month
                                        ? "white"
                                        : "black",
                        }}
                    >
                        {row.day}
                    </Text>
                    {isHaveNote && <Icon name="dot" size={5}/>}
                </TouchableOpacity>
            );
        });
        return rows;
    };

    const changeMonth = (n: number) => {
        setDatePicker({
            ...datePicker,
            month: +datePicker.month + n + "",
        });
        const newDate = new Date(activeDate.setMonth(activeDate.getMonth() + n));
        setActiveDate(newDate);
        onGetNotes();
    };
    const formatTime = (time: Date) => {
        const timeFormatted =
            time.getHours() +
            " : " +
            (time.getMinutes() < 10 ? "0" : "") +
            time.getMinutes();
        return timeFormatted;
    };

    const onChange = (selectedTime: Date) => {
        const timeNote = moment(selectedTime).format();
        if (timeNote) {
            setNoteDate(timeNote);
        }
        const time = formatTime(selectedTime);
        setTime(time);
        setShowTime(false);
    };
    const dataRealTime = useAppSelector(
        (state1) => state1.NoteRealTime.NoteRealTimeList
    );

    React.useEffect(() => {
        const timeNote = moment(new Date).format();
        setNoteDate(timeNote);
        setTime(formatTime(new Date));
        onGetNotes();
    }, [dataRealTime]);
    const onGetNotes = async () => {
        let day = `00${activeDate.getDate()}`.slice(-2);
        // let monthString = activeDate.toLocaleString("default", { month: "short" });
        let monthString = dayjs(activeDate).format("MMM");
        let month = `00${activeDate.getMonth() + 1}`.slice(-2);
        let year = `${activeDate.getFullYear()}`;
        let formatDateString = `${day}-${monthString}-${year}`;
        let formatDate = `${year}-${month}-${day}`;

        const response = await generateApiService.get(
            NotesApi.getAllNoteByUserAndMonth(formatDateString)
        );
        const check = _.isEqual(response, notes);

        if (response) {
            const data = response.find((e: any) => e.noteDate === formatDate);
            const listDayHaveNotes = response.map((e: any) => e.noteDate);
            setListDayOfNotes(listDayHaveNotes);
            if (data) {
                const responseNotes = await generateApiService.get(
                    NotesApi.getNotesById(data.id)
                );
                console.log("responseNotes", responseNotes);
                if (responseNotes) {
                    setNotes(responseNotes.noteContents);
                } else {
                    setNotes([]);
                }
            } else {
                setNotes([]);
            }
        }
    };

    const checkToday = (activeDate: any) => {
        const now = new Date();
        if (activeDate.setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
            return "Hôm nay";
        }
        return "Ngày";
    };
    const handleGetNoteByDate = React.useCallback(() => {
        onGetNotes();
    }, [activeDate]);
  
    const onDeleteNote = async () => {
        try {
            const response = await generateApiService.delete(
                NotesApi.deleteNote(idNote)
            );
            onGetNotes();
            setTitleNoti("Xóa ghi chú");
            setShowDeleteModal(false);
            setType("success");
            setModalVisibleNoti(true);
        } catch (error) {
            setTitleNoti("Xóa ghi chú");
            setType("error");
            setModalVisibleNoti(true);
        }
    };

    const NoteItem = ({title, id, date, content}: any) => {

        const [status, setStatus] = React.useState<boolean>(false);

        return (
            <Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <TouchableOpacity onPress={() => setStatus(!status)}>
                        <Box
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            mb={2}
                            maxWidth={"90%"}
                            style={{paddingRight: 29, marginBottom: status ? 12 : 28}}
                        >
                            {!status && (
                                <Box mr={1}>
                                    <Icon name="note" size={20}/>
                                </Box>
                            )}
                            <Box minWidth={'100%'}>
                                <Text  color="seen" fontWeight={400} fontSize={16}>
                                    {title}
                                </Text>
                            </Box>
                        </Box>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setIdNote(id);
                            setShowDeleteModal(true);
                        }}
                    >
                        <Icon name="deleteNoteCalendar" size={25}/>
                    </TouchableOpacity>
                </Box>
                {status && (
                    <Box mb={20}>
                        <Flex>
                            {content ? <Text color={"#636363"}>{`${content}`}</Text> : null}
                        </Flex>
                        <Box flexDirection="row" mt={12}>
                            <Icon name="timeNote" size={30}/>
                            <Flex ml={16}>
                                <Text color={"#636363"} fontWeight={500} fontSize={18}>
                                    Thời gian bắt đầu
                                </Text>
                                <Text color={"#636363"} fontSize={16}>
                                    {date}
                                </Text>
                            </Flex>
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };

    const onCreateNote = async () => {
        try {
            if (!noteTitle) {
                return Alert.alert("Vui lòng nhập tiêu đề");
            }
            if (!noteContent) {
                return Alert.alert("Vui lòng nhập nội dung");
            }
            let newDate = noteDate.replace("+07:00", "+00:00");
            const requestBody = {
                noteDate: newDate,
                noteTitle: noteTitle,
                noteContent: noteContent,
            };
            const response = await generateApiService.post(
                NotesApi.saveNotes(),
                requestBody
            );
            const timeNote = moment(new Date).format();
            setNoteDate(timeNote);
            setTime(formatTime(new Date));
            onGetNotes();
            setTitleNoti("Tạo ghi chú");
            setShowModal(false);
            setType("success");
            setModalVisibleNoti(true);
        } catch (error) {
            setShowModal(false);
            setTitleNoti("Tạo ghi chú");
            setType("error");
            setModalVisibleNoti(true);
        }
    };
    const handleCreateNote = () => {
        setNoteDate(moment(activeDate).format());
        setNoteTitle("");
        setNoteContent("");
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowModal(false) ;
        const timeNote = moment(new Date).format();
        setNoteDate(timeNote);
        setTime(formatTime(new Date));
    }

    const NoteModal = () => (
        <Modal visible={showModal} animationType="slide" transparent>
            <Box flex={1} justifyContent="center" backgroundColor="rgba(0,0,0,0.5)">
                <Box py={28} px={13} mx={15} backgroundColor="#fff" borderRadius={20}>
                    <Box mx={13}>
                        <Text  color={'#1C7988'}>Tiêu đề</Text>
                        <TextInput
                            value={noteTitle}
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            padding={13}
                            marginTop={2}
                            onChangeText={(value: string) => setNoteTitle(value)}
                        ></TextInput>
                        <Text mt={24}  color={'#1C7988'}>Nội dung ghi chú</Text>
                        <TextInput
                            value={noteContent}
                            textAlignVertical="top"
                            multiline={true}
                            borderRadius={10}
                            borderWidth={1}
                            borderColor="rgba(125, 125, 125, 0.3)"
                            padding={2}
                            marginTop={2}
                            style={{height: 167}}
                            onChangeText={(value: string) =>{
                                setNoteContent(value)}}
                        ></TextInput>
                        <Text mt={24} color={'#1C7988'} >Thời gian ghi chú</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShowTime(true);
                            }}
                        >
                            <DateTimePickerModal
                                date={activeDate}
                                isVisible={showTime}
                                locale="vi"
                                mode="time"
                                onConfirm={onChange}
                                onCancel={() => setShowTime(false)}
                                is24Hour={true}
                                isDarkModeEnabled={
                                    majorVersionIOS >= 13 && theme.name === "dark"
                                }
                            />
                            <Box
                                py={2}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                borderRadius={10}
                                width="50%"
                                alignItems="center"
                                mt={2}
                            >
                                <Text>{time ? time : "0 : 00"}</Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>

                    <Box px={13} mt={37} flexDirection="row">
                        <TouchableOpacity
                            onPress={() => {
                                onCloseModal()
                            }}
                            style={{flex: 1}}
                        >
                            <Box
                                borderRadius={8}
                                borderWidth={1}
                                borderColor="#FD1A1A"
                                mt={2}
                                mr={2}
                                alignItems="center"
                            >
                                <Text padding={2} fontSize={18} color="#FD1A1A">
                                    Hủy
                                </Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex: 1}} onPress={onCreateNote}>
                            <Box
                                borderRadius={8}
                                borderWidth={1}
                                borderColor="rgba(125, 125, 125, 0.3)"
                                mt={2}
                                backgroundColor="buttonColor"
                                alignItems="center"
                            >
                                <Text padding={2} color="#fff" fontSize={18}>
                                    Xong
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );

    const DeleteNoteModal = () => (
        <Modal visible={showDeleteModal} animationType="slide" transparent>
            <Box
                flex={1}
                justifyContent="center"
                backgroundColor="rgba(0,0,0,0.5)"
                pb={5}
            >
                <Box py={28} px={13} borderRadius={20}>
                    <Box
                        alignItems="center"
                        justifyContent="center"
                        bg="#fff"
                        py={21}
                        borderRadius={8}
                        px={14}
                    >

                        <Icon name="confirmDeleteNote" color={'#FD1A1A'} size={50}/>
                        <Text fontSize={20} textAlign="center" color="#212121" mt={4} px={5}>
                            Bạn có chắc chắn muốn xoá ghi chú này không ?
                        </Text>
                        <Box flexDirection="row" mt={20}>
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                style={{flex: 1}}
                            >
                                <Box
                                    borderRadius={8}
                                    borderWidth={1}
                                    borderColor="#FD1A1A"
                                    mt={2}
                                    mr={2}
                                    backgroundColor="#ffff"
                                    alignItems="center"
                                    justifyContent="center"
                                    height={50}
                                >
                                    <Text
                                        padding={2}
                                        color="#FD1A1A"
                                        fontWeight="700"
                                        fontSize={18}
                                    >
                                        Hủy
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1}} onPress={onDeleteNote}>
                                <Box
                                    borderRadius={8}
                                    borderWidth={1}
                                    borderColor="#FD1A1A"
                                    backgroundColor="#FD1A1A"
                                    mt={2}
                                    height={50}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Text padding={2} color="#ffff" fontWeight="700" fontSize={18}>
                                        Xoá
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
    const DeleteNotiModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleNoti}
            onRequestClose={() => {
                setModalVisibleNoti(!modalVisibleNoti);
            }}
        >
            <PopupCloseAutomatically
                title={titleNoti}
                type={type}
                isOpen={modalVisibleNoti}
                setIsOpen={setModalVisibleNoti}
            />
            {/* <PopupNotification
        title={titleNoti}
        type={type}
        setModalVisible={setModalVisibleNoti}
      ></PopupNotification> */}
        </Modal>
    );

    return (
        <Box>
            <Box mb={5}>
                <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={19}
                >
                    <Text style={styles.currentDate}>
                        {`${months[activeDate.getMonth()]}, ${activeDate.getFullYear()}`}
                    </Text>
                    <Box
                        width={65}
                        height={31}
                        borderRadius={6}
                        backgroundColor="rgba(0, 59, 114, 0.1)"
                        justifyContent="center"
                        alignItems="center"
                        mr={1}
                    >
                        <Flex flexDirection="row" alignItems="center">
                            <TouchableOpacity
                                style={{
                                    height: " 100%",
                                    width: "50%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onPress={() => changeMonth(-1)}
                            >
                                <Icon name="ups" size={16} color={'#00A8B5'}/>
                            </TouchableOpacity>
                            <Flex opacity={0.1} mr={0} ml={0}>
                                <Icon name="|"/>
                            </Flex>
                            <TouchableOpacity
                                style={{
                                    height: " 100%",
                                    width: "50%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onPress={() => changeMonth(+1)}
                            >
                                <Icon name="down" size={16} color={'#00A8B5'}/>
                            </TouchableOpacity>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
            <View style={{...styles.rowContainer}}>
                {weekDays.map((item, index) => (
                    <Box style={styles.date} key={String(index)}>
                        <Text key={index} color="black" fontSize={18}>
                            {item}
                        </Text>
                    </Box>
                ))}
            </View>
            <Box height={1} bg="#636363" opacity={0.3} mt={1} ml={1} mr={1} mb={1}/>
            <View style={styles.rowContainer}>{renderRow()}</View>
            <Box
                mt={5}
                mb={5}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Text color="#636363" fontSize={18} fontWeight={400}>
                    {checkToday(activeDate)}{" "}
                    {` ${activeDate.getDate()}/${activeDate.getMonth() + 1
                    }/${activeDate.getFullYear()}`}
                </Text>
                <TouchableOpacity onPress={handleCreateNote}>
                    <Flex flexDirection="row">
                        <Flex
                            flexDirection="row"
                            width={105}
                            height={31}
                            bg="#00A8B5"
                            borderRadius={6}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Icon name="add-calendar" size={17} color={'white'}/>
                            <Flex style={{marginLeft: 10}}>
                                <Text color="white" fontSize={10} fontWeight={600}>
                                    Tạo ghi chú
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </TouchableOpacity>
            </Box>
            {notes.length !== 0 &&
                notes.map(
                    (
                        note: any,
                        index: any
                    ) => {
                        return (
                            <NoteItem
                                title={note.noteContentTitle}
                                key={String(index)}
                                id={note.id}
                                content={note.noteContentContent}
                                date={note.noteContentDate}
                            />
                        );
                    }
                )}
            <Box height={30}></Box>
            {NoteModal()}
            {DeleteNoteModal()}
            {DeleteNotiModal()}
        </Box>
    );
}

export default Calendar;

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    dateWeek: {
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    date: {
        height: screenWidth / 8,
        width: screenWidth / 8,
        justifyContent: "center",
        alignItems: "center",
    },
    activeDate: {
        backgroundColor: DefaultTheme.primary,
        borderRadius: screenWidth / 14,
    },
    inActiveDate: {backgroundColor: "#fff"},
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        flex: 1,
    },
    currentDate: {fontWeight: "700", fontSize: 20, color: "#014F59"},
    unActiveDate: {},
    dot: {
        width: 5,
        height: 5,
    },
});
