import React, {memo} from "react";
import {NavLink} from "../../../platform/links";
import {Box, Text} from "../../../rebass";

interface Props {
    choose: (id: number) => void;
    isSelected: boolean;
    data: any;
    setType: (value: any) => void;
    index: number;
    getData: () => void;
    setModalVisibleNotifi: (value: boolean) => void;
    setEditTitle: (value: string) => void;
    setListClass: (vaue: any) => void;
    listClass: any;
}

const genericMemo: <T>(component: T) => T = memo;
export const ClassList: React.FC<Props> = genericMemo((props: Props) => {
    const {
        data,
        index,
        setType,
        getData,
        setModalVisibleNotifi,
        setEditTitle,
        setListClass,
        listClass,
    } = props;
    


    // @ts-ignore
    // @ts-ignore
    return (
        <Box
            style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
                backgroundColor:
                    index % 2 === 0 ? "#E5F3F8" : "white",
            }}
        >
          

            <Box
                style={{
                    width: "25%",
                    flexDirection: "row",
                }}
            >
                <Box
                    style={{
                        width: 1,
                        backgroundColor: "#D4D4D4",
                    }}
                ></Box>
                <Box
                    height={40}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <NavLink

                        {...{
                            route: "/chinh-sua-lop",
                            params: {
                                data: data,
                                setType: setType,
                                getData: getData,
                                listClass: listClass,
                                setListClass: setListClass,
                                setModalVisibleNotifi: setModalVisibleNotifi,
                                setEditTitle: setEditTitle,
                            },
                        }}
                    >
                        <Box>
                            <Text
                                style={{
                                    color: "#636363",
                                    fontSize: 12,
                                    textAlign: "center",
                                }}
                            >
                                {data?.classroomCode}
                            </Text>
                            <Box height={1} bg="#636363"></Box>
                        </Box>
                    </NavLink>

                </Box>
            </Box>
            <Box
                style={{
                    width: "60%",
                    flexDirection: "row",
                }}
            >
                <Box
                    style={{
                        width: 1,
                        backgroundColor: "#D4D4D4",
                    }}
                ></Box>
                <Box
                    height={40}
                    style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#636363",
                            fontSize: 12,

                            textAlign: "center",
                        }}
                    >
                        {data?.classroomName}
                    </Text>
                </Box>
            </Box>
            <Box
                style={{
                    width: "15%",
                    flexDirection: "row",
                }}
            >
                <Box
                    height={40}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            color: "#636363",
                            fontSize: 12,
                            textAlign: "center",
                        }}
                    >
                        {data?.classroomTotalStudent}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
});
