package com.aladin.web.rest;

import com.aladin.domain.NoteContent;
import com.aladin.repository.NoteContentRepository;
import com.aladin.service.NoteContentService;
import com.aladin.service.NoteService;
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

    private  final NoteService noteService;

    public NoteContentResource(NoteContentService noteContentService,
                               NoteService noteService,
                               NoteContentRepository noteContentRepository) {
        this.noteContentService = noteContentService;
        this.noteContentRepository = noteContentRepository;
        this.noteService = noteService;
    }

    /**
     * {@code POST  /note-contents} : Create a new noteContent.
     *
     * @param noteContent the noteContent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new noteContent, or with status {@code 400 (Bad Request)} if the noteContent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/note-contents")
    public ResponseEntity<NoteContent> createNoteContent(@RequestBody NoteContent noteContent) throws URISyntaxException {
        log.debug("REST request to save NoteContent : {}", noteContent);
        if (noteContent.getId() != null) {
            throw new BadRequestAlertException("A new noteContent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NoteContent result = noteContentService.save(noteContent);
        return ResponseEntity
            .created(new URI("/api/note-contents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /note-contents/:id} : Updates an existing noteContent.
     *
     * @param id the id of the noteContent to save.
     * @param noteContent the noteContent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated noteContent,
     * or with status {@code 400 (Bad Request)} if the noteContent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the noteContent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/note-contents/{id}")
    public ResponseEntity<NoteContent> updateNoteContent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NoteContent noteContent
    ) throws URISyntaxException {
        log.debug("REST request to update NoteContent : {}, {}", id, noteContent);
        if (noteContent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, noteContent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!noteContentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NoteContent result = noteContentService.save(noteContent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, noteContent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /note-contents/:id} : Partial updates given fields of an existing noteContent, field will ignore if it is null
     *
     * @param id the id of the noteContent to save.
     * @param noteContent the noteContent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated noteContent,
     * or with status {@code 400 (Bad Request)} if the noteContent is not valid,
     * or with status {@code 404 (Not Found)} if the noteContent is not found,
     * or with status {@code 500 (Internal Server Error)} if the noteContent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/note-contents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NoteContent> partialUpdateNoteContent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NoteContent noteContent
    ) throws URISyntaxException {
        log.debug("REST request to partial update NoteContent partially : {}, {}", id, noteContent);
        if (noteContent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, noteContent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!noteContentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NoteContent result = noteContentService.partialUpdate(noteContent);

        return ResponseEntity.ok(result);

    }

    /**
     * {@code GET  /note-contents} : get all the noteContents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of noteContents in body.
     */
    @GetMapping("/note-contents")
    public ResponseEntity<List<NoteContent>> getAllNoteContents(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of NoteContents");
        Page<NoteContent> page = noteContentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /note-contents/:id} : get the "id" noteContent.
     *
     * @param id the id of the noteContent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the noteContent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/note-contents/{id}")
    public ResponseEntity<NoteContent> getNoteContent(@PathVariable Long id) {
        log.debug("REST request to get NoteContent : {}", id);
//        Optional<NoteContent> noteContent = noteContentService.findOne(id);
        NoteContent noteContent = noteContentRepository.findOneById(id);
        return ResponseEntity.ok(noteContent);
    }

    @GetMapping("/note-contents/note/{id}")
    public ResponseEntity<List<NoteContent>> getLstNoteContentByNoteIs(@PathVariable Long id) {
        log.debug("REST request to get NoteContent : {}", id);
        NoteContent noteContent = noteContentRepository.findOneById(id);
        return null;
    }

    /**
     * {@code DELETE  /note-contents/:id} : delete the "id" noteContent.
     *
     * @param id the id of the noteContent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/note-contents/{id}")
    public ResponseEntity<Void> deleteNoteContent(@PathVariable Long id) {
        log.debug("REST request to delete NoteContent : {}", id);
        noteContentService.delete(id);
        noteService.deleteWhenNoteInNoteContent();
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/note-contents?query=:query} : search for the noteContent corresponding
     * to the query.
     *
     * @param query the query of the noteContent search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/note-contents")
    public ResponseEntity<List<NoteContent>> searchNoteContents(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of NoteContents for query {}", query);
        Page<NoteContent> page = noteContentService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
