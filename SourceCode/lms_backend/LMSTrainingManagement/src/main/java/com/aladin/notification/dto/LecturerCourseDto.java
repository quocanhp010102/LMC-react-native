package com.aladin.notification.dto;

public class LecturerCourseDto {
    private String courseName;
    private Long lecturerId;
    private String senderId;

    public LecturerCourseDto(String courseName, Long lecturerId, String senderId) {
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

    public Long getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Long lecturerId) {
        this.lecturerId = lecturerId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }
}
