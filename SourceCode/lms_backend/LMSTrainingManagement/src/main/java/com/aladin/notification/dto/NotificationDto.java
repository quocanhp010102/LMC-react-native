package com.aladin.notification.dto;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

public class NotificationDto {
    private Long id;

    private String notificationTitle;

    private String notificationContent;

    private Date notificationTime;

    private List<String> authorities;

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

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }

    public NotificationDto() {
    }

    public NotificationDto(Long id, String notificationTitle, String notificationContent, Date notificationTime, List<String> authorities) {
        this.id = id;
        this.notificationTitle = notificationTitle;
        this.notificationContent = notificationContent;
        this.notificationTime = notificationTime;
        this.authorities = authorities;
    }
}
