package com.aladin.web.rest;

import com.aladin.domain.FilesOfCourse;
import com.aladin.domain.FilesOfLesson;
import com.aladin.repository.FilesOfLessonRepository;
import com.aladin.service.FilesOfLessonService;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.web.rest.errors.BadRequestAlertException;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import oracle.net.aso.f;
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
 * REST controller for managing {@link com.aladin.domain.FilesOfLesson}.
 */
@RestController
@RequestMapping("/api")
public class FilesOfLessonResource {

    private final Logger log = LoggerFactory.getLogger(FilesOfLessonResource.class);

    private static final String ENTITY_NAME = "lmsBackendFilesOfLesson";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FilesOfLessonService filesOfLessonService;

    private final FilesOfLessonRepository filesOfLessonRepository;

    private final LecturerService lecturerService;

    private final UserService userService;

    private final StudentService studentService;

    public FilesOfLessonResource(FilesOfLessonService filesOfLessonService, FilesOfLessonRepository filesOfLessonRepository, LecturerService lecturerService, UserService userService, StudentService studentService) {
        this.filesOfLessonService = filesOfLessonService;
        this.filesOfLessonRepository = filesOfLessonRepository;
        this.lecturerService = lecturerService;
        this.userService = userService;
        this.studentService = studentService;
    }

    /**
     * {@code POST  /files-of-lessons} : Create a new filesOfLesson.
     *
     * @param filesOfLesson the filesOfLesson to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new filesOfLesson, or with status {@code 400 (Bad Request)} if the filesOfLesson has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/files-of-lessons")
    public ResponseEntity<FilesOfLesson> createFilesOfLesson(@Valid @RequestBody FilesOfLesson filesOfLesson, Principal principal) throws URISyntaxException {
        log.debug("REST request to save FilesOfLesson : {}", filesOfLesson);
        if (filesOfLesson.getId() != null) {
            throw new BadRequestAlertException("A new filesOfLesson cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String user_id = userService.getUserID(principal);
        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        FilesOfLesson result = filesOfLessonService.save(filesOfLesson);
        return ResponseEntity.created(new URI("/api/files-of-lessons/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code PUT  /files-of-lessons/:id} : Updates an existing filesOfLesson.
     *
     * @param id            the id of the filesOfLesson to save.
     * @param filesOfLesson the filesOfLesson to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filesOfLesson,
     * or with status {@code 400 (Bad Request)} if the filesOfLesson is not valid,
     * or with status {@code 500 (Internal Server Error)} if the filesOfLesson couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/files-of-lessons/{id}")
    public ResponseEntity<FilesOfLesson> updateFilesOfLesson(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody FilesOfLesson filesOfLesson, Principal principal) throws URISyntaxException {
        log.debug("REST request to update FilesOfLesson : {}, {}", id, filesOfLesson);
        if (filesOfLesson.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filesOfLesson.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filesOfLessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String user_id = userService.getUserID(principal);
        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        FilesOfLesson result = filesOfLessonService.save(filesOfLesson);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, filesOfLesson.getId().toString())).body(result);
    }

    /**
     * {@code PATCH  /files-of-lessons/:id} : Partial updates given fields of an existing filesOfLesson, field will ignore if it is null
     *
     * @param id            the id of the filesOfLesson to save.
     * @param filesOfLesson the filesOfLesson to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filesOfLesson,
     * or with status {@code 400 (Bad Request)} if the filesOfLesson is not valid,
     * or with status {@code 404 (Not Found)} if the filesOfLesson is not found,
     * or with status {@code 500 (Internal Server Error)} if the filesOfLesson couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/files-of-lessons/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<FilesOfLesson> partialUpdateFilesOfLesson(@PathVariable(value = "id", required = false) final Long id,
                                                                    @NotNull @RequestBody FilesOfLesson filesOfLesson, Principal principal) throws URISyntaxException {
        log.debug("REST request to partial update FilesOfLesson partially : {}, {}", id, filesOfLesson);
        if (filesOfLesson.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filesOfLesson.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!filesOfLessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String user_id=userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(user_id)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"onlyLecturer");
        }
        Optional<FilesOfLesson> result = filesOfLessonService.partialUpdate(filesOfLesson);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, filesOfLesson.getId().toString()));
    }

    /**
     * {@code GET  /files-of-lessons} : get all the filesOfLessons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of filesOfLessons in body.
     */
    @GetMapping("/files-of-lessons")
    public ResponseEntity<Page<FilesOfLesson>> getAllFilesOfLessons(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of FilesOfLessons");
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<FilesOfLesson> page = filesOfLessonService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /files-of-lessons/:id} : get the "id" filesOfLesson.
     *
     * @param id the id of the filesOfLesson to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the filesOfLesson, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/files-of-lessons/{id}")
    public ResponseEntity<FilesOfLesson> getFilesOfLesson(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get FilesOfLesson : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Optional<FilesOfLesson> filesOfLesson = filesOfLessonService.findOne(id);
        return ResponseUtil.wrapOrNotFound(filesOfLesson);
    }

    /**
     * {@code DELETE  /files-of-lessons/:id} : delete the "id" filesOfLesson.
     *
     * @param id the id of the filesOfLesson to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/files-of-lessons/{id}")
    public ResponseEntity<Void> deleteFilesOfLesson(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete FilesOfLesson : {}", id);
        String userid = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userid) && !userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdminAndLecturer", ENTITY_NAME,"OnlyAdminAndLecturer");
        }
        filesOfLessonService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/files-of-lessons?query=:query} : search for the filesOfLesson corresponding
     * to the query.
     *
     * @param query    the query of the filesOfLesson search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/files-of-lessons")
    public ResponseEntity<Page<FilesOfLesson>> searchFilesOfLessons(@RequestParam String query, @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to search for a page of FilesOfLessons for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<FilesOfLesson> page = filesOfLessonService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @GetMapping("/files-of-lessons/getByLesson/{id}")
    public ResponseEntity<Page<FilesOfLesson>> getAllFilesOfLessonByLesson(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getLessonByCourse : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<FilesOfLesson> page = filesOfLessonService.getFilesOfLessonByLesson(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }
}
