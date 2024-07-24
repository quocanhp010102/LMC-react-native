package com.aladin.service;

import com.aladin.domain.NoteContent;
import com.aladin.repository.NoteContentRepository;
import java.util.Optional;

import com.aladin.repository.search.NoteContentSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link NoteContent}.
 */
@Service
@Transactional
public class NoteContentService {

    private final Logger log = LoggerFactory.getLogger(NoteContentService.class);

    private final NoteContentRepository noteContentRepository;

    private final NoteContentSearchRepository noteContentSearchRepository;

    public NoteContentService(NoteContentRepository noteContentRepository, NoteContentSearchRepository noteContentSearchRepository) {
        this.noteContentRepository = noteContentRepository;
        this.noteContentSearchRepository = noteContentSearchRepository;
    }


    /**
     * Get all the noteContents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NoteContent> findAll(Pageable pageable) {
        log.debug("Request to get all NoteContents");
        return noteContentRepository.findAll(pageable);
    }

    /**
     * Get one noteContent by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<NoteContent> findOne(Long id) {
        log.debug("Request to get NoteContent : {}", id);
        return noteContentRepository.findById(id);
    }

    /**
     * Delete the noteContent by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete NoteContent : {}", id);
        noteContentRepository.deleteById(id);
        noteContentSearchRepository.deleteById(id);
    }


}
