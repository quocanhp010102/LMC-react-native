package com.aladin.service.mapper;

import com.aladin.domain.Authority;
import com.aladin.service.dto.RoleDto;

public class RoleMapper {
    private static RoleMapper INSTANCE;
    public static RoleMapper getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new RoleMapper();
        }
        return INSTANCE;
    }

    public RoleDto toDTO(Authority authority) {
        RoleDto dto = new RoleDto();
        dto.setRoleName(authority.getName());
        return dto;
    }
}
