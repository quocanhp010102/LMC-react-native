package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cascade;

/**
 * A Answers.
 */
@Entity
@Table(name = "answers")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Answers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "answers_name")
    private String answersName;

    @Column(name = "answers_status")
    private String answersStatus;

    @Column(name = "answers_point")
    private String answersPoint;

    @ManyToOne
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    @JsonIgnoreProperties(value = { "answers", "exams" }, allowSetters = true)
    private Questions questions;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Answers id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnswersName() {
        return this.answersName;
    }

    public Answers answersName(String answersName) {
        this.setAnswersName(answersName);
        return this;
    }

    public void setAnswersName(String answersName) {
        this.answersName = answersName;
    }

    public String getAnswersStatus() {
        return this.answersStatus;
    }

    public Answers answersStatus(String answersStatus) {
        this.setAnswersStatus(answersStatus);
        return this;
    }

    public void setAnswersStatus(String answersStatus) {
        this.answersStatus = answersStatus;
    }

    public Questions getQuestions() {
        return this.questions;
    }

    public void setQuestions(Questions questions) {
        this.questions = questions;
    }

    public Answers questions(Questions questions) {
        this.setQuestions(questions);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Answers)) {
            return false;
        }
        return id != null && id.equals(((Answers) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore


    public String getAnswersPoint() {
        return answersPoint;
    }

    public void setAnswersPoint(String answersPoint) {
        this.answersPoint = answersPoint;
    }

    @Override
    public String toString() {
        return "Answers{" +
            "id=" + id +
            ", answersName='" + answersName + '\'' +
            ", answersStatus='" + answersStatus + '\'' +
            ", answersPoint='" + answersPoint + '\'' +
            '}';
    }
}
