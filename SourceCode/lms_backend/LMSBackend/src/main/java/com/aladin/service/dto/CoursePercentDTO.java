package com.aladin.service.dto;

import java.io.Serializable;

public class CoursePercentDTO implements Serializable {
    Long courseId;
    String courseName;
    String courseImage;
    Float percent;
    Long courseStudentId;



    public CoursePercentDTO() {
    }

    public CoursePercentDTO(Long courseId, String courseName, String courseImage, Float percent, Long courseStudentId) {

        if (courseId==null){
            courseId=0000L;
        }
        if (courseName==null){
            courseName="";
        }
        if (courseImage==null){
            courseImage="";
        }
        if (percent==null){
            percent=Float.valueOf("0");
        }

        if (courseStudentId==null){
            courseStudentId=0000L;
        }

        this.courseId = courseId;
        this.courseName = courseName;
        this.courseImage = courseImage;
        this.percent = percent;
        this.courseStudentId=courseStudentId;
    }

    public CoursePercentDTO(Long courseId, String courseName, String courseImage, Float percent) {

        if (courseId==null){
            courseId=0000L;
        }
        if (courseName==null){
            courseName="";
        }
        if (courseImage==null){
            courseImage="";
        }
        if (percent==null){
            percent=Float.valueOf("0");
        }

        this.courseId = courseId;
        this.courseName = courseName;
        this.courseImage = courseImage;
        this.percent = percent;
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

    public Float getPercent() {
        return percent;
    }

    public void setPercent(Float percent) {
        this.percent = percent;
    }

    public Long getCourseStudentId() {
        return courseStudentId;
    }

    public void setCourseStudentId(Long courseStudentId) {
        this.courseStudentId = courseStudentId;
    }
}
