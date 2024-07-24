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
     * Delete the answers by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Answers : {}", id);
        answersRepository.deleteById(id);
    }

}
