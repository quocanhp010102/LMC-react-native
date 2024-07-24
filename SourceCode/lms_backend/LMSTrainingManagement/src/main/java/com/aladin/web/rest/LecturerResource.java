package com.aladin.web.rest;

import com.aladin.domain.Lecturer;
import com.aladin.repository.LecturerRepository;
import com.aladin.service.LecturerService;
import com.aladin.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link Lecturer}.
 */
@RestController
@RequestMapping("/api")
public class LecturerResource {

    private final Logger log = LoggerFactory.getLogger(LecturerResource.class);

    private static final String ENTITY_NAME = "lmsBackendLecturer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LecturerService lecturerService;

    private final LecturerRepository lecturerRepository;

    public LecturerResource(LecturerService lecturerService, LecturerRepository lecturerRepository) {
        this.lecturerService = lecturerService;
        this.lecturerRepository = lecturerRepository;
    }

    /**
     * {@code POST  /lecturers} : Create a new lecturer.
     *
     * @param lecturer the lecturer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lecturer, or with status {@code 400 (Bad Request)} if the lecturer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lecturers")
    public ResponseEntity<Lecturer> createLecturer(@Valid @RequestBody Lecturer lecturer) throws URISyntaxException {
        log.debug("REST request to save Lecturer : {}", lecturer);
        if (lecturer.getId() != null) {
            throw new BadRequestAlertException("A new lecturer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Lecturer result = lecturerService.save(lecturer);
        return ResponseEntity
            .created(new URI("/api/lecturers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lecturers/:id} : Updates an existing lecturer.
     *
     * @param id the id of the lecturer to save.
     * @param lecturer the lecturer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lecturer,
     * or with status {@code 400 (Bad Request)} if the lecturer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lecturer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lecturers/{id}")
    public ResponseEntity<Lecturer> updateLecturer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Lecturer lecturer
    ) throws URISyntaxException {
        log.debug("REST request to update Lecturer : {}, {}", id, lecturer);
        if (lecturer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lecturer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lecturerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Lecturer result = lecturerService.save(lecturer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lecturer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lecturers/:id} : Partial updates given fields of an existing lecturer, field will ignore if it is null
     *
     * @param id the id of the lecturer to save.
     * @param lecturer the lecturer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lecturer,
     * or with status {@code 400 (Bad Request)} if the lecturer is not valid,
     * or with status {@code 404 (Not Found)} if the lecturer is not found,
     * or with status {@code 500 (Internal Server Error)} if the lecturer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lecturers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Lecturer> partialUpdateLecturer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Lecturer lecturer
    ) throws URISyntaxException {
        log.debug("REST request to partial update Lecturer partially : {}, {}", id, lecturer);
        if (lecturer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lecturer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lecturerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Lecturer> result = lecturerService.partialUpdate(lecturer);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lecturer.getId().toString())
        );
    }

    /**
     * {@code GET  /lecturers} : get all the lecturers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lecturers in body.
     */
    @GetMapping("/lecturers")
    public ResponseEntity<List<Lecturer>> getAllLecturers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Lecturers");
        Page<Lecturer> page = lecturerService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lecturers/:id} : get the "id" lecturer.
     *
     * @param id the id of the lecturer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lecturer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lecturers/{id}")
    public ResponseEntity<Lecturer> getLecturer(@PathVariable Long id) {
        log.debug("REST request to get Lecturer : {}", id);
        Optional<Lecturer> lecturer = lecturerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lecturer);
    }

    /**
     * {@code DELETE  /lecturers/:id} : delete the "id" lecturer.
     *
     * @param id the id of the lecturer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lecturers/{id}")
    public ResponseEntity<Void> deleteLecturer(@PathVariable Long id) {
        log.debug("REST request to delete Lecturer : {}", id);
        lecturerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/lecturers?query=:query} : search for the lecturer corresponding
     * to the query.
     *
     * @param query the query of the lecturer search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/lecturers")
    public ResponseEntity<List<Lecturer>> searchLecturers(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Lecturers for query {}", query);
        Page<Lecturer> page = lecturerService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
