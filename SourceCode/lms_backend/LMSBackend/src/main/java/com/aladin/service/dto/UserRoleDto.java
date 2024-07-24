package com.aladin.service.dto;

import com.aladin.domain.Authority;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

public class UserRoleDto implements Serializable {
    private String userCode;

    private String Login;
    private String userName;
    private String authorities;

    public UserRoleDto() {
    }

    public UserRoleDto(String userCode, String login, String userName, String authorities) {
        this.userCode = userCode;
        Login = login;
        this.userName = userName;
        this.authorities = authorities;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAuthorities() {
        return authorities;
    }

    public void setAuthorities(String authorities) {
        this.authorities = authorities;
    }

    public String getLogin() {
        return Login;
    }

    public void setLogin(String login) {
        Login = login;
    }

}
