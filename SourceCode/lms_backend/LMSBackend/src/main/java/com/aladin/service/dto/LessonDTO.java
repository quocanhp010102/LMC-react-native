package com.aladin.service.dto;

import com.aladin.domain.Course;
import com.aladin.domain.Lesson;
import com.aladin.search.helper.Indices;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;


@Document(indexName = Indices.LESSON_INDEX)
public class LessonDTO {
    @Id
    @Field(type = FieldType.Keyword)
    private Long id;

    @Field(type = FieldType.Text, name = "lesson_name")
    private String lesson_name;

    @Field(type = FieldType.Text, name = "lesson_notification")
    private String lesson_notification;

    @Field(type = FieldType.Text, name = "lesson_content")
    private String lesson_content;

    @Field(type = FieldType.Text, name = "lesson_file")
    private String lesson_file;

    @Field(type = FieldType.Date, name = "lesson_time_start")
    private Date lesson_timeStart;

    @Field(type = FieldType.Date, name = "lesson_time_start")
    private Date lesson_timeEnd;

    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLesson_name() {
        return lesson_name;
    }

    public void setLesson_name(String lesson_name) {
        this.lesson_name = lesson_name;
    }

    public String getLesson_notification() {
        return lesson_notification;
    }

    public void setLesson_notification(String lesson_notification) {
        this.lesson_notification = lesson_notification;
    }

    public String getLesson_content() {
        return lesson_content;
    }

    public void setLesson_content(String lesson_content) {
        this.lesson_content = lesson_content;
    }

    public String getLesson_file() {
        return lesson_file;
    }

    public void setLesson_file(String lesson_file) {
        this.lesson_file = lesson_file;
    }

    public Date getLesson_timeStart() {
        return lesson_timeStart;
    }

    public void setLesson_timeStart(Timestamp lesson_timeStart) {
        this.lesson_timeStart = lesson_timeStart;
    }

    public Date getLesson_timeEnd() {
        return lesson_timeEnd;
    }

    public void setLesson_timeEnd(Timestamp lesson_timeEnd) {
        this.lesson_timeEnd = lesson_timeEnd;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "Lesson{" +
            "id=" + id +
            ", lesson_name='" + lesson_name + '\'' +
            ", lesson_notification='" + lesson_notification + '\'' +
            ", lesson_content='" + lesson_content + '\'' +
            ", lesson_file='" + lesson_file + '\'' +
            ", lesson_timeStart=" + lesson_timeStart +
            ", lesson_timeEnd=" + lesson_timeEnd +
//            ", course=" + course +
            '}';
    }
}
