package com.aladin.service.dto;

import com.aladin.domain.Authority;
import com.aladin.domain.Notification;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(indexName = "notification230")
public class NotificationDto {

    @Field(type = FieldType.Keyword)
    private Long id;

    private String notificationTitle;

    private String notificationContent;

    private Date notificationTime;

    @Field(type = FieldType.Object)
    private List<Authority> authorities;


    public NotificationDto(Notification notification) {
        this.id= notification.getId();
        this.notificationContent=notification.getNotificationContent();
        this.notificationTitle=notification.getNotificationTitle();
        this.notificationTime=notification.getNotificationTime();
        this.authorities = new ArrayList<>(notification.getAuthorities());
    }

    public NotificationDto() {
    }

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

    public List<Authority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<Authority> authorities) {
        this.authorities = authorities;
    }
}
