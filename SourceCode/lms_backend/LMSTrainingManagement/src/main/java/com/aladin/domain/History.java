package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A History.
 */
@Entity
@Table(name = "history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class History implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "history_name", nullable = false)
    private String historyName;

    @Column(name = "history_time", nullable = false)
    private String historyTime;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lessons", "filesOfCourses","filesOfCourses", "lstExams","lecturer" }, allowSetters = true)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "course"}, allowSetters = true)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "notes" }, allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public History id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHistoryName() {
        return this.historyName;
    }

    public History historyName(String historyName) {
        this.setHistoryName(historyName);
        return this;
    }

    public void setHistoryName(String historyName) {
        this.historyName = historyName;
    }

    public String getHistoryTime() {
        return this.historyTime;
    }

    public History historyTime(String historyTime) {
        this.setHistoryTime(historyTime);
        return this;
    }

    public void setHistoryTime(String historyTime) {
        this.historyTime = historyTime;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public History course(Course course) {
        this.setCourse(course);
        return this;
    }

    public Lesson getLesson() {
        return this.lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public History lesson(Lesson lesson) {
        this.setLesson(lesson);
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public History() {
    }

    public History(Long id, String historyName, String historyTime, User user) {
        this.id = id;
        this.historyName = historyName;
        this.historyTime = historyTime;
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof History)) {
            return false;
        }
        return id != null && id.equals(((History) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    public History(Long id, String historyName, String historyTime, Course course, Lesson lesson, User user) {
        this.id = id;
        this.historyName = historyName;
        this.historyTime = historyTime;
        if(course != null){
            this.course = course;
        }
       if(lesson != null){
           this.lesson = lesson;
       }
        this.user = user;
    }

    public History(Long id, String historyName, String historyTime, Course course, User user) {
        this.id = id;
        this.historyName = historyName;
        this.historyTime = historyTime;
        this.course = course;
        this.user = user;
    }

    public History(Long id, String historyName, String historyTime, Lesson lesson, User user) {
        this.id = id;
        this.historyName = historyName;
        this.historyTime = historyTime;
        this.lesson = lesson;
        this.user = user;
    }

    public History(Long id, String historyName, String historyTime) {
        this.id = id;
        this.historyName = historyName;
        this.historyTime = historyTime;
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "History{" +
            "id=" + id +
            ", historyName='" + historyName + '\'' +
            ", historyTime='" + historyTime + '\'' +
            '}';
    }
}
