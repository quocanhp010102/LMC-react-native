package com.aladin.service;

import com.aladin.domain.Student;
import com.aladin.repository.search.TutorialSearchRepositoryDTO;
import com.aladin.service.dto.TutorialDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TutorialServiceDTO {

    private final Logger log = LoggerFactory.getLogger(TutorialDTO.class);
    private final TutorialSearchRepositoryDTO tutorialSearchRepositoryDTO;

    public TutorialServiceDTO(TutorialSearchRepositoryDTO tutorialSearchRepositoryDTO) {
        this.tutorialSearchRepositoryDTO = tutorialSearchRepositoryDTO;
    }
    @Transactional(readOnly = true)
    public Page<TutorialDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Students for query {}", query);
        return tutorialSearchRepositoryDTO.search(query, pageable);
    }
}
