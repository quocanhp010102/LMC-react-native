package com.aladin.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

public class  CourseOnlyDTO implements Serializable {
    private Long id;
    String courseName;
    String lectureName;
    String courseImage;
    LocalDate courseCreatedDate;
    int totalStudent;
    int courseTotalExams;
    int courseToTalLesson;

    public CourseOnlyDTO(Long id, String courseName, String lectureName, LocalDate courseCreatedDate, int totalStudent, int courseTotalExams, int courseToTalLesson, String courseImage) {
        this.id = id;
        this.courseName = courseName;
        this.lectureName = lectureName;
        this.courseCreatedDate = courseCreatedDate;
        this.totalStudent = totalStudent;
        this.courseTotalExams = courseTotalExams;
        this.courseToTalLesson = courseToTalLesson;
        this.courseImage=courseImage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(String courseImage) {
        this.courseImage = courseImage;
    }

    public String getLectureName() {
        return lectureName;
    }

    public void setLectureName(String lectureName) {
        this.lectureName = lectureName;
    }

    public LocalDate getCourseCreatedDate() {
        return courseCreatedDate;
    }

    public void setCourseCreatedDate(LocalDate courseCreatedDate) {
        this.courseCreatedDate = courseCreatedDate;
    }

    public int getTotalStudent() {
        return totalStudent;
    }

    public void setTotalStudent(int totalStudent) {
        this.totalStudent = totalStudent;
    }

    public int getCourseTotalExams() {
        return courseTotalExams;
    }

    public void setCourseTotalExams(int courseTotalExams) {
        this.courseTotalExams = courseTotalExams;
    }

    public int getCourseToTalLesson() {
        return courseToTalLesson;
    }

    public void setCourseToTalLesson(int courseToTalLesson) {
        this.courseToTalLesson = courseToTalLesson;
    }

    public CourseOnlyDTO() {
    }
}
