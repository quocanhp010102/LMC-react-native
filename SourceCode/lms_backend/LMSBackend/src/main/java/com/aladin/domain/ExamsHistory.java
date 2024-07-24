package com.aladin.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A ExamsHistory.
 */
@Entity
@Table(name = "exams_history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExamsHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "exams_history_teacher_comment")
    private String examsHistoryTeacherComment;

    @Column(name = "exams_history_answer")
    private String examsHistoryAnswer;

    @Column(name = "exams_history_point")
    private String examsHistoryPoint;

    @Column(name = "exams_history_submission_time")
    private Date examsHistorySubmissionTime;

    @Column(name = "exams_history_status")
    private String examsHistoryStatus;

    @Column(name = "exams_history_file_answer")
    private String examsHistoryFileAnswer;

    @ManyToOne
//    @JsonIgnoreProperties(value = { "answers", "exams" }, allowSetters = true)
    private Exams exams;

    @ManyToOne
    @JsonIgnoreProperties(value = { "examsHistories"}, allowSetters = true)
    private Student student;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExamsHistory id(Long id) {
        this.setId(id);
        return this;
    }

    public Exams getExams() {
        return exams;
    }

    public void setExams(Exams exams) {
        this.exams = exams;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExamsHistoryTeacherComment() {
        return this.examsHistoryTeacherComment;
    }

    public ExamsHistory examsHistoryTeacherComment(String examsHistoryTeacherComment) {
        this.setExamsHistoryTeacherComment(examsHistoryTeacherComment);
        return this;
    }

    public void setExamsHistoryTeacherComment(String examsHistoryTeacherComment) {
        this.examsHistoryTeacherComment = examsHistoryTeacherComment;
    }

    public String getExamsHistoryAnswer() {
        return this.examsHistoryAnswer;
    }

    public ExamsHistory examsHistoryAnswer(String examsHistoryAnswer) {
        this.setExamsHistoryAnswer(examsHistoryAnswer);
        return this;
    }

    public void setExamsHistoryAnswer(String examsHistoryAnswer) {
        this.examsHistoryAnswer = examsHistoryAnswer;
    }

    public String getExamsHistoryPoint() {
        return this.examsHistoryPoint;
    }

    public ExamsHistory examsHistoryPoint(String examsHistoryPoint) {
        this.setExamsHistoryPoint(examsHistoryPoint);
        return this;
    }

    public void setExamsHistoryPoint(String examsHistoryPoint) {
        this.examsHistoryPoint = examsHistoryPoint;
    }

    public Date getExamsHistorySubmissionTime() {
        return this.examsHistorySubmissionTime;
    }

    public ExamsHistory examsHistorySubmissionTime(Date examsHistorySubmissionTime) {
        this.setExamsHistorySubmissionTime(examsHistorySubmissionTime);
        return this;
    }

    public void setExamsHistorySubmissionTime(Date examsHistorySubmissionTime) {
        this.examsHistorySubmissionTime = examsHistorySubmissionTime;
    }

    public String getExamsHistoryStatus() {
        return examsHistoryStatus;
    }

    public String getExamsHistoryFileAnswer() {
        return examsHistoryFileAnswer;
    }

    public void setExamsHistoryFileAnswer(String examsHistoryFileAnswer) {
        this.examsHistoryFileAnswer = examsHistoryFileAnswer;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setExamsHistoryStatus(String examsHistoryStatus) {
        this.examsHistoryStatus = examsHistoryStatus;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExamsHistory)) {
            return false;
        }
        return id != null && id.equals(((ExamsHistory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExamsHistory{" +
            "id=" + getId() +
            ", examsHistoryTeacherComment='" + getExamsHistoryTeacherComment() + "'" +
            ", examsHistoryAnswer='" + getExamsHistoryAnswer() + "'" +
            ", examsHistoryPoint='" + getExamsHistoryPoint() + "'" +
            ", examsHistorySubmissionTime='" + getExamsHistorySubmissionTime() + "'" +
            "}";
    }
}
