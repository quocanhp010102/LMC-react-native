package com.aladin.service.dto;

import com.aladin.domain.Course;
import com.aladin.domain.Lesson;
import com.aladin.domain.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

public class HistoryDto {


    private Long id;

    private String historyName;

    private String historyTime;

    private Course course;

    private Lesson lesson;

    private User user;
}
