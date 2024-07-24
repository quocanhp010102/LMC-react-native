package com.aladin.service;

import com.aladin.domain.Exams;
import com.aladin.domain.ExamsHistory;
import com.aladin.domain.Student;
import com.aladin.repository.ExamsHistoryRepository;

import java.util.Date;
import java.util.Optional;

import com.aladin.repository.StudentRepository;
import com.aladin.repository.search.ExamsHistorySearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ExamsHistory}.
 */
@Service
@Transactional
public class ExamsHistoryService {

    private final Logger log = LoggerFactory.getLogger(ExamsHistoryService.class);

    private final ExamsHistoryRepository examsHistoryRepository;

    private final ExamsHistorySearchRepository examsHistorySearchRepository;

    private final ExamsService examsService;

    private final StudentRepository studentRepository;

    public ExamsHistoryService(ExamsHistoryRepository examsHistoryRepository, ExamsHistorySearchRepository examsHistorySearchRepository, ExamsService examsService, StudentRepository studentRepository) {
        this.examsHistoryRepository = examsHistoryRepository;
        this.examsHistorySearchRepository = examsHistorySearchRepository;
        this.examsService = examsService;
        this.studentRepository = studentRepository;
    }

    /**
     * Delete the examsHistory by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ExamsHistory : {}", id);
        examsHistoryRepository.deleteById(id);
    }

    public void deleteExamsHistoryByExam(Long exam_id) {
        log.debug("Request to deleteExamsHistoryByExam : {}", exam_id);
        examsHistoryRepository.deleteExamsHistoriesByExams(exam_id);
    }


}
