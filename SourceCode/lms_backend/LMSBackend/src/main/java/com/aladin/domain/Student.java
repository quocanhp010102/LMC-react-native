package com.aladin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

import com.aladin.handletime.CustomLocalDateTimeDeserializer;
import com.aladin.handletime.CustomLocalDateTimeSerializer;
import com.aladin.search.helper.Indices;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "student_code", length = 50, nullable = false, unique = true)
    private String student_code;

//    @NotNull
    @Column(name = "student_birthday", nullable = true)
    private LocalDate student_birthday;

    @Size(min = 1, max = 50)
    @Column(name = "student_email", length = 50, unique = true)
    private String student_email;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "student_fullname", length = 50, nullable = false)
    private String student_fullname;

//    @NotNull
    @Size(min = 1, max = 6)
    @Column(name = "student_gender", length = 6, nullable = true)
    private String student_gender;

    @Size(min = 1, max = 50)
    @Column(name = "student_phone", length = 50)
    private String student_phone;

    @Size(min = 1, max = 500)
    @Column(name = "student_avatar", length = 500)
    private String student_avatar;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @JoinTable(
        name = "student_lecturer",
        joinColumns = {@JoinColumn(name = "student_id", referencedColumnName = "id")},
        inverseJoinColumns = {@JoinColumn(name = "lecturer_id", referencedColumnName = "id")}
    )
    private Set<Lecturer> lecturers = new HashSet<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.EAGER)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = {"course","student","courseStudents","examsHistories"}, allowSetters = true)
    private Set<CourseStudent> courseStudents = new HashSet<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.EAGER)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = {"student","exams", }, allowSetters = true)
    private Set<ExamsHistory> examsHistories = new HashSet<>();

    @OneToMany(mappedBy = "student")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = {"department", "user", "classroomStudents", "classroomStudent", "student"}, allowSetters = true)
    private Set<ClassroomStudent> classroomStudents = new HashSet<>();


    // jhipster-needle-entity-add-field - JHipster will add fields here


    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Lecturer> getLecturers() {
        return lecturers;
    }

    public void setLecturers(Set<Lecturer> lecturers) {
        this.lecturers = lecturers;
    }

    public String getStudent_code() {
        return this.student_code;
    }

    public Student student_code(String student_code) {
        this.setStudent_code(student_code);
        return this;
    }

    public Set<ExamsHistory> getExamsHistories() {
        return examsHistories;
    }

    public void setExamsHistories(Set<ExamsHistory> examsHistories) {
        this.examsHistories = examsHistories;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStudent_code(String student_code) {
        this.student_code = student_code;
    }

    public LocalDate getStudent_birthday() {
        return this.student_birthday;
    }

    public Student student_birthday(LocalDate student_birthday) {
        this.setStudent_birthday(student_birthday);
        return this;
    }

    public void setStudent_birthday(LocalDate student_birthday) {
        this.student_birthday = student_birthday;
    }

    public String getStudent_email() {
        return this.student_email;
    }

    public Student student_email(String student_email) {
        this.setStudent_email(student_email);
        return this;
    }

    public void setStudent_email(String student_email) {
        this.student_email = student_email;
    }

    public String getStudent_fullname() {
        return this.student_fullname;
    }

    public Student student_fullname(String student_fullname) {
        this.setStudent_fullname(student_fullname);
        return this;
    }

    public void setStudent_fullname(String student_fullname) {
        this.student_fullname = student_fullname;
    }

    public String getStudent_gender() {
        return this.student_gender;
    }

    public Student student_gender(String student_gender) {
        this.setStudent_gender(student_gender);
        return this;
    }

    public void setStudent_gender(String student_gender) {
        this.student_gender = student_gender;
    }

    public String getStudent_phone() {
        return this.student_phone;
    }

    public Student student_phone(String student_phone) {
        this.setStudent_phone(student_phone);
        return this;
    }

    public void setStudent_phone(String student_phone) {
        this.student_phone = student_phone;
    }

    public String getStudent_avatar() {
        return this.student_avatar;
    }

    public Student student_avatar(String student_avatar) {
        this.setStudent_avatar(student_avatar);
        return this;
    }

    public void setStudent_avatar(String student_avatar) {
        this.student_avatar = student_avatar;
    }

    public Set<CourseStudent> getCourseStudents() {
        return this.courseStudents;
    }

    public void setCourseStudents(Set<CourseStudent> courseStudents) {
        if (this.courseStudents != null) {
            this.courseStudents.forEach(i -> i.setStudent(null));
        }
        if (courseStudents != null) {
            courseStudents.forEach(i -> i.setStudent(this));
        }
        this.courseStudents = courseStudents;
    }

    public Student courseStudent(Set<CourseStudent> courseStudents) {
        this.setCourseStudents(courseStudents);
        return this;
    }

    public Student addCourseStudent(CourseStudent courseStudent) {
        this.courseStudents.add(courseStudent);
        courseStudent.setStudent(this);
        return this;
    }

    public Student removeCourseStudent(CourseStudent courseStudent) {
        this.courseStudents.remove(courseStudent);
        courseStudent.setStudent(null);
        return this;
    }

    //
    public Set<ClassroomStudent> getClassroomStudents() {
        return this.classroomStudents;
    }

    public void setClassroomStudents(Set<ClassroomStudent> classroomStudents) {
        if (this.classroomStudents != null) {
            this.classroomStudents.forEach(i -> i.setStudent(null));
        }
        if (classroomStudents != null) {
            classroomStudents.forEach(i -> i.setStudent(this));
        }
        this.classroomStudents = classroomStudents;
    }

    public Student classroomStudent(Set<ClassroomStudent> classroomStudents) {
        this.setClassroomStudents(classroomStudents);
        return this;
    }

    public Student addClassroomStudents(ClassroomStudent classroomStudent) {
        this.classroomStudents.add(classroomStudent);
        classroomStudent.setStudent(this);
        return this;
    }

    public Student removeClassroomStudent(ClassroomStudent classroomStudent) {
        this.classroomStudents.remove(classroomStudent);
        classroomStudent.setStudent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return id != null && id.equals(((Student) o).id);
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

    @Override
    public String toString() {
        return "Student{" +
            "id=" + id +
            ", student_code='" + student_code + '\'' +
            ", student_birthday=" + student_birthday +
            ", student_email='" + student_email + '\'' +
            ", student_fullname='" + student_fullname + '\'' +
            ", student_gender='" + student_gender + '\'' +
            ", student_phone='" + student_phone + '\'' +
            ", student_avatar='" + student_avatar + '\'' +
            ", user=" + user +
//            ", lecturers=" + lecturers +
            ", courseStudents=" + courseStudents +
            ", examsHistories=" + examsHistories +
            '}';
    }
}
