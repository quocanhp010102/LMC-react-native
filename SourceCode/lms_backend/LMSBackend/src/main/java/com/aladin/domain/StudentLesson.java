package com.aladin.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A StudentLesson.
 */
@Entity
@Table(name = "student_lesson")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StudentLesson implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 5)
    @Column(name = "is_done", length = 5, nullable = false)
    private String isDone;

    @Column(name = "percent")
    private Float percent;

    @ManyToOne
    @JsonIgnoreProperties(value = {"studentLessons", "course","filesOfCourses", "courseStudents", "examsHistories"}, allowSetters = true)
    private Lesson lesson;

    @ManyToOne
    @JsonIgnoreProperties(value = { "courseStudents", "lecturer", "course","studentLessons","examsHistories"}, allowSetters = true)
    private Student student;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentLesson id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIsDone() {
        return this.isDone;
    }

    public StudentLesson isDone(String isDone) {
        this.setIsDone(isDone);
        return this;
    }

    public void setIsDone(String isDone) {
        this.isDone = isDone;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Float getPercent() {
        return percent;
    }

    public void setPercent(Float percent) {
        this.percent = percent;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentLesson)) {
            return false;
        }
        return id != null && id.equals(((StudentLesson) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentLesson{" +
            "id=" + getId() +
            "}";
    }
}
