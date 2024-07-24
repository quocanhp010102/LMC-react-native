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
     * Save a typeOfExams.
     *
     * @param typeOfExams the entity to save.
     * @return the persisted entity.
     */
    public TypeOfExams save(TypeOfExams typeOfExams) {
        log.debug("Request to save TypeOfExams : {}", typeOfExams);
        return typeOfExamsRepository.save(typeOfExams);
    }

    /**
     * Partially update a typeOfExams.
     *
     * @param typeOfExams the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TypeOfExams> partialUpdate(TypeOfExams typeOfExams) {
        log.debug("Request to partially update TypeOfExams : {}", typeOfExams);

        return typeOfExamsRepository
            .findById(typeOfExams.getId())
            .map(existingTypeOfExams -> {
                if (typeOfExams.getTypeOfExamsName() != null) {
                    existingTypeOfExams.setTypeOfExamsName(typeOfExams.getTypeOfExamsName());
                }

                return existingTypeOfExams;
            })
            .map(typeOfExamsRepository::save);
    }

    /**
     * Get all the typeOfExams.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TypeOfExams> findAll(Pageable pageable) {
        log.debug("Request to get all TypeOfExams");
        return typeOfExamsRepository.findAll(pageable);
    }

    /**
     * Get one typeOfExams by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TypeOfExams> findOne(Long id) {
        log.debug("Request to get TypeOfExams : {}", id);
        return typeOfExamsRepository.findById(id);
    }

    /**
     * Delete the typeOfExams by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TypeOfExams : {}", id);
        typeOfExamsRepository.deleteById(id);
    }

    /**
     * Search for the typeOfExams corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TypeOfExams> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of TypeOfExams for query {}", query);
        return typeOfExamsSearchRepository.search(query, pageable);
    }
}
