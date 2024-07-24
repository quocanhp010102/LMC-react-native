package com.aladin.service.dto;

public class StudentsDTO {
    private String courseName;
    private String StudentName;
    private float progress;

    public StudentsDTO() {
    }

    public StudentsDTO(String courseName, String studentName, float progress) {
        this.courseName = courseName;
        StudentName = studentName;
        this.progress = progress;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getStudentName() {
        return StudentName;
    }

    public void setStudentName(String studentName) {
        StudentName = studentName;
    }

    public float getProgress() {
        return progress;
    }

    public void setProgress(float progress) {
        this.progress = progress;
    }
}
