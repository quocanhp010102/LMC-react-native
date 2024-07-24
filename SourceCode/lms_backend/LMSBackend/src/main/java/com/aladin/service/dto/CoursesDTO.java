package com.aladin.service.dto;
import com.aladin.domain.Course;
import com.aladin.handletime.CustomLocalDateTimeDeserializer;
import com.aladin.handletime.CustomLocalDateTimeSerializer;
import com.aladin.search.helper.Indices;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.io.Serializable;
import java.time.LocalDate;

@Document(indexName = Indices.COURSES_INDEX)
public class CoursesDTO implements Serializable{
    @Field(type = FieldType.Keyword)
    private Long id;
    private String courseName;

    @Field(type = FieldType.Date, name = "courseCreatedDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    private LocalDate courseCreatedDate;
    private String lectureName;

    private String courseImage;

    private String courseSemester;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }


    public LocalDate getCourseCreatedDate() {
        return courseCreatedDate;
    }

    public void setCourseCreatedDate(LocalDate courseCreatedDate) {
        this.courseCreatedDate = courseCreatedDate;
    }

    public String getLectureName() {
        return lectureName;
    }

    public void setLectureName(String lectureName) {
        this.lectureName = lectureName;
    }


    public CoursesDTO(Long id, String courseName, LocalDate courseCreatedDate) {
        this.id = id;
        this.courseName = courseName;
        this.courseCreatedDate = courseCreatedDate;
    }

    public CoursesDTO(Long id, String courseName, LocalDate courseCreatedDate, String lectureName) {
        this.id = id;
        this.courseName = courseName;
        this.courseCreatedDate = courseCreatedDate;
        this.lectureName = lectureName;
    }

    public CoursesDTO(Long id, String courseName, LocalDate courseCreatedDate, String lectureName, int courseTotalStudent, int courseTotalLesson) {
        this.id = id;
        this.courseName = courseName;
        this.courseCreatedDate = courseCreatedDate;
        this.lectureName = lectureName;
    }

    public CoursesDTO(Long id, String courseName, LocalDate courseCreatedDate, String lectureName, int courseTotalStudent, int courseTotalLesson, int courseTotalExams) {
        this.id = id;
        this.courseName = courseName;
        this.courseCreatedDate = courseCreatedDate;
        this.lectureName = lectureName;
    }

    public CoursesDTO() {
    }

    public CoursesDTO(Course course) {
        this.id=course.getId();
        this.courseCreatedDate=course.getCourseCreatedDate();
        this.courseName=course.getCourseName();
        this.courseImage=course.getCourseImage();
        this.courseSemester=course.getCourseSemester();
    }

}
