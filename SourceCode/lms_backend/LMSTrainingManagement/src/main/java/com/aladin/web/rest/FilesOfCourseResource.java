package com.aladin.web.rest;

import com.aladin.domain.FilesOfCourse;
import com.aladin.repository.FilesOfCourseRepository;
import com.aladin.service.FilesOfCourseService;
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
 * REST controller for managing {@link FilesOfCourse}.
 */
@RestController
@RequestMapping("/api")
public class FilesOfCourseResource {

    private final Logger log = LoggerFactory.getLogger(FilesOfCourseResource.class);

    private static final String ENTITY_NAME = "lmsBackendFilesOfCourse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FilesOfCourseService filesOfCourseService;

    private final FilesOfCourseRepository filesOfCourseRepository;

    public FilesOfCourseResource(FilesOfCourseService filesOfCourseService, FilesOfCourseRepository filesOfCourseRepository) {
        this.filesOfCourseService = filesOfCourseService;
        this.filesOfCourseRepository = filesOfCourseRepository;
    }

    /**
     * {@code POST  /files-of-courses} : Create a new filesOfCourse.
     *
     * @param filesOfCourse the filesOfCourse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new filesOfCourse, or with status {@code 400 (Bad Request)} if the filesOfCourse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/files-of-courses")
    public ResponseEntity<FilesOfCourse> createFilesOfCourse(@Valid @RequestBody FilesOfCourse filesOfCourse) throws URISyntaxException {
        log.debug("REST request to save FilesOfCourse : {}", filesOfCourse);
        if (filesOfCourse.getId() != null) {
            throw new BadRequestAlertException("A new filesOfCourse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FilesOfCourse result = filesOfCourseService.save(filesOfCourse);
        return ResponseEntity
            .created(new URI("/api/files-of-courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /files-of-courses/:id} : Updates an existing filesOfCourse.
     *
     * @param id the id of the filesOfCourse to save.
     * @param filesOfCourse the filesOfCourse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filesOfCourse,
     * or with status {@code 400 (Bad Request)} if the filesOfCourse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the filesOfCourse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/files-of-courses/{id}")
    public ResponseEntity<FilesOfCourse> updateFilesOfCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FilesOfCourse filesOfCourse
    ) throws URISyntaxException {
        log.debug("REST request to update FilesOfCourse : {}, {}", id, filesOfCourse);
        if (filesOfCourse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filesOfCourse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filesOfCourseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FilesOfCourse result = filesOfCourseService.save(filesOfCourse);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, filesOfCourse.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /files-of-courses/:id} : Partial updates given fields of an existing filesOfCourse, field will ignore if it is null
     *
     * @param id the id of the filesOfCourse to save.
     * @param filesOfCourse the filesOfCourse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filesOfCourse,
     * or with status {@code 400 (Bad Request)} if the filesOfCourse is not valid,
     * or with status {@code 404 (Not Found)} if the filesOfCourse is not found,
     * or with status {@code 500 (Internal Server Error)} if the filesOfCourse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/files-of-courses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FilesOfCourse> partialUpdateFilesOfCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FilesOfCourse filesOfCourse
    ) throws URISyntaxException {
        log.debug("REST request to partial update FilesOfCourse partially : {}, {}", id, filesOfCourse);
        if (filesOfCourse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filesOfCourse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filesOfCourseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FilesOfCourse> result = filesOfCourseService.partialUpdate(filesOfCourse);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, filesOfCourse.getId().toString())
        );
    }

    /**
     * {@code GET  /files-of-courses} : get all the filesOfCourses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of filesOfCourses in body.
     */
    @GetMapping("/files-of-courses")
    public ResponseEntity<List<FilesOfCourse>> getAllFilesOfCourses(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of FilesOfCourses");
        Page<FilesOfCourse> page = filesOfCourseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /files-of-courses/:id} : get the "id" filesOfCourse.
     *
     * @param id the id of the filesOfCourse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the filesOfCourse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/files-of-courses/{id}")
    public ResponseEntity<FilesOfCourse> getFilesOfCourse(@PathVariable Long id) {
        log.debug("REST request to get FilesOfCourse : {}", id);
        Optional<FilesOfCourse> filesOfCourse = filesOfCourseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(filesOfCourse);
    }

    /**
     * {@code DELETE  /files-of-courses/:id} : delete the "id" filesOfCourse.
     *
     * @param id the id of the filesOfCourse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/files-of-courses/{id}")
    public ResponseEntity<Void> deleteFilesOfCourse(@PathVariable Long id) {
        log.debug("REST request to delete FilesOfCourse : {}", id);
        filesOfCourseService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/files-of-courses?query=:query} : search for the filesOfCourse corresponding
     * to the query.
     *
     * @param query the query of the filesOfCourse search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/files-of-courses")
    public ResponseEntity<List<FilesOfCourse>> searchFilesOfCourses(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of FilesOfCourses for query {}", query);
        Page<FilesOfCourse> page = filesOfCourseService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
