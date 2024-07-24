package com.aladin.service.dto;

import com.aladin.domain.Classroom;
import com.aladin.handletime.CustomLocalDateTimeDeserializer;
import com.aladin.handletime.CustomLocalDateTimeSerializer;
import com.aladin.search.helper.Indices;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * A Student.
 */
@Document(indexName = Indices.STUDENT_INDEX)
public class StudentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "student_code", length = 50, nullable = false, unique = true)
    private String student_code;

    @Column(name = "student_birthday", nullable = false)
    @Field(type = FieldType.Date, name = "student_birthday")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    @JsonDeserialize(using = CustomLocalDateTimeDeserializer.class)
    @JsonSerialize(using = CustomLocalDateTimeSerializer.class)
    private LocalDate student_birthday;

    private String student_email;

    private String student_fullname;

    private String student_gender;

    private String student_phone;

    private String student_avatar;

    private Classroom classroom;

    public StudentDTO(Long id, String student_code, LocalDate student_birthday, String student_email, String student_fullname, String student_gender, String student_phone, String student_avatar, Classroom classroom) {
        this.id = id;
        this.student_code = student_code;
        this.student_birthday = student_birthday;
        this.student_email = student_email;
        this.student_fullname = student_fullname;
        this.student_gender = student_gender;
        this.student_phone = student_phone;
        this.student_avatar = student_avatar;
        this.classroom = classroom;
    }

    public Long getId() {
        return this.id;
    }

    public StudentDTO id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getStudent_code() {
        return this.student_code;
    }

    public StudentDTO student_code(String student_code) {
        this.setStudent_code(student_code);
        return this;
    }


    public void setStudent_code(String student_code) {
        this.student_code = student_code;
    }

    public LocalDate getStudent_birthday() {
        return this.student_birthday;
    }

    public StudentDTO student_birthday(LocalDate student_birthday) {
        this.setStudent_birthday(student_birthday);
        return this;
    }

    public void setStudent_birthday(LocalDate student_birthday) {
        this.student_birthday = student_birthday;
    }

    public String getStudent_email() {
        return this.student_email;
    }

    public StudentDTO student_email(String student_email) {
        this.setStudent_email(student_email);
        return this;
    }

    public void setStudent_email(String student_email) {
        this.student_email = student_email;
    }

    public String getStudent_fullname() {
        return this.student_fullname;
    }

    public StudentDTO student_fullname(String student_fullname) {
        this.setStudent_fullname(student_fullname);
        return this;
    }

    public void setStudent_fullname(String student_fullname) {
        this.student_fullname = student_fullname;
    }

    public String getStudent_gender() {
        return this.student_gender;
    }

    public StudentDTO student_gender(String student_gender) {
        this.setStudent_gender(student_gender);
        return this;
    }

    public void setStudent_gender(String student_gender) {
        this.student_gender = student_gender;
    }

    public String getStudent_phone() {
        return this.student_phone;
    }

    public StudentDTO student_phone(String student_phone) {
        this.setStudent_phone(student_phone);
        return this;
    }

    public void setStudent_phone(String student_phone) {
        this.student_phone = student_phone;
    }

    public String getStudent_avatar() {
        return this.student_avatar;
    }

    public StudentDTO student_avatar(String student_avatar) {
        this.setStudent_avatar(student_avatar);
        return this;
    }

    public void setStudent_avatar(String student_avatar) {
        this.student_avatar = student_avatar;
    }

    public Classroom getClassroom() {
        return classroom;
    }

    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentDTO)) {
            return false;
        }
        return id != null && id.equals(((StudentDTO) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    public String getSearchField() {
        return "student_code,student_email,student_fullname";
    }

    public String getResponseField() {
        return "student_code,student_email,student_fullname,student_avatar,student_birthday";
    }

}
