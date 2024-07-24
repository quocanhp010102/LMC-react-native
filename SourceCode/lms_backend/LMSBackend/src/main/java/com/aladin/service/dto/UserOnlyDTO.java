package com.aladin.service.dto;

public class UserOnlyDTO {
    private String id;
    private String fullname;
    private String role;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserOnlyDTO(String id, String fullname, String role) {
        this.id = id;
        this.fullname = fullname;
        this.role = role;
    }
}
