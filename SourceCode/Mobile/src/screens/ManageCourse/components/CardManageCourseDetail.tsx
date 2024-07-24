import React from "react";
import { NavLink } from "../../../platform/links";
import { Box, Text } from "../../../rebass";
import { CardManageCourse } from "../../../components/CardManageCourse";

interface ICardManageCourseDetail {
  index: number;
  course: any;
}

const CardManageCourseDetail = (props: ICardManageCourseDetail) => {
  const { index, course } = props;
  return (
    <NavLink
      key={String(index)}
      {...{
        route: "/quan-li-chi-tiet-khoa-hoc",
        params: {
          course_id: course.id,
          course_title: course.courseName,
        },
      }}
    >
      <Box mb={1} ml={2} >
        <CardManageCourse title={course.courseName}>
          <Box
      
            flexDirection="row"
            flexWrap="wrap"
            alignItems="center"
            px={2}
          >
            <Text
              color="seen"
              fontSize={18}
              fontWeight="bold"
              mt={4}
              ml={2}
              width="45%"
            >
              Ngày Tạo Lập
            </Text>
            <Text color="seen" fontSize={18} mt={4} width="45%">
              {course.courseCreatedDate}
            </Text>
            <Text
              color="seen"
              fontSize={18}
              fontWeight="bold"
              mt={4}
              ml={2}
              width="45%"
            >
              Giảng Viên
            </Text>
            <Text color="seen" fontSize={18} mt={4} width="45%">
              {course.lectureName}
            </Text>
            <Text
              color="seen"
              fontSize={18}
              fontWeight="bold"
              mt={4}
              ml={2}
              width="45%"
            >
              Sĩ Số
            </Text>

            <Text color="seen" fontSize={18} mt={4} width="45%">
              {course.totalStudent}
            </Text>
            <Text
              color="seen"
              fontSize={18}
              fontWeight="bold"
              mt={4}
              ml={2}
              width="45%"
            >
              Số Bài Giảng
            </Text>

            <Text color="seen" fontSize={18} mt={4} width="45%">
              {course.courseToTalLesson}
            </Text>
            <Text
              color="seen"
              fontSize={18}
              fontWeight="bold"
              mt={4}
              ml={2}
              width="45%"
            >
              Số Bài Thi
            </Text>

            <Text color="seen" fontSize={18} mt={4} width="45%">
              {course.courseTotalExams}
            </Text>
          </Box>
        </CardManageCourse>
      </Box>
    </NavLink>
  );
};

export default CardManageCourseDetail;
