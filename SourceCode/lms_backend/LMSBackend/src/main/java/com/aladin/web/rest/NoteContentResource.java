package com.aladin.web.rest;

import com.aladin.domain.NoteContent;
import com.aladin.repository.NoteContentRepository;
import com.aladin.service.LecturerService;
import com.aladin.service.NoteContentService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.NoteContent}.
 */
@RestController
@RequestMapping("/api")
public class NoteContentResource {

    private final Logger log = LoggerFactory.getLogger(NoteContentResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementNoteContent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NoteContentService noteContentService;

    private final NoteContentRepository noteContentRepository;

    private final UserService userService;

    private final StudentService studentService;

    private final LecturerService lecturerService;

    public NoteContentResource(NoteContentService noteContentService, NoteContentRepository noteContentRepository, UserService userService, StudentService studentService, LecturerService lecturerService) {
        this.noteContentService = noteContentService;
        this.noteContentRepository = noteContentRepository;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }


    /**
     * {@code GET  /note-contents/:id} : get the "id" noteContent.
     *
     * @param id the id of the noteContent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the noteContent, or with status {@code 404 (Not Found)}.
     */
//    @GetMapping("/note-contents/{id}")
//    public ResponseEntity<NoteContent> getNoteContent(@PathVariable Long id) {
//        log.debug("REST request to get NoteContent : {}", id);
//        Optional<NoteContent> noteContent = noteContentService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(noteContent);
//    }

    /**
     * {@code DELETE  /note-contents/:id} : delete the "id" noteContent.
     *
     * @param id the id of the noteContent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
//    @DeleteMapping("/note-contents/{id}")
//    public ResponseEntity<Void> deleteNoteContent(@PathVariable Long id) {
//        log.debug("REST request to delete NoteContent : {}", id);
//        noteContentService.delete(id);
//        return ResponseEntity
//            .noContent()
//            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
//            .build();
//    }


}
