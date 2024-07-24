package com.aladin.domain;

import java.io.File;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

import com.aladin.search.helper.Indices;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * A Lesson.
 */
@Entity
@Table(name = "lesson")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Lesson implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "lesson_name", nullable = false)
    private String lesson_name;

    @NotNull
    @Column(name = "lesson_notification",  nullable = false)
    private String lesson_notification;


    @Column(name = "lesson_content",  nullable = true)
    private String lesson_content;


    @Column(name = "lesson_timeStart")
    private Timestamp lesson_timeStart;

    @Column(name = "lesson_timeEnd")
    private Timestamp lesson_timeEnd;

    @Column(name = "lesson_file",  nullable = true)
    private String lesson_file;

//    @Size(min = 1, max = 5)
//    @Column(name = "lesson_status",length =5,  nullable = true)
//    private String lesson_status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "department", "lessons","filesOfCourses","courseStudents","classroomStudents", "exams", "histories"  }, allowSetters = true)
    private Course course;

    @OneToMany(mappedBy = "lesson", fetch = FetchType.EAGER)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lesson","course"}, allowSetters = true)
    private Set<FilesOfLesson> filesOfLessons = new HashSet<>();

    @OneToMany(mappedBy = "lesson")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course", "user", "lesson" }, allowSetters = true)
    private Set<History> histories = new HashSet<>();

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

    public Timestamp getLesson_timeStart() {
        return lesson_timeStart;
    }

    public void setLesson_timeStart(Timestamp lesson_timeStart) {
        this.lesson_timeStart = lesson_timeStart;
    }

    public Timestamp getLesson_timeEnd() {
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




    public String getLesson_file() {
        return lesson_file;
    }

    public void setLesson_file(String lesson_file) {
        this.lesson_file = lesson_file;
    }

    public Set<FilesOfLesson> getFilesOfLessons() {
        return this.filesOfLessons;
    }

    public void setFilesOfLessons(Set<FilesOfLesson> filesOfLessons) {
        if (this.filesOfLessons != null) {
            this.filesOfLessons.forEach(i -> i.setLesson(null));
        }
        if (filesOfLessons != null) {
            filesOfLessons.forEach(i -> i.setLesson(this));
        }
        this.filesOfLessons = filesOfLessons;
    }

    public Lesson filesOfLessons(Set<FilesOfLesson> filesOfLessons) {
        this.setFilesOfLessons(filesOfLessons);
        return this;
    }

    public Lesson addFilesOfCourse(FilesOfLesson filesOfLesson) {
        this.filesOfLessons.add(filesOfLesson);
        filesOfLesson.setLesson(this);
        return this;
    }

    public Lesson removeFilesOfLesson(FilesOfLesson filesOfLesson) {
        this.filesOfLessons.remove(filesOfLesson);
        filesOfLesson.setLesson(null);
        return this;
    }

    public Set<History> getHistories() {
        return histories;
    }

    public void setHistories(Set<History> histories) {
        this.histories = histories;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lesson)) {
            return false;
        }
        return id != null && id.equals(((Lesson) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
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
            ", lesson_timeStart=" + lesson_timeStart +
            ", lesson_timeEnd=" + lesson_timeEnd +
//            ", course=" + course +
            '}';
    }
}
