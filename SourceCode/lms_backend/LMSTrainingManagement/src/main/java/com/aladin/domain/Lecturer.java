package com.aladin.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A Lecturer.
 */
@Entity
@Table(name = "lecturer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Lecturer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "lecturer_code", length = 50, nullable = false, unique = true)
    private String lecturer_code;

    //    @NotNull
    @Column(name = "lecturer_birthday", nullable = true)
    private LocalDate lecturer_birthday;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "lecturer_email", length = 50, nullable = false, unique = true)
    private String lecturer_email;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "lecturer_fullname", length = 50, nullable = false)
    private String lecturer_fullname;

    //    @NotNull
    @Size(min = 1, max = 6)
    @Column(name = "lecturer_gender", length = 6, nullable = true)
    private String lecturer_gender;

    @Size(min = 1, max = 50)
    @Column(name = "lecturer_phone", length = 50)
    private String lecturer_phone;

    @Size(min = 1, max = 500)
    @Column(name = "lecturer_avatar", length = 500,nullable = true)
    private String lecturer_avatar;

    @OneToOne(optional = false, fetch = FetchType.EAGER)
    @NotNull
    @JoinColumn(name = "user_id", unique = true)
    private User user;


    @OneToMany(mappedBy = "lecturer",fetch = FetchType.LAZY)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Course> courses = new HashSet<>();

    public Long getId() {
        return this.id;
    }

    public Lecturer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLecturer_code() {
        return this.lecturer_code;
    }

    public Lecturer lecturer_code(String lecturer_code) {
        this.setLecturer_code(lecturer_code);
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setLecturer_code(String lecturer_code) {
        this.lecturer_code = lecturer_code;
    }

    public LocalDate getLecturer_birthday() {
        return this.lecturer_birthday;
    }

    public Lecturer lecturer_birthday(LocalDate lecturer_birthday) {
        this.setLecturer_birthday(lecturer_birthday);
        return this;
    }

    public void setLecturer_birthday(LocalDate lecturer_birthday) {
        this.lecturer_birthday = lecturer_birthday;
    }

    public String getLecturer_email() {
        return this.lecturer_email;
    }

    public Lecturer lecturer_email(String lecturer_email) {
        this.setLecturer_email(lecturer_email);
        return this;
    }

    public void setLecturer_email(String lecturer_email) {
        this.lecturer_email = lecturer_email;
    }

    public String getLecturer_fullname() {
        return this.lecturer_fullname;
    }

    public Lecturer lecturer_fullname(String lecturer_fullname) {
        this.setLecturer_fullname(lecturer_fullname);
        return this;
    }

    public void setLecturer_fullname(String lecturer_fullname) {
        this.lecturer_fullname = lecturer_fullname;
    }

    public String getLecturer_gender() {
        return this.lecturer_gender;
    }

    public Lecturer lecturer_gender(String lecturer_gender) {
        this.setLecturer_gender(lecturer_gender);
        return this;
    }

    public void setLecturer_gender(String lecturer_gender) {
        this.lecturer_gender = lecturer_gender;
    }

    public String getLecturer_phone() {
        return this.lecturer_phone;
    }

    public Lecturer lecturer_phone(String lecturer_phone) {
        this.setLecturer_phone(lecturer_phone);
        return this;
    }

    public void setLecturer_phone(String lecturer_phone) {
        this.lecturer_phone = lecturer_phone;
    }

    public String getLecturer_avatar() {
        return this.lecturer_avatar;
    }

    public Lecturer lecturer_avatar(String lecturer_avatar) {
        this.setLecturer_avatar(lecturer_avatar);
        return this;
    }

    public void setLecturer_avatar(String lecturer_avatar) {
        this.lecturer_avatar = lecturer_avatar;
    }

    public Set<Course> getCourses() {
        return this.courses;
    }

    public void setCourses(Set<Course> courses) {
        if (this.courses != null) {
            this.courses.forEach(i -> i.setLecturer(null));
        }
        if (courses != null) {
            courses.forEach(i -> i.setLecturer(this));
        }
        this.courses = courses;
    }

    public Lecturer addCourse(Course course) {
        this.courses.add(course);
        course.setLecturer(this);
        return this;
    }

    public Lecturer removeCourse(Course course) {
        this.courses.remove(course);
//        course.setDepartment(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lecturer)) {
            return false;
        }
        return id != null && id.equals(((Lecturer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "Lecturer{" +
            "id=" + id +
            ", lecturer_birthday=" + lecturer_birthday +
            ", lecturer_email='" + lecturer_email + '\'' +
            ", lecturer_fullname='" + lecturer_fullname + '\'' +
            ", lecturer_gender='" + lecturer_gender + '\'' +
            ", lecturer_phone='" + lecturer_phone + '\'' +
            ", lecturer_avatar='" + lecturer_avatar + '\'' +
//            ", user=" + user +
//            ", courses=" + courses +
            '}';
    }

}
