package com.aladin.service.dto;

import java.io.Serializable;

public class CourseDepartmentDTO  implements Serializable {
    private Long courseID;
    private String courseName;
    private String coursesSemester;
    private String lectureName;
    private String totalStudent;

    public CourseDepartmentDTO(Long courseID, String courseName, String coursesSemester, String lectureName, String totalStudent) {
        this.courseID = courseID;
        this.courseName = courseName;
        this.coursesSemester = coursesSemester;
        this.lectureName = lectureName;
        this.totalStudent = totalStudent;
    }

    public CourseDepartmentDTO() {
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCoursesSemester() {
        return coursesSemester;
    }

    public void setCoursesSemester(String coursesSemester) {
        this.coursesSemester = coursesSemester;
    }

    public String getLectureName() {
        return lectureName;
    }

    public void setLectureName(String lectureName) {
        this.lectureName = lectureName;
    }

    public String getTotalStudent() {
        return totalStudent;
    }

    public void setTotalStudent(String totalStudent) {
        this.totalStudent = totalStudent;
    }

    public Long getCourseID() {
        return courseID;
    }

    public void setCourseID(Long courseID) {
        this.courseID = courseID;
    }

    @Override
    public String toString() {
        return "CourseDepartmentDTO{" +
            "courseName='" + courseName + '\'' +
            ", coursesSemester='" + coursesSemester + '\'' +
            ", lectureName='" + lectureName + '\'' +
            ", totalStudent=" + totalStudent +
            '}';
    }
}
