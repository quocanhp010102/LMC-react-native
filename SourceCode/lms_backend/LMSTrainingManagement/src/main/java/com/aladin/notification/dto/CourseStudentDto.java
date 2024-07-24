package com.aladin.notification.dto;

import com.aladin.domain.CourseStudent;

public class CourseStudentDto {

    private String senderId;
    private String courseName;
    private String receiverId;
    private String receiverEmail;

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public CourseStudentDto(String senderId, String courseName, String receiverId, String receiverEmail) {
        this.senderId = senderId;
        this.courseName = courseName;
        this.receiverId = receiverId;
        this.receiverEmail = receiverEmail;
    }

    public CourseStudentDto() {
    }
}
