package com.aladin.web.rest.dto;

import java.time.LocalDate;
import java.util.List;

public class TutorialDto {
    private Long id;
    private String tutorial_title;
    private String tutorial_video;
    private LocalDate tutorial_createdDate;
    private String tutorial_isDisplay;
    private List<String> authorities;
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TutorialDto() {

    }

    public String getTutorial_title() {
        return tutorial_title;
    }

    public void setTutorial_title(String tutorial_title) {
        this.tutorial_title = tutorial_title;
    }

    public String getTutorial_video() {
        return tutorial_video;
    }

    public void setTutorial_video(String tutorial_video) {
        this.tutorial_video = tutorial_video;
    }

    public LocalDate getTutorial_createdDate() {
        return tutorial_createdDate;
    }

    public void setTutorial_createdDate(LocalDate tutorial_createdDate) {
        this.tutorial_createdDate = tutorial_createdDate;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTutorial_isDisplay() {
        return tutorial_isDisplay;
    }

    public void setTutorial_isDisplay(String tutorial_isDisplay) {
        this.tutorial_isDisplay = tutorial_isDisplay;
    }
}
