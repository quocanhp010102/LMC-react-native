package com.aladin.service.dto;

import com.aladin.domain.Authority;

public class RoleDto {
    private String roleName;

    public RoleDto() {
    }

    public RoleDto(Authority authority) {
        this.roleName = authority.getName();
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
