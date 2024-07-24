package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A Exams.
 */
@Entity
@Table(name = "exams")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Exams implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "exam_name")
    private String examName;

    @Column(name = "exam_total_student")
    private String examTotalStudent;

    @Column(name = "exam_total_student_submitted")
    private String examTotalStudentSubmitted;

    @Column(name = "exam_percentage_submitted")
    private String examPercentageSubmitted;

    @Column(name = "exam_close_time")
    private Date examCloseTime;

    @Column(name = "exam_limited_working_time")
    private String examLimittedWorkingTime;

    @Column(name = "exam_open_time")
    private Date examOpenTime;

    @Column(name = "exam_status")
    private String examStatus;

    @OneToMany(mappedBy = "exams")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "note", "exams" }, allowSetters = true)
    private Set<NoteContent> noteContents = new HashSet<>();



    @OneToMany(mappedBy = "exams")
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//    @JsonIgnoreProperties(value = { "answers", "exams" }, allowSetters = true)
    private Set<Questions> questions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "exams" }, allowSetters = true)
    private TypeOfExams typeOfExams;

    @ManyToOne
    @JsonIgnoreProperties(value = { "course","exams","courses" }, allowSetters = true)
    private Course course;

//    @OneToMany(mappedBy = "exams",fetch = FetchType.EAGER)
////    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//    @JsonIgnoreProperties(value = { "exams" }, allowSetters = true)
//    private Set<ExamsHistory> answers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Exams id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExamName() {
        return this.examName;
    }

    public Exams examName(String examName) {
        this.setExamName(examName);
        return this;
    }

    public String getExamTotalStudent() {
        return examTotalStudent;
    }

    public void setExamTotalStudent(String examTotalStudent) {
        this.examTotalStudent = examTotalStudent;
    }

    public String getExamTotalStudentSubmitted() {
        return examTotalStudentSubmitted;
    }

    public void setExamTotalStudentSubmitted(String examTotalStudentSubmitted) {
        this.examTotalStudentSubmitted = examTotalStudentSubmitted;
    }

    public String getExamPercentageSubmitted() {
        return examPercentageSubmitted;
    }

    public void setExamPercentageSubmitted(String examPercentageSubmitted) {
        this.examPercentageSubmitted = examPercentageSubmitted;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public Date getExamCloseTime() {
        return examCloseTime;
    }

    public void setExamCloseTime(Date examCloseTime) {
        this.examCloseTime = examCloseTime;
    }

    public String getExamLimittedWorkingTime() {
        return examLimittedWorkingTime;
    }

    public void setExamLimittedWorkingTime(String examLimittedWorkingTime) {
        this.examLimittedWorkingTime = examLimittedWorkingTime;
    }

    public Date getExamOpenTime() {
        return examOpenTime;
    }

    public void setExamOpenTime(Date examOpenTime) {
        this.examOpenTime = examOpenTime;
    }

    public Set<Questions> getQuestions() {
        return this.questions;
    }

    public void setQuestions(Set<Questions> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setExams(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setExams(this));
        }
        this.questions = questions;
    }

    public Exams questions(Set<Questions> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Exams addQuestions(Questions questions) {
        this.questions.add(questions);
        questions.setExams(this);
        return this;
    }

    public Exams removeQuestions(Questions questions) {
        this.questions.remove(questions);
        questions.setExams(null);
        return this;
    }

    public TypeOfExams getTypeOfExams() {
        return this.typeOfExams;
    }

    public void setTypeOfExams(TypeOfExams typeOfExams) {
        this.typeOfExams = typeOfExams;
    }

    public Exams typeOfExams(TypeOfExams typeOfExams) {
        this.setTypeOfExams(typeOfExams);
        return this;
    }

    public String getExamStatus() {
        return examStatus;
    }

    public void setExamStatus(String examStatus) {
        this.examStatus = examStatus;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Exams)) {
            return false;
        }
        return id != null && id.equals(((Exams) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

//    @Override
//    public String toString() {
//        return "Exams{" +
//            "id=" + id +
//            ", examName='" + examName + '\'' +
//            ", examTotalStudent='" + examTotalStudent + '\'' +
//            ", examTotalStudentSubmitted='" + examTotalStudentSubmitted + '\'' +
//            ", examPercentageSubmitted='" + examPercentageSubmitted + '\'' +
//            ", examCloseTime=" + examCloseTime +
//            ", examLimittedWorkingTime='" + examLimittedWorkingTime + '\'' +
//            ", examOpenTime=" + examOpenTime +
//            '}';
//    }
//


    @Override
    public String toString() {
        return "Exams{" +
            "id=" + id +
            ", examName='" + examName + '\'' +
            ", examTotalStudent='" + examTotalStudent + '\'' +
            ", examTotalStudentSubmitted='" + examTotalStudentSubmitted + '\'' +
            ", examPercentageSubmitted='" + examPercentageSubmitted + '\'' +
            ", examCloseTime=" + examCloseTime +
            ", examLimittedWorkingTime='" + examLimittedWorkingTime + '\'' +
            ", examOpenTime=" + examOpenTime +
            ", examStatus=" + examStatus +
            '}';
    }
}
