package com.aladin.service.dto;

import javax.persistence.Id;
import java.util.Date;

public class ExamsDTO {
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




    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExamName() {
        return this.examName;
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

    public String getExamStatus() {
        return examStatus;
    }

    public void setExamStatus(String examStatus) {
        this.examStatus = examStatus;
    }

}
