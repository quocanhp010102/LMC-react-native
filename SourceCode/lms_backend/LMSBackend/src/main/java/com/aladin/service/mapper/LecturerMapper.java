package com.aladin.service.mapper;

import com.aladin.domain.Authority;
import com.aladin.domain.Lecturer;
import com.aladin.service.dto.LecturersOnlyDto;

import java.util.stream.Collectors;

public class LecturerMapper {
    private static LecturerMapper INSTANCE;

    public static LecturerMapper getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new LecturerMapper();
        }
        return INSTANCE;
    }

//    public LecturersOnlyDto toDTO(Lecturer lecturer) {
//        LecturersOnlyDto dto = new LecturersOnlyDto();
//        dto.setUserId(lecturer.getUser().getId());
//        dto.setLogin(lecturer.getUser().getLogin());
//        dto.setUserName(lecturer.getLecturer_fullname());
//        dto.setAuthorities(lecturer.getUser().getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet()));
//        return dto;
//    }
}
