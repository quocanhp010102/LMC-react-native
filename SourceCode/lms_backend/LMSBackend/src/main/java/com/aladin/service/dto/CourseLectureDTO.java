package com.aladin.service.dto;

import java.io.Serializable;

public class CourseLectureDTO implements Serializable {

    Long courseId;
    String courseName;
    String courseImage;
    String historyTime;

    public CourseLectureDTO() {
    }

    public CourseLectureDTO(Long courseId, String courseName, String courseImage) {
        if (courseId==null){
            courseId=0000L;
        }
        if (courseName==null){
            courseName="";
        }
        if (courseImage==null){
            courseImage="";
        }
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseImage = courseImage;
    }

    public CourseLectureDTO(Long courseId, String courseName, String courseImage, String historyTime) {
        if (courseId==null){
            courseId=0000L;
        }
        if (courseName==null){
            courseName="";
        }
        if (courseImage==null){
            courseImage="";
        }
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseImage = courseImage;
        this.historyTime= historyTime;

    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
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

    public String getHistoryTime() {
        return historyTime;
    }

    public void setHistoryTime(String historyTime) {
        this.historyTime = historyTime;
    }
}
