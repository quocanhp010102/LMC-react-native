package com.aladin.notification.dto;

public class HistoryDto {
    private String historyName;
    private String historyTime;
    private Long courseId;
    private Long lessonId;
    private String userId;

    public HistoryDto(String historyName, String historyTime, Long courseId, Long lessonId, String userId) {
        this.historyName = historyName;
        this.historyTime = historyTime;
        this.courseId = courseId;
        this.lessonId = lessonId;
        this.userId = userId;
    }

    public String getHistoryName() {
        return historyName;
    }

    public void setHistoryName(String historyName) {
        this.historyName = historyName;
    }

    public String getHistoryTime() {
        return historyTime;
    }

    public void setHistoryTime(String historyTime) {
        this.historyTime = historyTime;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public HistoryDto() {
    }
}
