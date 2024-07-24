package com.aladin.service;

import com.aladin.domain.Exams;
import com.aladin.domain.Questions;
import com.aladin.repository.AnswersRepository;
import com.aladin.repository.ExamsRepository;
import com.aladin.repository.QuestionsRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.aladin.repository.search.QuestionsSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Questions}.
 */
@Service
@Transactional
public class QuestionsService {

    private final Logger log = LoggerFactory.getLogger(QuestionsService.class);

    private final QuestionsRepository questionsRepository;

    private final QuestionsSearchRepository questionsSearchRepository;

    private final ExamsRepository examsRepository;

    private final AnswersRepository answersRepository;

    public QuestionsService(QuestionsRepository questionsRepository,
                            QuestionsSearchRepository questionsSearchRepository,
                            ExamsRepository examsRepository,
                            AnswersRepository answersRepository) {
        this.questionsRepository = questionsRepository;
        this.questionsSearchRepository = questionsSearchRepository;
        this.examsRepository = examsRepository;
        this.answersRepository = answersRepository;
    }

    /**
     * Save a questions.
     *
     * @param questions the entity to save.
     * @return the persisted entity.
     */
    public Questions save(Questions questions) {
        log.debug("Request to save Questions : {}", questions);
        return questionsRepository.save(questions);
    }


    /**
     * Delete the questions by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Questions : {}", id);
        questionsRepository.deleteById(id);
    }

    public void deleteByExamsId(Long examsId) {
        log.debug("Request to delete Set Questions by examsId : {}", examsId);
        Exams exams = examsRepository.findOneById(examsId);
        List<Questions> lstQuestions = questionsRepository.findAllByExams(exams);
        for(Questions questions : lstQuestions){
            answersRepository.deleteAll(questions.getAnswers());
        }
        questionsRepository.deleteAll(exams.getQuestions());
    }

}
