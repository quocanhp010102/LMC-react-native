package com.aladin.web.rest;

import com.aladin.domain.*;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.LessonRepository;
import com.aladin.service.*;
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.Lesson}.
 */
@RestController
@RequestMapping("/api")
public class LessonResource {

    private final Logger log = LoggerFactory.getLogger(LessonResource.class);

    private static final String ENTITY_NAME = "lmsBackendLesson";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LessonService lessonService;

    private final LessonRepository lessonRepository;

    private final UserService userService;

    private final StudentService studentService;
    private final LecturerService lecturerService;

    private final KafkaSendNotification kafkaSendNotification;

    private final StudentLessonService studentLessonService;

    public LessonResource(LessonService lessonService, LessonRepository lessonRepository, UserService userService, StudentService studentService, LecturerService lecturerService, KafkaSendNotification kafkaSendNotification, StudentLessonService studentLessonService) {
        this.lessonService = lessonService;
        this.lessonRepository = lessonRepository;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
        this.kafkaSendNotification = kafkaSendNotification;
        this.studentLessonService = studentLessonService;
    }

    /**
     * {@code POST  /lessons} : Create a new lesson.
     *
     * @param lesson the lesson to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lesson, or with status {@code 400 (Bad Request)} if the lesson has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping(value = "/lessons", consumes = {"application/json"})
    public ResponseEntity<Lesson> createLesson(@Valid @RequestBody Lesson lesson, Principal principal) throws URISyntaxException {
        log.debug("REST request to save Lesson : {}", lesson);
        if (lesson.getId() != null) {
            throw new BadRequestAlertException("A new lesson cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        User user = userService.getUserByID(user_id);
        Lesson result = lessonService.save(lesson, user);

        List<Student> lsStudent = studentService.getAllStudentIDByCourse(lesson.getCourse().getId());
        log.debug("lstStudent: " + lsStudent.size());

        for (int i = 0; i < lsStudent.size(); i++) {
            if (studentLessonService.countStudentInStudentLesson(lsStudent.get(i).getId(), lesson.getId()) != 0) {
                continue;
            } else {
                //insert into studentLesson
                StudentLesson studentLesson=new StudentLesson();
                studentLesson.setLesson(lesson);
                studentLesson.setPercent(0.0F);
                studentLesson.setIsDone("0");

                Student student=studentService.getStudentByStudentID(lsStudent.get(i).getId());
                log.debug("studentID: "+student.getId());
                log.info("student insert lesson: "+student);
                studentLesson.setStudent(student);

                studentLessonService.save(studentLesson);
            }
        }

        kafkaSendNotification.alertLesson(result, principal);
        return ResponseEntity
            .created(new URI("/api/lessons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lessons/:id} : Updates an existing lesson.
     *
     * @param id     the id of the lesson to save.
     * @param lesson the lesson to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lesson,
     * or with status {@code 400 (Bad Request)} if the lesson is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lesson couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lessons/{id}")
    public ResponseEntity<Lesson> updateLesson(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Lesson lesson, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update Lesson : {}, {}", id, lesson);
        if (lesson.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lesson.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        User user = userService.getUserByID(user_id);
        Lesson result = lessonService.save(lesson, user);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lesson.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lessons/:id} : Partial updates given fields of an existing lesson, field will ignore if it is null
     *
     * @param id     the id of the lesson to save.
     * @param lesson the lesson to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lesson,
     * or with status {@code 400 (Bad Request)} if the lesson is not valid,
     * or with status {@code 404 (Not Found)} if the lesson is not found,
     * or with status {@code 500 (Internal Server Error)} if the lesson couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lessons/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<Lesson> partialUpdateLesson(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Lesson lesson, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Lesson partially : {}, {}", id, lesson);
        if (lesson.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lesson.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }

        Optional<Lesson> result = lessonService.partialUpdate(lesson);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lesson.getId().toString())
        );
    }

    /**
     * {@code GET  /lessons} : get all the lessons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lessons in body.
     */
    @GetMapping("/lessons")
    public ResponseEntity<Page<Lesson>> getAllLessons(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of Lessons");
        String user_id = userService.getUserID(principal);
        if (!userService.checkIsAdmin(user_id) && !studentService.checkIsStudent(user_id) && !lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<Lesson> page = lessonService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    /**
     * {@code GET  /lessons/:id} : get the "id" lesson.
     *
     * @param id the id of the lesson to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lesson, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lessons/{id}")
    public ResponseEntity<Lesson> getLesson(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get Lesson : {}", id);
        String user_id = userService.getUserID(principal);
        if (!userService.checkIsAdmin(user_id) && !studentService.checkIsStudent(user_id) && !lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        User user = userService.getUserByID(user_id);
        Optional<Lesson> lesson = lessonService.findOne(id, user);
        return ResponseUtil.wrapOrNotFound(lesson);
    }

    /**
     * {@code DELETE  /lessons/:id} : delete the "id" lesson.
     *
     * @param id the id of the lesson to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete Lesson : {}", id);
        String user_id = userService.getUserID(principal);
        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        lessonService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/lessons/getByCourse/{id}")
    public ResponseEntity<Page<Lesson>> getLessonByCourse(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getLessonByCourse : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String user_id = userService.getUserID(principal);
        if (!userService.checkIsAdmin(user_id) && !studentService.checkIsStudent(user_id) && !lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<Lesson> page = lessonService.getLessonsByCourse(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }



}
