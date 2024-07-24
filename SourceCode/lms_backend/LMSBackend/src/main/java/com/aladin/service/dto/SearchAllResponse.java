package com.aladin.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Date;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchAllResponse {
    private Integer id;
    private Long amount;
    private String type;
    private String reason;
    private String index;
    private String news_title;
    private String first_day_work;
    private String displayInfo;
    private String news_content;
    private Date news_date;
    private String news_image;


    public SearchAllResponse() {

    }

    public SearchAllResponse(Integer id, String position, String description, String require, String benefit, Long amount, String job, String location, String level, Date duration, String type, String reason, String index, String full_name, String avatar, String email, String date_of_birth, String first_day_work, String phone_number, String displayInfo) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.reason = reason;
        this.index = index;
        this.news_title = email;
        this.first_day_work = first_day_work;
        this.displayInfo = displayInfo;
    }

    public String getNews_content() {
        return news_content;
    }

    public void setNews_content(String news_content) {
        this.news_content = news_content;
    }

    public SearchAllResponse(Integer id, String position, String description, String require, String benefit, Long amount, String job, String location, String level, Date duration, String type, String reason, String index, String full_name, String avatar, String email, String date_of_birth, String first_day_work, String phone_number, String displayInfo, String countryside) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.reason = reason;
        this.index = index;
        this.news_title = email;
        this.first_day_work = first_day_work;
        this.displayInfo = displayInfo;
        this.news_content = countryside;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }


    public String getNews_title() {
        return news_title;
    }

    public void setNews_title(String news_title) {
        this.news_title = news_title;
    }


    public String getFirst_day_work() {
        return first_day_work;
    }

    public void setFirst_day_work(String first_day_work) {
        this.first_day_work = first_day_work;
    }


    public String getDisplayInfo() {
        return displayInfo;
    }

    public void setDisplayInfo(String displayInfo) {
        this.displayInfo = displayInfo;
    }

    public Date getNews_date() {
        return news_date;
    }

    public void setNews_date(Date news_date) {
        this.news_date = news_date;
    }

    public String getNews_image() {
        return news_image;
    }

    public void setNews_image(String news_image) {
        this.news_image = news_image;
    }
}
