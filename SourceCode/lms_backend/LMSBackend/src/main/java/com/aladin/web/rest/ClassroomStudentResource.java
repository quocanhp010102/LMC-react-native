package com.aladin.web.rest;

import com.aladin.domain.*;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.ClassroomStudentRepository;
import com.aladin.service.ClassroomStudentService;
import com.aladin.service.UserService;
import com.aladin.web.rest.errors.BadRequestAlertException;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;

import liquibase.pro.packaged.C;
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
 * REST controller for managing {@link com.aladin.domain.ClassroomStudent}.
 */
@RestController
@RequestMapping("/api")
public class ClassroomStudentResource {

    private final Logger log = LoggerFactory.getLogger(ClassroomStudentResource.class);

    private static final String ENTITY_NAME = "lmsBackendClassroomStudent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClassroomStudentService classroomStudentService;

    private final ClassroomStudentRepository classroomStudentRepository;
    private final UserService userService;

    private final KafkaSendNotification kafkaSendNotification;

    public ClassroomStudentResource(ClassroomStudentService classroomStudentService,
                                    KafkaSendNotification kafkaSendNotification,
                                    ClassroomStudentRepository classroomStudentRepository, UserService userService) {
        this.classroomStudentService = classroomStudentService;
        this.kafkaSendNotification = kafkaSendNotification;
        this.classroomStudentRepository = classroomStudentRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /classroom-students} : Create a new classroomStudent.
     *
     * @param classroomStudent the classroomStudent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classroomStudent, or with status {@code 400 (Bad Request)} if the classroomStudent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/classroom-students")
    public ResponseEntity<ClassroomStudent> createClassroomStudent(@RequestBody ClassroomStudent classroomStudent, Principal principal)
        throws URISyntaxException {
        log.debug("REST request to save ClassroomStudent : {}", classroomStudent);
        if (classroomStudent.getId() != null) {
            throw new BadRequestAlertException("A new classroomStudent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        ClassroomStudent result = classroomStudentService.save(classroomStudent);
        classroomStudentService.updateTotalStudent(result.getClassroom().getId());
        return ResponseEntity
            .created(new URI("/api/classroom-students/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /classroom-students/:id} : Updates an existing classroomStudent.
     *
     * @param id               the id of the classroomStudent to save.
     * @param classroomStudent the classroomStudent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classroomStudent,
     * or with status {@code 400 (Bad Request)} if the classroomStudent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classroomStudent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/classroom-students/{id}")
    public ResponseEntity<ClassroomStudent> updateClassroomStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClassroomStudent classroomStudent
    ) throws URISyntaxException {
        log.debug("REST request to update ClassroomStudent : {}, {}", id, classroomStudent);
        if (classroomStudent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classroomStudent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classroomStudentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClassroomStudent result = classroomStudentService.update(classroomStudent);
        classroomStudentService.updateTotalStudent(result.getClassroom().getId());
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classroomStudent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /classroom-students/:id} : Partial updates given fields of an existing classroomStudent, field will ignore if it is null
     *
     * @param id               the id of the classroomStudent to save.
     * @param classroomStudent the classroomStudent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classroomStudent,
     * or with status {@code 400 (Bad Request)} if the classroomStudent is not valid,
     * or with status {@code 404 (Not Found)} if the classroomStudent is not found,
     * or with status {@code 500 (Internal Server Error)} if the classroomStudent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/classroom-students/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<ClassroomStudent> partialUpdateClassroomStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClassroomStudent classroomStudent, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClassroomStudent partially : {}, {}", id, classroomStudent);
        if (classroomStudent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classroomStudent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classroomStudentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        Optional<ClassroomStudent> result = classroomStudentService.partialUpdate(classroomStudent);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classroomStudent.getId().toString())
        );
    }

    /**
     * {@code GET  /classroom-students} : get all the classroomStudents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of classroomStudents in body.
     */
    @GetMapping("/classroom-students")
    public ResponseEntity<Page<ClassroomStudent>> getAllClassroomStudents(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to get a page of ClassroomStudents");
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomStudent> page = classroomStudentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /classroom-students/:id} : get the "id" classroomStudent.
     *
     * @param id the id of the classroomStudent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classroomStudent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/classroom-students/{id}")
    public ResponseEntity<ClassroomStudent> getClassroomStudent(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get ClassroomStudent : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Optional<ClassroomStudent> classroomStudent = classroomStudentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(classroomStudent);
    }

    /**
     * {@code DELETE  /classroom-students/:id} : delete the "id" classroomStudent.
     *
     * @param id the id of the classroomStudent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/classroom-students/{id}")
    public ResponseEntity<Void> deleteClassroomStudent(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete ClassroomStudent : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        classroomStudentService.delete(id);
        ClassroomStudent result = classroomStudentService.findOneById(id);
        classroomStudentService.updateTotalStudent(result.getClassroom().getId());
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/classroom-students?query=:query} : search for the classroomStudent corresponding
     * to the query.
     *
     * @param query    the query of the classroomStudent search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/classroom-students")
    public ResponseEntity<Page<ClassroomStudent>> searchClassroomStudents(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of ClassroomStudents for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomStudent> page = classroomStudentService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @PostMapping("/classroom-students/insertStudent/{classroom_id}")
    public ResponseEntity insertStudentFromCourses(@PathVariable(value = "classroom_id") Long classroom_id,
                                                   @RequestBody Long[] student, Principal principal) throws URISyntaxException {
        log.debug("REST request to insert CourseStudent : {}", classroom_id);
        if (null == classroom_id) {
            throw new BadRequestAlertException("Invalid course_id", ENTITY_NAME, "course_id null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        for (Long detail : student) {
            log.warn("st to deatil: " + detail);
            ClassroomStudent classroomStudent = new ClassroomStudent();

            Classroom classroom = new Classroom();
            classroom.setId(classroom_id);
            classroomStudent.setClassroom(classroom);

            Student st = new Student();
            st.setId(detail);
            classroomStudent.setStudent(st);
            classroomStudent.setIsLeader("0");


            if (!classroomStudentService.checkExistStudentInClassroom(classroomStudent.getStudent().getId(), classroomStudent.getClassroom().getId())) {
                classroomStudent = classroomStudentService.save(classroomStudent);
                classroomStudentService.updateTotalStudent(classroomStudent.getClassroom().getId());
            }
            kafkaSendNotification.classroomStudentAlert(classroomStudent, userid);
        }
        return ResponseEntity
            .created(new URI("/api/classroom-students/" + classroom_id))
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, classroom_id.toString()))
            .build();
    }

    @DeleteMapping("/classroom-students/deleteStudent/{classroom_id}")
    public ResponseEntity deleteStudentFromClassroom(@PathVariable(value = "classroom_id") Long classroom_id,
                                                     @RequestBody Long[] student, Principal principal) {
        log.debug("REST request to  deleteStudentFromClassroom : {}", classroom_id);
        if (null == classroom_id) {
            throw new BadRequestAlertException("Invalid course_id", ENTITY_NAME, "course_id null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        for (Long detail : student) {
            log.warn("st to deatil: " + detail);
            classroomStudentService.deleteStudentFromClassroom(classroom_id, detail);
            classroomStudentService.updateTotalStudent(classroom_id);
        }
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, classroom_id.toString()))
            .build();
    }

}
