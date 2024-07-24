package com.aladin.notification.dto;

public class ReceiverDto {
    private String id;
    private String email;

    public ReceiverDto(String id, String email) {
        this.id = id;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ReceiverDto() {
    }

    @Override
    public String toString() {
        return "ReceiverDto{" +
            "id=" + id +
            ", email='" + email + '\'' +
            '}';
    }
}
