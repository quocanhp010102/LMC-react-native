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
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Lecturer.
 */
@Document(indexName = Indices.LECTURE_INDEX)
public class LecturerDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Field(type = FieldType.Keyword)
    private Long id;

//    @NotNull
//    @Size(min = 1, max = 50)
//    @Column(name = "lecturer_code", length = 50, nullable = false, unique = true)
//    @Field(type = FieldType.Text, name = "lecturer_code")
//    private String lecturer_code;

    @Field(type = FieldType.Date, name = "lecturer_birthday")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    private LocalDate lecturer_birthday;

    @Field(type = FieldType.Text, name = "lecturer_email")
    private String lecturer_email;

    @Field(type = FieldType.Text, name = "lecturer_fullname")
    private String lecturer_fullname;

    @Field(type = FieldType.Text, name = "lecturer_gender")
    private String lecturer_gender;

    @Field(type = FieldType.Text, name = "lecturer_phone")
    private String lecturer_phone;

    @Field(type = FieldType.Text, name = "lecturer_avatar")
    private String lecturer_avatar;


    public Long getId() {
        return this.id;
    }

    public LecturerDTO id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getLecturer_birthday() {
        return this.lecturer_birthday;
    }

    public LecturerDTO lecturer_birthday(LocalDate lecturer_birthday) {
        this.setLecturer_birthday(lecturer_birthday);
        return this;
    }

    public void setLecturer_birthday(LocalDate lecturer_birthday) {
        this.lecturer_birthday = lecturer_birthday;
    }

    public String getLecturer_email() {
        return this.lecturer_email;
    }

    public LecturerDTO lecturer_email(String lecturer_email) {
        this.setLecturer_email(lecturer_email);
        return this;
    }

    public void setLecturer_email(String lecturer_email) {
        this.lecturer_email = lecturer_email;
    }

    public String getLecturer_fullname() {
        return this.lecturer_fullname;
    }

    public LecturerDTO lecturer_fullname(String lecturer_fullname) {
        this.setLecturer_fullname(lecturer_fullname);
        return this;
    }

    public void setLecturer_fullname(String lecturer_fullname) {
        this.lecturer_fullname = lecturer_fullname;
    }

    public String getLecturer_gender() {
        return this.lecturer_gender;
    }

    public LecturerDTO lecturer_gender(String lecturer_gender) {
        this.setLecturer_gender(lecturer_gender);
        return this;
    }

    public void setLecturer_gender(String lecturer_gender) {
        this.lecturer_gender = lecturer_gender;
    }

    public String getLecturer_phone() {
        return this.lecturer_phone;
    }

    public LecturerDTO lecturer_phone(String lecturer_phone) {
        this.setLecturer_phone(lecturer_phone);
        return this;
    }

    public void setLecturer_phone(String lecturer_phone) {
        this.lecturer_phone = lecturer_phone;
    }

    public String getLecturer_avatar() {
        return this.lecturer_avatar;
    }

    public LecturerDTO lecturer_avatar(String lecturer_avatar) {
        this.setLecturer_avatar(lecturer_avatar);
        return this;
    }

    public void setLecturer_avatar(String lecturer_avatar) {
        this.lecturer_avatar = lecturer_avatar;
    }

}
