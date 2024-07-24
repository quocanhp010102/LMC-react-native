package com.aladin.web.rest.dto;

import com.aladin.domain.ExamsHistory;
import com.aladin.domain.Student;

import java.util.List;

public class ExamsStudentDto {
    private Student student;
    private List<ExamsHistory> examsHistories;

    public ExamsStudentDto(Student student, List<ExamsHistory> examsHistories) {
        this.student = student;
        this.examsHistories = examsHistories;
    }

    public ExamsStudentDto() {
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public List<ExamsHistory> getExamsHistories() {
        return examsHistories;
    }

    public void setExamsHistories(List<ExamsHistory> examsHistories) {
        this.examsHistories = examsHistories;
    }
}
