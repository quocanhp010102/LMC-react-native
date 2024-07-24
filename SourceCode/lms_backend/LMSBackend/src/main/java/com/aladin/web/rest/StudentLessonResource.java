package com.aladin.web.rest;

import com.aladin.domain.StudentLesson;
import com.aladin.repository.StudentLessonRepository;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentLessonService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.dto.StudentLessonDto;
import com.aladin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.*;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import liquibase.pro.packaged.P;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
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
 * REST controller for managing {@link com.aladin.domain.StudentLesson}.
 */
@RestController
@RequestMapping("/api")
public class StudentLessonResource {

    private final Logger log = LoggerFactory.getLogger(StudentLessonResource.class);

    private static final String ENTITY_NAME = "lmsBackendStudentLesson";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentLessonService studentLessonService;

    private final StudentLessonRepository studentLessonRepository;
    private final UserService userService;
    private final LecturerService lecturerService;

    private final StudentService studentService;

    public StudentLessonResource(StudentLessonService studentLessonService, StudentLessonRepository studentLessonRepository, UserService userService, LecturerService lecturerService, StudentService studentService) {
        this.studentLessonService = studentLessonService;
        this.studentLessonRepository = studentLessonRepository;
        this.userService = userService;
        this.lecturerService = lecturerService;
        this.studentService = studentService;
    }

    /**
     * {@code POST  /student-lessons} : Create a new studentLesson.
     *
     * @param studentLesson the studentLesson to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentLesson, or with status {@code 400 (Bad Request)} if the studentLesson has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/student-lessons")
    public ResponseEntity<StudentLesson> createStudentLesson(@Valid @RequestBody StudentLesson studentLesson, Principal principal) throws URISyntaxException {
        log.debug("REST request to save StudentLesson : {}", studentLesson);
        if (studentLesson.getId() != null) {
            throw new BadRequestAlertException("A new studentLesson cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StudentLesson result = studentLessonService.save(studentLesson);
        return ResponseEntity
            .created(new URI("/api/student-lessons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /student-lessons/:id} : Updates an existing studentLesson.
     *
     * @param id the id of the studentLesson to save.
     * @param studentLesson the studentLesson to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentLesson,
     * or with status {@code 400 (Bad Request)} if the studentLesson is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studentLesson couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/student-lessons/{id}")
    public ResponseEntity<StudentLesson> updateStudentLesson(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StudentLesson studentLesson, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update StudentLesson : {}, {}", id, studentLesson);
        if (studentLesson.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentLesson.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentLessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserID(principal);
        if (!studentService.checkIsStudent(userid)) {
            throw new BadRequestAlertException("OnlyStudent", ENTITY_NAME, "OnlyStudent");
        }
        studentLesson.setIsDone("1");
        StudentLesson result = studentLessonService.save(studentLesson);
        studentLessonService.updatePercent(Integer.parseInt(result.getLesson().getCourse().getId().toString()),Integer.parseInt(result.getStudent().getId().toString()));
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentLesson.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /student-lessons/:id} : Partial updates given fields of an existing studentLesson, field will ignore if it is null
     *
     * @param id the id of the studentLesson to save.
     * @param studentLesson the studentLesson to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentLesson,
     * or with status {@code 400 (Bad Request)} if the studentLesson is not valid,
     * or with status {@code 404 (Not Found)} if the studentLesson is not found,
     * or with status {@code 500 (Internal Server Error)} if the studentLesson couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/student-lessons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudentLesson> partialUpdateStudentLesson(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StudentLesson studentLesson
    ) throws URISyntaxException {
        log.debug("REST request to partial update StudentLesson partially : {}, {}", id, studentLesson);
        if (studentLesson.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentLesson.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentLessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudentLesson> result = studentLessonService.partialUpdate(studentLesson);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentLesson.getId().toString())
        );
    }

    /**
     * {@code GET  /student-lessons} : get all the studentLessons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentLessons in body.
     */
    @GetMapping("/student-lessons")
    public ResponseEntity<Page<StudentLesson>> getAllStudentLessons(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of StudentLessons");
        Page<StudentLesson> page = studentLessonService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/student-lessons-by-studentId-and-lessonId/{lessonId}")
    public ResponseEntity<Page<StudentLesson>> findStudentLessonByLessonAndStudent(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    , @PathVariable Long lessonId) {
        log.debug("REST request to get a page of StudentLessons");

        Page<StudentLesson> page = studentLessonService.findStudentLessonByLessonAndStudent(pageable,lessonId,principal);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /student-lessons/:id} : get the "id" studentLesson.
     *
     * @param id the id of the studentLesson to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studentLesson, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/student-lessons/{id}")
    public ResponseEntity<StudentLesson> getStudentLesson(@PathVariable Long id) {
        log.debug("REST request to get StudentLesson : {}", id);
        Optional<StudentLesson> studentLesson = studentLessonService.findOne(id);
        return ResponseUtil.wrapOrNotFound(studentLesson);
    }

    /**
     * {@code DELETE  /student-lessons/:id} : delete the "id" studentLesson.
     *
     * @param id the id of the studentLesson to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/student-lessons/{id}")
    public ResponseEntity<Void> deleteStudentLesson(@PathVariable Long id) {
        log.debug("REST request to delete StudentLesson : {}", id);
        studentLessonService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/student-lessons?query=:query} : search for the studentLesson corresponding
     * to the query.
     *
     * @param query the query of the studentLesson search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/student-lessons")
    public ResponseEntity<Page<StudentLesson>> searchStudentLessons(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of StudentLessons for query {}", query);
        Page<StudentLesson> page = studentLessonService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/percent-course-of-student/{id}")
    public ResponseEntity<Map<String, Object>> getStudentByCourseId(
        @PathVariable("id") Long courseId,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {

        List<StudentLessonDto> list = studentLessonService.getStudentByCourseId(pageable, courseId);
        list.forEach(p->{
            log.info("====> "+p.getPercent());
        });
        Integer totalPage = 0;
        Integer totalElement = studentLessonService.total(courseId);
        if(totalElement% pageable.getPageSize() ==0){
            totalPage = totalElement/pageable.getPageSize();
        }
        else{
            totalPage = totalElement/pageable.getPageSize()+1;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("content", list);
        map.put("totalPage", totalPage);
        return ResponseEntity.ok().body(map);
    }

    @GetMapping("/search-percent-course-of-student/{id}")
    public ResponseEntity<Map<String, Object>> getStudentByCourseIdAndStudentName(
        @PathVariable("id") Long courseId,
        @RequestParam("query") String param,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {

        List<StudentLessonDto> list = studentLessonService.getStudentByCourseIdAndStudentName(pageable,courseId, param);
        Integer totalPage = 0;
        Integer totalElement = studentLessonService.totalSearch(courseId, param);
        if(totalElement % pageable.getPageSize() ==0){
            totalPage = totalElement/pageable.getPageSize();
        }
        else{
            totalPage = totalElement/ pageable.getPageSize()+1;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("content", list);
        map.put("totalPage", totalPage);
        return ResponseEntity.ok().body(map);
    }
}
