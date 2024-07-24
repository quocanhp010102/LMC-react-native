package com.aladin.domain;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

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
    private Timestamp examsHistorySubmissionTime;

    @Column(name = "exams_history_status")
    private String examsHistoryStatus;

    @Column(name = "exams_history_file_answer")
    private String examsHistoryFileAnswer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "answers","noteContents","course","typeOfExams"}, allowSetters = true)
    private Exams exams;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "examsHistories","lecturers","courseStudents"}, allowSetters = true)
    private Student student;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExamsHistoryTeacherComment() {
        return examsHistoryTeacherComment;
    }

    public void setExamsHistoryTeacherComment(String examsHistoryTeacherComment) {
        this.examsHistoryTeacherComment = examsHistoryTeacherComment;
    }

    public String getExamsHistoryAnswer() {
        return examsHistoryAnswer;
    }

    public void setExamsHistoryAnswer(String examsHistoryAnswer) {
        this.examsHistoryAnswer = examsHistoryAnswer;
    }

    public String getExamsHistoryPoint() {
        return examsHistoryPoint;
    }

    public void setExamsHistoryPoint(String examsHistoryPoint) {
        this.examsHistoryPoint = examsHistoryPoint;
    }



    public String getExamsHistoryStatus() {
        return examsHistoryStatus;
    }

    public void setExamsHistoryStatus(String examsHistoryStatus) {
        this.examsHistoryStatus = examsHistoryStatus;
    }

    public String getExamsHistoryFileAnswer() {
        return examsHistoryFileAnswer;
    }

    public void setExamsHistoryFileAnswer(String examsHistoryFileAnswer) {
        this.examsHistoryFileAnswer = examsHistoryFileAnswer;
    }

    public Exams getExams() {
        return exams;
    }

    public void setExams(Exams exams) {
        this.exams = exams;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public ExamsHistory(Long id) {
        this.id = id;
    }

    public ExamsHistory(String examsHistoryTeacherComment) {
        this.examsHistoryTeacherComment = examsHistoryTeacherComment;
    }

    public Timestamp getExamsHistorySubmissionTime() {
        return examsHistorySubmissionTime;
    }

    public void setExamsHistorySubmissionTime(Timestamp examsHistorySubmissionTime) {
        this.examsHistorySubmissionTime = examsHistorySubmissionTime;
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
            "id=" + id +
            ", examsHistoryTeacherComment='" + examsHistoryTeacherComment + '\'' +
            ", examsHistoryAnswer='" + examsHistoryAnswer + '\'' +
            ", examsHistoryPoint='" + examsHistoryPoint + '\'' +
            ", examsHistorySubmissionTime=" + examsHistorySubmissionTime +
            ", examsHistoryStatus='" + examsHistoryStatus + '\'' +
            ", examsHistoryFileAnswer='" + examsHistoryFileAnswer + '\'' +
            '}';
    }

    public ExamsHistory() {
    }

    public ExamsHistory(Long id, String examsHistoryTeacherComment, String examsHistoryAnswer, String examsHistoryPoint, Timestamp examsHistorySubmissionTime, String examsHistoryStatus, String examsHistoryFileAnswer) {
        this.id = id;
        this.examsHistoryTeacherComment = examsHistoryTeacherComment;
        this.examsHistoryAnswer = examsHistoryAnswer;
        this.examsHistoryPoint = examsHistoryPoint;
        this.examsHistorySubmissionTime = examsHistorySubmissionTime;
        this.examsHistoryStatus = examsHistoryStatus;
        this.examsHistoryFileAnswer = examsHistoryFileAnswer;

    }
}
