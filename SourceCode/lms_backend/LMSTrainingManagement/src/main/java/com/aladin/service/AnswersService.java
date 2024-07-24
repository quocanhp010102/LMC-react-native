package com.aladin.service;

import com.aladin.domain.Answers;
import com.aladin.repository.AnswersRepository;

import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.AnswersSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Answers}.
 */
@Service
@Transactional
public class AnswersService {

    private final Logger log = LoggerFactory.getLogger(AnswersService.class);

    private final AnswersRepository answersRepository;

    private final AnswersSearchRepository answersSearchRepository;

    public AnswersService(AnswersRepository answersRepository, AnswersSearchRepository answersSearchRepository) {
        this.answersRepository = answersRepository;
        this.answersSearchRepository = answersSearchRepository;
    }

    /**
     * Save a answers.
     *
     * @param answers the entity to save.
     * @return the persisted entity.
     */
    public Answers save(Answers answers) {
        log.debug("Request to save Answers : {}", answers);
        return answersRepository.save(answers);
    }

    /**
     * Partially update a answers.
     *
     * @param answers the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Answers> partialUpdate(Answers answers) {
        log.debug("Request to partially update Answers : {}", answers);

        return answersRepository
            .findById(answers.getId())
            .map(existingAnswers -> {
                if (answers.getAnswersName() != null) {
                    existingAnswers.setAnswersName(answers.getAnswersName());
                }
                if (answers.getAnswersStatus() != null) {
                    existingAnswers.setAnswersStatus(answers.getAnswersStatus());
                }

                return existingAnswers;
            })
            .map(answersRepository::save);
    }

    /**
     * Get all the answers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Answers> findAll(Pageable pageable) {
        log.debug("Request to get all Answers");
        return answersRepository.findAll(pageable);
    }

    /**
     * Get one answers by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Answers> findOne(Long id) {
        log.debug("Request to get Answers : {}", id);
        return answersRepository.findById(id);
    }

    /**
     * Delete the answers by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Answers : {}", id);
        answersRepository.deleteById(id);
    }


    /**
     * Search for the answers corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Answers> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Answers for query {}", query);
        return answersSearchRepository.search(query, pageable);
    }

    /**
     * deleteMultiByIds.
     *
     * @param ids the query of the search.
     */
    public void deleteMultiByIds(String ids){
        log.debug("Request to deleteMultiByIds", ids);
        answersRepository.deleteMultiByIds(ids);
    }

    public Double caculatePoint( List<Long> lstId){
        return answersRepository.caculatePoint(lstId);
    }
}
