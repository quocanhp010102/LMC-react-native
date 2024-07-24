package com.aladin.service.dto;

import com.aladin.domain.Questions;
import com.aladin.domain.TypeOfExams;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ExamsHistoryDto {
    private Long id;

    private Set<Questions> questions = new HashSet<>();

    private String examsHistoryAnswer;

    private String examsHistoryFileAnswer;

    private TypeOfExams typeOfExams;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Questions> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<Questions> questions) {
        this.questions = questions;
    }

    public String getExamsHistoryAnswer() {
        return examsHistoryAnswer;
    }

    public void setExamsHistoryAnswer(String examsHistoryAnswer) {
        this.examsHistoryAnswer = examsHistoryAnswer;
    }

    public String getExamsHistoryFileAnswer() {
        return examsHistoryFileAnswer;
    }

    public void setExamsHistoryFileAnswer(String examsHistoryFileAnswer) {
        this.examsHistoryFileAnswer = examsHistoryFileAnswer;
    }

    public TypeOfExams getTypeOfExams() {
        return typeOfExams;
    }

    public void setTypeOfExams(TypeOfExams typeOfExams) {
        this.typeOfExams = typeOfExams;
    }

    public ExamsHistoryDto() {

    }

    public ExamsHistoryDto(Long id, Set<Questions> questions, String examsHistoryAnswer, String examsHistoryFileAnswer, TypeOfExams typeOfExams) {
        this.id = id;
        this.questions = questions;
        this.examsHistoryAnswer = examsHistoryAnswer;
        this.examsHistoryFileAnswer = examsHistoryFileAnswer;
        this.typeOfExams = typeOfExams;
    }
}
