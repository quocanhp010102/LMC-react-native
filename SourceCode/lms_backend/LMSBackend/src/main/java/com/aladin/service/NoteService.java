package com.aladin.service;

import com.aladin.domain.Note;
import com.aladin.domain.NoteContent;
import com.aladin.domain.Student;
import com.aladin.domain.User;
import com.aladin.repository.NoteContentRepository;
import com.aladin.repository.NoteRepository;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

import com.aladin.repository.UserRepository;
import com.aladin.repository.search.NoteSearchRepository;
import com.aladin.service.dto.NoteDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

/**
 * Service Implementation for managing {@link Note}.
 */
@Service
@Transactional
public class NoteService {

    private final Logger log = LoggerFactory.getLogger(NoteService.class);

    private final NoteRepository noteRepository;

    private  final NoteSearchRepository noteSearchRepository;

    private final NoteContentRepository noteContentRepository;

    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, NoteSearchRepository noteSearchRepository, NoteContentRepository noteContentRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.noteSearchRepository = noteSearchRepository;
        this.noteContentRepository = noteContentRepository;
        this.userRepository = userRepository;
    }


    /**
     * Get all the notes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Note> findAll(Pageable pageable) {
        log.debug("Request to get all Notes");
        return noteRepository.findAll(pageable);
    }

    /**
     * Get one note by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Note> findOne(Long id) {
        log.debug("Request to get Note : {}", id);
        return noteRepository.findById(id);
    }

    /**
     * Delete the note by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Note : {}", id);
        noteRepository.deleteById(id);
        noteSearchRepository.deleteById(id);
    }

    /**
     * Search for the note corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Note> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Notes for query {}", query);
        return noteSearchRepository.search(query, pageable);
    }


}
