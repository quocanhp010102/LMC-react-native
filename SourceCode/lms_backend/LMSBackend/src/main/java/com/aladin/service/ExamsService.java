package com.aladin.service;

import com.aladin.domain.Answers;
import com.aladin.domain.Exams;
import com.aladin.domain.Questions;
import com.aladin.repository.AnswersRepository;
import com.aladin.repository.CourseRepository;
import com.aladin.repository.ExamsRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.aladin.repository.QuestionsRepository;
import com.aladin.repository.search.ExamsSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Exams}.
 */

@Transactional
@Service
public class ExamsService {

    private final Logger log = LoggerFactory.getLogger(ExamsService.class);

    private final ExamsRepository examsRepository;

    private final ExamsSearchRepository examsSearchRepository;

    private final QuestionsRepository questionsRepository;

    private final AnswersRepository answersRepository;

    private final QuestionsService questionsService;

    private final CourseRepository courseRepository;

    public ExamsService(ExamsRepository examsRepository, ExamsSearchRepository examsSearchRepository, QuestionsRepository questionsRepository, AnswersRepository answersRepository, QuestionsService questionsService, CourseRepository courseRepository) {
        this.examsRepository = examsRepository;
        this.examsSearchRepository = examsSearchRepository;
        this.questionsRepository = questionsRepository;
        this.answersRepository = answersRepository;
        this.questionsService = questionsService;
        this.courseRepository = courseRepository;
    }


    /**
     * Delete the exams by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Exams : {}", id);
        questionsService.deleteByExamsId(id);
         examsRepository.deleteById(id);
    }


}
