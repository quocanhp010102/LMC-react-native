package com.aladin.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A CourseStudent.
 */
@Entity
@Table(name = "course_student")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CourseStudent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(min = 1, max = 2000)
    @Column(name = "course_student_notification", length = 2000)
    private String courseStudent_notification;

    @Column(name = "percent")
    private Float course_percent;

    @ManyToOne
    @JsonIgnoreProperties(value = { "department","lessons","filesOfCourses","departments","courseStudents","student","students" ,"exams"}, allowSetters = true)
    private Course course;

    @ManyToOne
    @JsonIgnoreProperties(value = { "student", "courseStudents","examsHistories","classroomStudents","user" }, allowSetters = true)
    private Student student;

    public CourseStudent(Long id, String courseStudent_notification, Course course, Student student) {
        this.id = id;
        this.courseStudent_notification = courseStudent_notification;
        this.course = course;
        this.student = student;
    }

    public CourseStudent() {
    }

// jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CourseStudent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseStudent_notification() {
        return this.courseStudent_notification;
    }

    public CourseStudent courseStudent_notification(String courseStudent_notification) {
        this.setCourseStudent_notification(courseStudent_notification);
        return this;
    }

    public void setCourseStudent_notification(String courseStudent_notification) {
        this.courseStudent_notification = courseStudent_notification;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Float getCourse_percent() {
        return course_percent;
    }

    public void setCourse_percent(Float course_percent) {
        this.course_percent = course_percent;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseStudent)) {
            return false;
        }
        return id != null && id.equals(((CourseStudent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "CourseStudent{" +
            "id=" + id +
            ", courseStudent_notification='" + courseStudent_notification + '\'' +
            ", course_percent=" + course_percent +
//            ", course=" + course +
//            ", student=" + student +
            '}';
    }
}
