package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * A ActivityHistory.
 */
@Entity
@Table(name = "activity_history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ActivityHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "activity_history_name", nullable = false)
    private String activityHistoryName;

    @NotNull
    @Column(name = "activity_history_time", nullable = false)
    private String activityHistoryTime;

    @ManyToOne
    @JsonIgnoreProperties(value = { "notes, activityHistories" }, allowSetters = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lstExams", "activityHistories" }, allowSetters = true)
    private Course course;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lstExams", "activityHistories" }, allowSetters = true)
    private Lesson lesson;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActivityHistory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityHistoryName() {
        return this.activityHistoryName;
    }

    public ActivityHistory activityHistoryName(String activityHistoryName) {
        this.setActivityHistoryName(activityHistoryName);
        return this;
    }

    public void setActivityHistoryName(String activityHistoryName) {
        this.activityHistoryName = activityHistoryName;
    }

    public String getActivityHistoryTime() {
        return this.activityHistoryTime;
    }

    public ActivityHistory activityHistoryTime(String activityHistoryTime) {
        this.setActivityHistoryTime(activityHistoryTime);
        return this;
    }

    public void setActivityHistoryTime(String activityHistoryTime) {
        this.activityHistoryTime = activityHistoryTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActivityHistory)) {
            return false;
        }
        return id != null && id.equals(((ActivityHistory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActivityHistory{" +
            "id=" + getId() +
            ", activityHistoryName='" + getActivityHistoryName() + "'" +
            ", activityHistoryTime='" + getActivityHistoryTime() + "'" +
            "}";
    }
}
