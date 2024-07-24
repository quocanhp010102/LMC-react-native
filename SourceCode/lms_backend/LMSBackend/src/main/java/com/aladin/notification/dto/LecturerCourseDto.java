package com.aladin.notification.dto;

public class LecturerCourseDto {
    private String courseName;
    private String lecturerId;
    private String senderId;

    public LecturerCourseDto(String courseName, String lecturerId, String senderId) {
        this.courseName = courseName;
        this.lecturerId = lecturerId;
        this.senderId = senderId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(String lecturerId) {
        this.lecturerId = lecturerId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }
}
