package com.aladin.service.dto;

import com.aladin.handletime.CustomLocalDateTimeDeserializer;
import com.aladin.handletime.CustomLocalDateTimeSerializer;
import com.aladin.search.helper.Indices;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Id;
import java.time.LocalDate;

@Document(indexName = Indices.TUTORIAL_INDEX)
public class TutorialDTO {

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;

    @Field(type = FieldType.Text, name = "tutorial_title")
    private String tutorial_title;

    @Field(type = FieldType.Text, name = "tutorial_video")
    private String tutorial_video;

    @Field(type = FieldType.Date, name = "tutorial_created_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    private LocalDate tutorial_createdDate;

    @Field(type = FieldType.Text, name = "tutorial_is_display")
    private String tutorial_isDisplay;

    @Field(type = FieldType.Text, name = "tutorial_image")
    private String tutorial_image;

    public Long getId() {
        return this.id;
    }

    public TutorialDTO id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTutorial_title() {
        return this.tutorial_title;
    }

    public TutorialDTO tutorial_title(String tutorial_title) {
        this.setTutorial_title(tutorial_title);
        return this;
    }

    public void setTutorial_title(String tutorial_title) {
        this.tutorial_title = tutorial_title;
    }

    public String getTutorial_video() {
        return this.tutorial_video;
    }

    public TutorialDTO tutorial_video(String tutorial_video) {
        this.setTutorial_video(tutorial_video);
        return this;
    }

    public void setTutorial_video(String tutorial_video) {
        this.tutorial_video = tutorial_video;
    }

    public LocalDate getTutorial_createdDate() {
        return this.tutorial_createdDate;
    }

    public TutorialDTO tutorial_createdDate(LocalDate tutorial_createdDate) {
        this.setTutorial_createdDate(tutorial_createdDate);
        return this;
    }

    public void setTutorial_createdDate(LocalDate tutorial_createdDate) {
        this.tutorial_createdDate = tutorial_createdDate;
    }

    public String getTutorial_isDisplay() {
        return this.tutorial_isDisplay;
    }

    public TutorialDTO tutorial_isDisplay(String tutorial_isDisplay) {
        this.setTutorial_isDisplay(tutorial_isDisplay);
        return this;
    }

    public void setTutorial_isDisplay(String tutorial_isDisplay) {
        this.tutorial_isDisplay = tutorial_isDisplay;
    }

    public String getTutorial_image() {
        return tutorial_image;
    }

    public void setTutorial_image(String tutorial_image) {
        this.tutorial_image = tutorial_image;
    }
}
