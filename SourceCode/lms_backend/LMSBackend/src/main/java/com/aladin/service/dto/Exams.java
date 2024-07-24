package com.aladin.service.dto;

import com.aladin.domain.Course;

import javax.persistence.Id;
import java.util.Date;

public class Exams {
    @Id
    private Long id;

    private String examName;

    private String examTotalStudent;

    private String examTotalStudentSubmitted;

    private String examPercentageSubmitted;

    private Date examCloseTime;

    private String examLimittedWorkingTime;

    private Date examOpenTime;

    private String examStatus;

    private TypeOfExamsDTO typeOfExams;

    private Course course;

    public Long getId() {
        return this.id;
    }

    public Exams id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExamName() {
        return this.examName;
    }

    public Exams examName(String examName) {
        this.setExamName(examName);
        return this;
    }

    public String getExamTotalStudent() {
        return examTotalStudent;
    }

    public void setExamTotalStudent(String examTotalStudent) {
        this.examTotalStudent = examTotalStudent;
    }

    public String getExamTotalStudentSubmitted() {
        return examTotalStudentSubmitted;
    }

    public void setExamTotalStudentSubmitted(String examTotalStudentSubmitted) {
        this.examTotalStudentSubmitted = examTotalStudentSubmitted;
    }

    public String getExamPercentageSubmitted() {
        return examPercentageSubmitted;
    }

    public void setExamPercentageSubmitted(String examPercentageSubmitted) {
        this.examPercentageSubmitted = examPercentageSubmitted;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public Date getExamCloseTime() {
        return examCloseTime;
    }

    public void setExamCloseTime(Date examCloseTime) {
        this.examCloseTime = examCloseTime;
    }

    public String getExamLimittedWorkingTime() {
        return examLimittedWorkingTime;
    }

    public void setExamLimittedWorkingTime(String examLimittedWorkingTime) {
        this.examLimittedWorkingTime = examLimittedWorkingTime;
    }

    public Date getExamOpenTime() {
        return examOpenTime;
    }

    public void setExamOpenTime(Date examOpenTime) {
        this.examOpenTime = examOpenTime;
    }

    public TypeOfExamsDTO getTypeOfExams() {
        return this.typeOfExams;
    }

    public String getExamStatus() {
        return examStatus;
    }

    public void setExamStatus(String examStatus) {
        this.examStatus = examStatus;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

}
