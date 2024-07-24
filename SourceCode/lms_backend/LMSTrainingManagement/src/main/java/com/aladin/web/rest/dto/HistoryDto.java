package com.aladin.web.rest.dto;

public class HistoryDto {

    private CourseDto course;
    private LessonDto lesson;
    private String method;
    private String name;

    public HistoryDto(CourseDto course, LessonDto lesson, String method, String name) {
        this.course = course;
        this.lesson = lesson;
        this.method = method;
        this.name = name;
    }

    public HistoryDto() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CourseDto getCourse() {
        return course;
    }

    public void setCourse(CourseDto course) {
        this.course = course;
    }

    public LessonDto getLesson() {
        return lesson;
    }

    public void setLesson(LessonDto lesson) {
        this.lesson = lesson;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

}
