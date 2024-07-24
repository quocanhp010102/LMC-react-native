package com.aladin.service.dto;


import com.aladin.domain.Student;

import java.util.ArrayList;
import java.util.List;

public class ClassRoomDto {
    private Long id;

    private String CLASSROOM_NAME;

    private int CLASSROOM_TOTAL_STUDENT;

    private int DEPARTMENT_ID;

    private List<Student> studentList = new ArrayList<>();
    public ClassRoomDto() {
    }

    public ClassRoomDto(Long id, String CLASSROOM_NAME, int CLASSROOM_TOTAL_STUDENT, int DEPARTMENT_ID, List<Student> studentList) {
        this.id = id;
        this.CLASSROOM_NAME = CLASSROOM_NAME;
        this.CLASSROOM_TOTAL_STUDENT = CLASSROOM_TOTAL_STUDENT;
        this.DEPARTMENT_ID = DEPARTMENT_ID;
        this.studentList = studentList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCLASSROOM_NAME() {
        return CLASSROOM_NAME;
    }

    public void setCLASSROOM_NAME(String CLASSROOM_NAME) {
        this.CLASSROOM_NAME = CLASSROOM_NAME;
    }

    public int getCLASSROOM_TOTAL_STUDENT() {
        return CLASSROOM_TOTAL_STUDENT;
    }

    public void setCLASSROOM_TOTAL_STUDENT(int CLASSROOM_TOTAL_STUDENT) {
        this.CLASSROOM_TOTAL_STUDENT = CLASSROOM_TOTAL_STUDENT;
    }

    public int getDEPARTMENT_ID() {
        return DEPARTMENT_ID;
    }

    public void setDEPARTMENT_ID(int DEPARTMENT_ID) {
        this.DEPARTMENT_ID = DEPARTMENT_ID;
    }

    public List<Student> getStudentList() {
        return studentList;
    }

    public void setStudentList(List<Student> studentList) {
        this.studentList = studentList;
    }
}
