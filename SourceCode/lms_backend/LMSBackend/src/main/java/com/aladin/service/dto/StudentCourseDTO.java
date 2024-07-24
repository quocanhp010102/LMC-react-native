package com.aladin.service.dto;

import com.aladin.domain.Classroom;
import com.aladin.domain.CourseStudent;
import com.aladin.domain.Student;

import java.util.HashSet;
import java.util.Set;

public class StudentCourseDTO {


    private String studentCode;
    private String studentName;

    private String className;

    public StudentCourseDTO(String studentCode, String studentName, String className) {
        this.studentCode = studentCode;
        this.studentName = studentName;
        this.className = className;
    }

    public StudentCourseDTO(Student student) {
        this.studentCode=student.getStudent_code();
        this.studentName = student.getStudent_fullname();
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}
