package com.aladin.service.dto;

public class ActivityHistory {
    private String activitiHistoryName;

    private String activityHistoryTime;

    public ActivityHistory(String activitiHistoryName, String activityHistoryTime) {
        this.activitiHistoryName = activitiHistoryName;
        this.activityHistoryTime = activityHistoryTime;
    }

    public ActivityHistory() {
    }

    public String getActivitiHistoryName() {
        return activitiHistoryName;
    }

    public void setActivitiHistoryName(String activitiHistoryName) {
        this.activitiHistoryName = activitiHistoryName;
    }

    public String getActivityHistoryTime() {
        return activityHistoryTime;
    }

    public void setActivityHistoryTime(String activityHistoryTime) {
        this.activityHistoryTime = activityHistoryTime;
    }
}
