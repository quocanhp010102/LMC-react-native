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
     * Partially update a questions.
     *
     * @param questions the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Questions> partialUpdate(Questions questions) {
        log.debug("Request to partially update Questions : {}", questions);

        return questionsRepository
            .findById(questions.getId())
            .map(existingQuestions -> {
                if (questions.getQuestionsName() != null) {
                    existingQuestions.setQuestionsName(questions.getQuestionsName());
                }

                return existingQuestions;
            })
            .map(questionsRepository::save);
    }

    /**
     * Get all the questions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Questions> findAll(Pageable pageable) {
        log.debug("Request to get all Questions");
        return questionsRepository.findAll(pageable);
    }

    /**
     * Get one questions by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Questions> findOne(Long id) {
        log.debug("Request to get Questions : {}", id);
        return questionsRepository.findById(id);
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
//        questionsRepository.deleteById(id);
        Exams exams = examsRepository.findOneById(examsId);
        List<Questions> lstQuestions = questionsRepository.findAllByExams(exams);
        for(Questions questions : lstQuestions){
            answersRepository.deleteAll(questions.getAnswers());
        }
        questionsRepository.deleteAll(exams.getQuestions());
    }

    /**
     * Search for the questions corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Questions> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Questions for query {}", query);
        return questionsSearchRepository.search(query, pageable);
    }

    public void deleteMultiByIds(String ids){
        log.debug("Request to deleteMultiByIds", ids);
        questionsRepository.deleteMultiByIds(ids);
    }


//    public Set<Questions> findAllByExamId(Long id){
//        Exams exams= examsRepository.findOneById(id);
//        return questionsRepository.findQuestionsByExams(exams);
//    }

    public Set<Questions> findAllbyExamId(Long id){
        return questionsRepository.findAllByExamsId(id);
    }
}
