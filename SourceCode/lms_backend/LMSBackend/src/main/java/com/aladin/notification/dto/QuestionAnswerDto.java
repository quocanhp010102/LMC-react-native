package com.aladin.notification.dto;

public class QuestionAnswerDto {
    private Long id;
    private String name;
    private String senderId;
    private String receiverId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public QuestionAnswerDto() {
    }

    public QuestionAnswerDto(Long id, String name, String senderId, String receiverId) {
        this.id = id;
        this.name = name;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
}
