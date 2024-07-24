package com.aladin.web.rest;

import com.aladin.domain.QuestionAndAnswer;
import com.aladin.domain.User;
import com.aladin.repository.CourseStudentRepository;
import com.aladin.repository.QuestionAndAnswerRepository;
import com.aladin.repository.UserRepository;
import com.aladin.service.LecturerService;
import com.aladin.service.QuestionAndAnswerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.util.AuthenticateUltil;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link QuestionAndAnswer}.
 */
@RestController
@RequestMapping("/api")
public class QuestionAndAnswerResource {

    private final Logger log = LoggerFactory.getLogger(QuestionAndAnswerResource.class);

    private static final String ENTITY_NAME = "lmsBackendQuestionAndAnswer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionAndAnswerService questionAndAnswerService;

    private final QuestionAndAnswerRepository questionAndAnswerRepository;

    private final CourseStudentRepository courseStudentRepository;

    private final UserRepository userRepository;

    private final UserService userService;

    private final StudentService studentService;

    private final LecturerService lecturerService;

    public QuestionAndAnswerResource(QuestionAndAnswerService questionAndAnswerService, QuestionAndAnswerRepository questionAndAnswerRepository, CourseStudentRepository courseStudentRepository, UserRepository userRepository, UserService userService, StudentService studentService, LecturerService lecturerService) {
        this.questionAndAnswerService = questionAndAnswerService;
        this.questionAndAnswerRepository = questionAndAnswerRepository;
        this.courseStudentRepository = courseStudentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }

    /**
     * {@code POST  /question-and-answers} : Create a new questionAndAnswer.
     *
     * @param questionAndAnswer the questionAndAnswer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionAndAnswer, or with status {@code 400 (Bad Request)} if the questionAndAnswer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-and-answers")
    public ResponseEntity<QuestionAndAnswer> createQuestionAndAnswer(@RequestBody QuestionAndAnswer questionAndAnswer, Principal principal)
        throws URISyntaxException {
        log.debug("REST request to save QuestionAndAnswer : {}", questionAndAnswer);
        if (questionAndAnswer.getId() != null) {
            throw new BadRequestAlertException("A new questionAndAnswer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }

            User user = userRepository.findById(userid).get();

            if (studentService.checkIsStudent(userid)){
                questionAndAnswer.setTypeUser("0");
            }
            if (lecturerService.checkIsLecturer(userid)){
                questionAndAnswer.setTypeUser("1");
            }

            questionAndAnswer.setUser(user);
            questionAndAnswer.setStatus("0");
            QuestionAndAnswer result = questionAndAnswerService.save(questionAndAnswer,userid);
            return ResponseEntity
                .created(new URI("/api/question-and-answers/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
        }


    /**
     * {@code PUT  /question-and-answers/:id} : Updates an existing questionAndAnswer.
     *
     * @param id the id of the questionAndAnswer to save.
     * @param questionAndAnswer the questionAndAnswer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionAndAnswer,
     * or with status {@code 400 (Bad Request)} if the questionAndAnswer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionAndAnswer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-and-answers/{id}")
    public ResponseEntity<QuestionAndAnswer> updateQuestionAndAnswer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody QuestionAndAnswer questionAndAnswer, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update QuestionAndAnswer : {}, {}", id, questionAndAnswer);
        if (questionAndAnswer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, questionAndAnswer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!questionAndAnswerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }

        QuestionAndAnswer result = questionAndAnswerService.save(questionAndAnswer, userid);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionAndAnswer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /question-and-answers/:id} : Partial updates given fields of an existing questionAndAnswer, field will ignore if it is null
     *
     * @param id the id of the questionAndAnswer to save.
     * @param questionAndAnswer the questionAndAnswer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionAndAnswer,
     * or with status {@code 400 (Bad Request)} if the questionAndAnswer is not valid,
     * or with status {@code 404 (Not Found)} if the questionAndAnswer is not found,
     * or with status {@code 500 (Internal Server Error)} if the questionAndAnswer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/question-and-answers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<QuestionAndAnswer> partialUpdateQuestionAndAnswer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody QuestionAndAnswer questionAndAnswer, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update QuestionAndAnswer partially : {}, {}", id, questionAndAnswer);
        if (questionAndAnswer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, questionAndAnswer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionAndAnswerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Optional<QuestionAndAnswer> result = questionAndAnswerService.partialUpdate(questionAndAnswer);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionAndAnswer.getId().toString())
        );
    }

    /**
     * {@code GET  /question-and-answers} : get all the questionAndAnswers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionAndAnswers in body.
     */
    @GetMapping("/question-and-answers")
    public ResponseEntity<Page<QuestionAndAnswer>> getAllQuestionAndAnswers(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to get a page of QuestionAndAnswers");

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<QuestionAndAnswer> page = questionAndAnswerService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/question-and-answers-userId")
    public ResponseEntity<Page<QuestionAndAnswer>> findQuestionAndAnswerByUserId(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to get a page of QuestionAndAnswers");
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        String login_info= AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser=courseStudentRepository.getIdUser(login_info);
        Page<QuestionAndAnswer> page = questionAndAnswerService.findQuestionAndAnswerByUserId(pageable,getIdUser);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /question-and-answers/:id} : get the "id" questionAndAnswer.
     *
     * @param id the id of the questionAndAnswer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionAndAnswer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-and-answers/{id}")
    public ResponseEntity<QuestionAndAnswer> getQuestionAndAnswer(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get QuestionAndAnswer : {}", id);

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Optional<QuestionAndAnswer> questionAndAnswer = questionAndAnswerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(questionAndAnswer);
    }

    /**
     * {@code DELETE  /question-and-answers/:id} : delete the "id" questionAndAnswer.
     *
     * @param id the id of the questionAndAnswer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-and-answers/{id}")
    public ResponseEntity<Void> deleteQuestionAndAnswer(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete QuestionAndAnswer : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        questionAndAnswerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/question-and-answers?query=:query} : search for the questionAndAnswer corresponding
     * to the query.
     *
     * @param query the query of the questionAndAnswer search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/question-and-answers")
    public ResponseEntity<Page<QuestionAndAnswer>> searchQuestionAndAnswers(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of QuestionAndAnswers for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<QuestionAndAnswer> page = questionAndAnswerService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }
}
