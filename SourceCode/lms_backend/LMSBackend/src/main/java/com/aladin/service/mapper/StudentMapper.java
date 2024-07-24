package com.aladin.service.mapper;

import com.aladin.domain.Authority;
import com.aladin.domain.Lecturer;
import com.aladin.domain.Student;
import com.aladin.service.dto.LecturersOnlyDto;
import com.aladin.service.dto.StudentCourseDTO;
import com.aladin.service.dto.StudentsOnlyDTO;

import java.util.stream.Collectors;

public class StudentMapper {
    private static StudentMapper INSTANCE;

    public static StudentMapper getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new StudentMapper();
        }
        return INSTANCE;
    }

//    public StudentCourseDTO toDTO(Student student) {
//        StudentCourseDTO dto = new StudentCourseDTO();
//        dto.setStudentCode(student.getStudent_code());
//        dto.setStudentName(student.getStudent_fullname());
//        return dto;
//    }
}
