package com.aladin.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Questions.
 */
@Entity
@Table(name = "questions")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Questions implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "questions_name")
    private String questionsName;
    @Column(name = "questions_file")
    private String questionsFile;

    @Column(name="questions_point")
    private String questionsPoint;

    @OneToMany(mappedBy = "questions",fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "questions" }, allowSetters = true)
    private Set<Answers> answers = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "questions", "typeOfExams" }, allowSetters = true)
    private Exams exams;

    public Questions() {

    }

    // jhipster-needle-entity-add-field - JHipster will add fields here


    public String getQuestionsFile() {
        return questionsFile;
    }

    public void setQuestionsFile(String questionsFile) {
        this.questionsFile = questionsFile;
    }

    public Long getId() {
        return this.id;
    }

    public Questions id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionsName() {
        return this.questionsName;
    }

    public Questions questionsName(String questionsName) {
        this.setQuestionsName(questionsName);
        return this;
    }

    public void setQuestionsName(String questionsName) {
        this.questionsName = questionsName;
    }

    public Set<Answers> getAnswers() {
        return this.answers;
    }

    public void setAnswers(Set<Answers> answers) {
        if (this.answers != null) {
            this.answers.forEach(i -> i.setQuestions(null));
        }
        if (answers != null) {
            answers.forEach(i -> i.setQuestions(this));
        }
        this.answers = answers;
    }

    public Questions answers(Set<Answers> answers) {
        this.setAnswers(answers);
        return this;
    }

    public Questions addAnswers(Answers answers) {
        this.answers.add(answers);
        answers.setQuestions(this);
        return this;
    }

    public Questions removeAnswers(Answers answers) {
        this.answers.remove(answers);
        answers.setQuestions(null);
        return this;
    }

    public Exams getExams() {
        return this.exams;
    }

    public void setExams(Exams exams) {
        this.exams = exams;
    }

    public Questions exams(Exams exams) {
        this.setExams(exams);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Questions)) {
            return false;
        }
        return id != null && id.equals(((Questions) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore


    public String getQuestionsPoint() {
        return questionsPoint;
    }

    public void setQuestionsPoint(String questionsPoint) {
        this.questionsPoint = questionsPoint;
    }

    public Questions(Long id, String questionsName, String questionsPoint) {
        this.id = id;
        this.questionsName = questionsName;
        this.questionsPoint = questionsPoint;
    }
}
