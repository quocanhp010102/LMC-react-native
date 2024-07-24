package com.aladin.service;

import com.aladin.domain.TypeOfExams;
import com.aladin.repository.TypeOfExamsRepository;
import java.util.Optional;

import com.aladin.repository.search.TypeOfExamsSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TypeOfExams}.
 */
@Service
@Transactional
public class TypeOfExamsService {

    private final Logger log = LoggerFactory.getLogger(TypeOfExamsService.class);

    private final TypeOfExamsRepository typeOfExamsRepository;

    private final TypeOfExamsSearchRepository typeOfExamsSearchRepository;

    public TypeOfExamsService(TypeOfExamsRepository typeOfExamsRepository, TypeOfExamsSearchRepository typeOfExamsSearchRepository) {
        this.typeOfExamsRepository = typeOfExamsRepository;
        this.typeOfExamsSearchRepository = typeOfExamsSearchRepository;
    }


    /**
     * Delete the typeOfExams by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TypeOfExams : {}", id);
        typeOfExamsRepository.deleteById(id);
        typeOfExamsSearchRepository.deleteById(id);
    }


}
