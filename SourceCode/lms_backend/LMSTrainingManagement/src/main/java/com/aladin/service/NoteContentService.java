package com.aladin.service;

import com.aladin.domain.NoteContent;
import com.aladin.repository.NoteContentRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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
     * Save a noteContent.
     *
     * @param noteContent the entity to save.
     * @return the persisted entity.
     */
    public NoteContent save(NoteContent noteContent) {
        log.debug("Request to save NoteContent : {}", noteContent);
        return noteContentRepository.save(noteContent);
    }

    /**
     * Partially update a noteContent.
     *
     * @param noteContent the entity to update partially.
     * @return the persisted entity.
     */
    public NoteContent partialUpdate(NoteContent noteContent) {
        log.debug("Request to partially update NoteContent : {}", noteContent);
        NoteContent noteContentOld= noteContentRepository
            .findOneById(noteContent.getId());
        if (noteContent.getNoteContentTitle() != null) {
            noteContentOld.setNoteContentTitle(noteContent.getNoteContentTitle());
        }
        if (noteContent.getNoteContentContent() != null) {
            noteContentOld.setNoteContentContent(noteContent.getNoteContentContent());
        }if (noteContent.getNoteContentDate() != null){
            noteContentOld.setNoteContentDate(noteContent.getNoteContentDate());
        }
        return  noteContentRepository.save(noteContentOld);

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
    }

    /**
     * Search for the noteContent corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NoteContent> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of NoteContents for query {}", query);
        return noteContentSearchRepository.search(query, pageable);
    }

    public Set<NoteContent> findAllByNoteId(Long id){
        return noteContentRepository.findAllByNoteId(id);
    }
}
