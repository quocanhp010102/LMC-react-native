package com.aladin.service.dto;

import java.sql.Timestamp;
import java.util.Date;

public class ExamsHistoryOfStudentOfCourse {

    private String studentName;

    private String examsName;

    private Date examsDateSubmit;

    private String examsPoint;

    private Long examsId;

    private Long courseId;

    private Long typeOfExams;

    public Long getTypeOfExams() {
        return typeOfExams;
    }

    public void setTypeOfExams(Long typeOfExams) {
        this.typeOfExams = typeOfExams;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getExamsName() {
        return examsName;
    }

    public void setExamsName(String examsName) {
        this.examsName = examsName;
    }

    public Date getExamsDateSubmit() {
        return examsDateSubmit;
    }

    public void setExamsDateSubmit(Timestamp examsDateSubmit) {
        this.examsDateSubmit = examsDateSubmit;
    }

    public String getExamsPoint() {
        return examsPoint;
    }

    public void setExamsPoint(String examsPoint) {
        this.examsPoint = examsPoint;
    }

    public Long getExamsId() {
        return examsId;
    }

    public void setExamsId(Long examsId) {
        this.examsId = examsId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public ExamsHistoryOfStudentOfCourse(String studentName,
                                         String examsName,
                                         Date examsDateSubmit,
                                         String examsPoint,
                                         Long examsId,
                                         Long courseId
                                         ) {
        this.studentName = studentName;
        this.examsName = examsName;
        this.examsDateSubmit = examsDateSubmit;
        this.examsPoint = examsPoint;
        this.examsId = examsId;
        this.courseId = courseId;
    }

    public ExamsHistoryOfStudentOfCourse(String studentName,
                                         String examsName,
                                         Date examsDateSubmit,
                                         String examsPoint,
                                         Long examsId,
                                         Long courseId,
                                         Long typeOfExams
    ) {
        this.studentName = studentName;
        this.examsName = examsName;
        this.examsDateSubmit = examsDateSubmit;
        this.examsPoint = examsPoint;
        this.examsId = examsId;
        this.courseId = courseId;
        this.typeOfExams = typeOfExams;
    }

    public ExamsHistoryOfStudentOfCourse() {
    }
}
