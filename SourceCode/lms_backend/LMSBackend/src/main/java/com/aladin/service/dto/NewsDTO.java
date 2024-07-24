package com.aladin.service.dto;

import com.aladin.search.helper.Indices;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Id;
import java.util.Date;

@Document(indexName = Indices.NEWS_INDEX)
public class NewsDTO {

    private static final long serialVersionUID = 1L;

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;

    @Field(type = FieldType.Text, name = "news_isDisplay")
    private String news_isDisplay;

    @Field(type = FieldType.Date, name = "news_created_date")
    private Date news_date;

    @Field(type = FieldType.Date, name = "news_title")
    private String news_title;

    @Field(type = FieldType.Date, name = "news_description")
    private String news_description;

    @Field(type = FieldType.Date, name = "news_content")
    private String news_content;

    @Field(type = FieldType.Date, name = "news_image")
    private String news_image;

    public NewsDTO() {

    }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NewsDTO id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNews_isDisplay() {
        return this.news_isDisplay;
    }

    public NewsDTO news_isDisplay(String news_isDisplay) {
        this.setNews_isDisplay(news_isDisplay);
        return this;
    }

    public void setNews_isDisplay(String news_isDisplay) {
        this.news_isDisplay = news_isDisplay;
    }

    public Date getNews_date() {
        return this.news_date;
    }

    public NewsDTO news_date(Date news_date) {
        this.setNews_date(news_date);
        return this;
    }

    public void setNews_date(Date news_date) {
        this.news_date = news_date;
    }

    public String getNews_title() {
        return this.news_title;
    }

    public NewsDTO news_title(String news_title) {
        this.setNews_title(news_title);
        return this;
    }

    public void setNews_title(String news_title) {
        this.news_title = news_title;
    }

    public String getNews_description() {
        return this.news_description;
    }

    public NewsDTO news_description(String news_description) {
        this.setNews_description(news_description);
        return this;
    }

    public void setNews_description(String news_description) {
        this.news_description = news_description;
    }

    public String getNews_content() {
        return this.news_content;
    }

    public NewsDTO news_content(String news_content) {
        this.setNews_content(news_content);
        return this;
    }

    public String getNews_image() {
        return news_image;
    }

    public void setNews_image(String news_image) {
        this.news_image = news_image;
    }

    public void setNews_content(String news_content) {
        this.news_content = news_content;
    }


    public NewsDTO(Long id, String news_isDisplay, Date news_date, String news_title, String news_description, String news_content, String news_image) {
        this.id = id;
        this.news_isDisplay = news_isDisplay;
        this.news_date = news_date;
        this.news_title = news_title;
        this.news_description = news_description;
        this.news_content = news_content;
        this.news_image = news_image;
    }
    public String getSearchField() {
        return "news_title";
    }

    public String getResponseField() {
        return "news_date,news_title,news_content,news_image";
    }
}
