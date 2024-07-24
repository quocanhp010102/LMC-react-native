import React, {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, ScrollView, StyleSheet,} from "react-native";
import {CardSpecialized} from "../../components/CardSpecialized";
import {Devider} from "../../components/Devider";
import {Header, NotificationIcon} from "../../components/Header";
import {Box, Flex, Text} from "../../rebass";
import {DepartmentApi} from "../../services/api/Departments/DepartmentApi";
import {generateApiService} from "../../services/ApiService";
import {NavLink} from "../../platform/links";

const renderData = (departments: any , englishType ?: boolean) => {
    const renderItem = ({item, index}: any) => {
        return (
            <Flex
                key={item.id}
                flex={1}
                flexDirection="row"
                flexWrap="wrap"
                alignItems="flex-start"
                justifyContent="space-between"
            >
                <NavLink
                    {...{
                        route: "/chi-tiet-khoa",
                        params: {
                            id_department: item.id,
                            name : item.department_name
                        },
                    }}
                >
                    <CardSpecialized
                        title={item.department_name}
                        image={item.department_image}
                        course={item.countCourse}
                        englishType={englishType}
                    ></CardSpecialized>
                </NavLink>
            </Flex>
        );
    };
    return (
        <FlatList
            data={departments}
            initialNumToRender={8}
            keyExtractor={(item, index) => String(index)}
            numColumns={2}
            renderItem={renderItem}
        />
    );
};

const DepartmentsScreen = () => {
    const [basicDepartments, setBasicDepartments] = useState<any>([]);
    const [ennglishDepartments, setEnglishDepartments] = useState<any>([]);
    const [loadingBasic, setLoadingBasic] = useState<boolean>(false);
    const [loadingEnglish, setLoadingEnglish] = useState<boolean>(false);
    const getBasicDepartments = async () => {
        setLoadingBasic(true);
        try {
            const dataBasicDepartments = await generateApiService.get(
                DepartmentApi.getBasicDepartments()
            );
            if (dataBasicDepartments) {
                setBasicDepartments(dataBasicDepartments.content);
                setLoadingBasic(false);
            }
        } catch (error) {
            setLoadingBasic(false);
        }
    };
    const getEnglishDepartments = async () => {
        setLoadingEnglish(true);
        try {
            const dataEnglishDepartments = await generateApiService.get(
                DepartmentApi.getEnglishDepartments()
            );
            if (dataEnglishDepartments) {
                setEnglishDepartments(dataEnglishDepartments.content);
                setLoadingEnglish(false);
            }
        } catch (error) {
            setLoadingEnglish(false);
        }
    };

    useEffect(() => {
        getBasicDepartments();
        getEnglishDepartments();
    }, []);
    return (
        <Box bg="defaultBackground" position="relative" height="100%">
            <Box height="100%">
                <Header search title="Chuyên ngành" leftButton="back">
                    <NotificationIcon/>
                </Header>
                <Box height={1} bg="#636363" opacity={0.3} mt={2}/>
                <ScrollView
                    style={{marginBottom: 25,}}
                    showsVerticalScrollIndicator={false}
                >
                    <Flex px={16} backgroundColor='#E5F3F8' pb={26}>
                        <Text fontSize={20} fontWeight="bold" color="textColor" mt={17} textAlign={"center"}>
                            CHUYÊN NGÀNH ĐÀO TẠO CƠ BẢN
                        </Text>

                        {loadingBasic ? (
                            <ActivityIndicator size="large" color="#00A8B5"/>
                        ) : null}
                        {renderData(basicDepartments)}
                    </Flex>
                    <Flex>
                        <Flex flexDirection="row" alignItems="flex-start">
                            <Flex flex={1} mt={32}>
                                <Text fontSize={20} fontWeight="bold" color="textColor" textAlign={'center'}>
                                    CHUYÊN NGÀNH ĐÀO TẠO TIÊN TIẾN
                                </Text>
                                <Text fontSize={16} mt={2} textAlign={'center'}>
                                    (Đào tạo bằng tiếng anh)
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    {loadingEnglish ? (
                        <ActivityIndicator size="large" color="#00A8B5"/>
                    ) : null}
                    <Box px={16}>
                    {renderData(ennglishDepartments , true)}
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
};

export default DepartmentsScreen;

const styles = StyleSheet.create({});
