package com.aladin.service.dto;

import javax.validation.constraints.Null;
import java.io.Serializable;

public class CourseManagerDTO implements Serializable {

     private Long courseId;
     private String courseName;
     private String studentName;
     private Float percentLesson;
     private Float percentExams;
     private Long studentId;
     private String studentCode;

    public CourseManagerDTO(Long courseId,String courseName, String studentName, Float percentLesson, Float percentExams, Long studentId,String studentCode) {
        if (courseId==null){
            courseId=0000L;
        }
        if (courseName==null){
            courseName="";
        }
        if (studentName==null){
            studentName="";
        }
        if (percentLesson==null){
            percentLesson=Float.valueOf("0");
        }
        if (percentExams==null){
            percentExams=Float.valueOf("0");
        }
        if (studentId==null){
            studentId=00000L;
        }
        if (studentCode==null){
            studentCode="";
        }
        this.courseId=courseId;
        this.courseName = courseName;
        this.studentName = studentName;
        this.percentLesson = percentLesson;
        this.percentExams = percentExams;
        this.studentId = studentId;
        this.studentCode=studentCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Float getPercentLesson() {
        return percentLesson;
    }

    public void setPercentLesson(Float percentLesson) {
        this.percentLesson = percentLesson;
    }

    public Float getPercentExams() {
        return percentExams;
    }

    public void setPercentExams(Float percentExams) {
        this.percentExams = percentExams;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
