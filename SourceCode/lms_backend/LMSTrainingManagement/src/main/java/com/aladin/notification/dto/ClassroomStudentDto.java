package com.aladin.notification.dto;

import com.aladin.domain.Classroom;
import com.aladin.domain.ClassroomStudent;
import com.aladin.domain.Student;

public class ClassroomStudentDto {
   private String senderId;
   private String classroomName;
   private String receiverId;
    private String receiverEmail;

    public String getClassroomName() {
        return classroomName;
    }

    public void setClassroomName(String classroomName) {
        this.classroomName = classroomName;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public ClassroomStudentDto() {
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public ClassroomStudentDto(String senderId, String classroomName, String receiverId, String receiverEmail) {
        this.senderId = senderId;
        this.classroomName = classroomName;
        this.receiverId = receiverId;
        this.receiverEmail = receiverEmail;
    }
}
