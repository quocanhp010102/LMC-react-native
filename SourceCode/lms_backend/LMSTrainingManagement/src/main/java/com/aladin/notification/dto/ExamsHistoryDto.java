package com.aladin.notification.dto;

public class ExamsHistoryDto {
    private String senderId;
    private Long receiverId;
    private Long examsId;

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public Long getExamsId() {
        return examsId;
    }

    public void setExamsId(Long examsId) {
        this.examsId = examsId;
    }

    public ExamsHistoryDto() {
    }

    public ExamsHistoryDto(String senderId, Long receiverId, Long examsId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.examsId = examsId;
    }
}
