package com.aladin.notification.dto;

import java.io.Serializable;

public class MessageDto implements Serializable {

    private Long id;
    private String name;
    private Long senderId;

    public MessageDto(Long id, String name, Long senderId) {
        this.id = id;
        this.name = name;
        this.senderId = senderId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

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

    @Override
    public String toString() {
        return "MessageDto{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", senderId=" + senderId +
            '}';
    }

    public MessageDto() {
    }
}