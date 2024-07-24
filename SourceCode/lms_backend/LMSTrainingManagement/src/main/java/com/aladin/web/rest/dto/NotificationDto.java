package com.aladin.web.rest.dto;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

public class NotificationDto {
    private Long id;

    private String notificationTitle;

    private String notificationContent;

    private Date notificationTime;

    private  String notificationStatus;

    private String receiverId;

    private String receiverImg;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotificationTitle() {
        return notificationTitle;
    }

    public void setNotificationTitle(String notificationTitle) {
        this.notificationTitle = notificationTitle;
    }

    public String getNotificationContent() {
        return notificationContent;
    }

    public void setNotificationContent(String notificationContent) {
        this.notificationContent = notificationContent;
    }

    public Date getNotificationTime() {
        return notificationTime;
    }

    public void setNotificationTime(Date notificationTime) {
        this.notificationTime = notificationTime;
    }

    public String getNotificationStatus() {
        return notificationStatus;
    }

    public void setNotificationStatus(String notificationStatus) {
        this.notificationStatus = notificationStatus;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverImg() {
        return receiverImg;
    }

    public void setReceiverImg(String receiverImg) {
        this.receiverImg = receiverImg;
    }

    public NotificationDto() {
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiver_id(String receiverId) {
        this.receiverId = receiverId;
    }

    public NotificationDto(Long id, String notificationTitle, String notificationContent, Date notificationTime, String notificationStatus) {
        this.id = id;
        this.notificationTitle = notificationTitle;
        this.notificationContent = notificationContent;
        this.notificationTime = notificationTime;
        this.notificationStatus = notificationStatus;
    }

    public NotificationDto(Long id, String notificationTitle, String notificationContent, Date notificationTime, String notificationStatus, String receiverId) {
        this.id = id;
        this.notificationTitle = notificationTitle;
        this.notificationContent = notificationContent;
        this.notificationTime = notificationTime;
        this.notificationStatus = notificationStatus;
        this.receiverId = receiverId;
    }

    public NotificationDto(Long id, String notificationTitle, String notificationContent, Date notificationTime, String notificationStatus, String receiverId, String receiverImg) {
        this.id = id;
        this.notificationTitle = notificationTitle;
        this.notificationContent = notificationContent;
        this.notificationTime = notificationTime;
        this.notificationStatus = notificationStatus;
        this.receiverId = receiverId;
        this.receiverImg = receiverImg;
    }


}
