package com.aladin.web.rest;

import com.aladin.domain.*;
import com.aladin.repository.ExamsHistoryRepository;
import com.aladin.repository.ExamsRepository;
import com.aladin.repository.StudentRepository;
import com.aladin.service.*;
import com.aladin.service.dto.ExamsHistoryDto;
import com.aladin.service.dto.ExamsHistoryOfStudentOfCourse;
import com.aladin.web.rest.dto.StudentExamsDto;
import com.aladin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.*;

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

/**
 * REST controller for managing {@link com.aladin.domain.ExamsHistory}.
 */
@RestController
@RequestMapping("/api")
public class ExamsHistoryResource {

    private final Logger log = LoggerFactory.getLogger(ExamsHistoryResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementExamsHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExamsHistoryService examsHistoryService;

    private final ExamsHistoryRepository examsHistoryRepository;

    private final ExamsService examsService;

    private final AnswersService answersService;

    private final StudentService studentService;

    private final StudentRepository studentRepository;

    private  final ExamsRepository examsRepository;

    private  final QuestionsService questionsService;

    private final UserService userService;

    private final LecturerService lecturerService;

    public ExamsHistoryResource(ExamsHistoryService examsHistoryService,
                                ExamsHistoryRepository examsHistoryRepository,
                                ExamsService examsService,
                                AnswersService answersService,
                                ExamsRepository examsRepository,
                                QuestionsService questionsService,
                                UserService userService,
                                LecturerService lecturerService,
                                StudentService studentService, StudentRepository studentRepository) {
        this.examsHistoryService = examsHistoryService;
        this.examsHistoryRepository = examsHistoryRepository;
        this.examsService = examsService;
        this.answersService = answersService;
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.examsRepository = examsRepository;
        this.questionsService = questionsService;
        this.userService = userService;
        this.lecturerService = lecturerService;
    }

    /**
     * {@code POST  /exams-histories} : Create a new examsHistory.
     *
     * @param examsHistoryDto the examsHistory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new examsHistory, or with status {@code 400 (Bad Request)} if the examsHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exams-histories")
    public ResponseEntity<ExamsHistory> createExamsHistory(@RequestBody ExamsHistoryDto examsHistoryDto, Principal principal) throws URISyntaxException {
        log.debug("REST request to save ExamsHistory : {}", examsHistoryDto);
        String userId = userService.getUserID(principal);
      if(!examsService.checkStudentPassedExams(examsHistoryDto.getId(), userId)){
          throw new BadRequestAlertException("You have completed the test", ENTITY_NAME, "You have completed the test");
      }
        ExamsHistory examsHistory = new ExamsHistory();
        if(examsHistoryDto.getTypeOfExams().getId() != null && examsHistoryDto.getTypeOfExams().getId() == 1) {
            processExams(examsHistory, examsHistoryDto);
        }else{
            examsHistory.setExamsHistoryStatus("0");
            if(examsHistoryDto.getExamsHistoryAnswer() != null && !examsHistoryDto.getExamsHistoryAnswer().equals("")){
                examsHistory.setExamsHistoryAnswer(examsHistoryDto.getExamsHistoryAnswer());
            }if(examsHistoryDto.getExamsHistoryFileAnswer() != null && !examsHistoryDto.getExamsHistoryFileAnswer().equals("")){
                examsHistory.setExamsHistoryFileAnswer(examsHistoryDto.getExamsHistoryFileAnswer());
            }
        }
       examsHistory.setExams(examsRepository.findOneById(examsHistoryDto.getId()));
        ExamsHistory result = examsHistoryService.save(examsHistory,principal);
        return ResponseEntity
            .created(new URI("/api/exams-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /exams-histories/:id} : Updates an existing examsHistory.
     *
     * @param id the id of the examsHistory to save.
     * @param examsHistory the examsHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examsHistory,
     * or with status {@code 400 (Bad Request)} if the examsHistory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the examsHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exams-histories/{id}")
    public ResponseEntity<ExamsHistory> updateExamsHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExamsHistory examsHistory, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update ExamsHistory : {}, {}", id, examsHistory);
        if (examsHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examsHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examsHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }

        ExamsHistory result = examsHistoryService.save(examsHistory, principal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examsHistory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /exams-histories/:id} : Partial updates given fields of an existing examsHistory, field will ignore if it is null
     *
     * @param id the id of the examsHistory to save.
     * @param examsHistory the examsHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examsHistory,
     * or with status {@code 400 (Bad Request)} if the examsHistory is not valid,
     * or with status {@code 404 (Not Found)} if the examsHistory is not found,
     * or with status {@code 500 (Internal Server Error)} if the examsHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exams-histories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExamsHistory> partialUpdateExamsHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExamsHistory examsHistory,
        Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExamsHistory partially : {}, {}", id, examsHistory);
        if (examsHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examsHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examsHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }


        Optional<ExamsHistory> result = examsHistoryService.partialUpdate(examsHistory);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examsHistory.getId().toString())
        );
    }

    /**
     * {@code GET  /exams-histories} : get all the examsHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of examsHistories in body.
     */
    @GetMapping("/exams-histories")
    public ResponseEntity<Page<ExamsHistory>> getAllExamsHistories(@org.springdoc.api.annotations.ParameterObject Pageable pageable,Principal principal) {
        log.debug("REST request to get a page of ExamsHistories");
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        Page<ExamsHistory> page = examsHistoryService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    /**
     * {@code GET  /exams-histories/:id} : get the "id" examsHistory.
     *
     * @param id the id of the examsHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the examsHistory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exams-histories/{id}")
    public ResponseEntity<ExamsHistory> getExamsHistory(@PathVariable Long id) {
        log.debug("REST request to get ExamsHistory : {}", id);
        ExamsHistory examsHistory = examsHistoryService.findOne(id);
        return ResponseEntity.ok(examsHistory);
    }

    /**
     * {@code DELETE  /exams-histories/:id} : delete the "id" examsHistory.
     *
     * @param id the id of the examsHistory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exams-histories/{id}")
    public ResponseEntity<Void> deleteExamsHistory(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete ExamsHistory : {}", id);
        examsHistoryService.delete(id);
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/exams-histories?query=:query} : search for the examsHistory corresponding
     * to the query.
     *
     * @param query the query of the examsHistory search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/exams-histories")
    public ResponseEntity<List<ExamsHistory>> searchExamsHistories(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of ExamsHistories for query {}", query);
        Page<ExamsHistory> page = examsHistoryService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/exams-histories/exams/{id}")
    public ResponseEntity<ExamsHistory> getOneExamsByIdAndStatus(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get ExamsHistory by examsId : {}", id);
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        if(!examsHistoryService.checkExamsHistoryNotGraded(id)){
            throw new BadRequestAlertException("No content", ENTITY_NAME,"No content");
        }
        ExamsHistory examsHistory = examsHistoryService.findOneByStatusAndExamsId("0",id);
        return ResponseEntity.ok(examsHistory);
    }

    @GetMapping("/exams-histories/course-student")
    public ResponseEntity<Page<ExamsHistoryOfStudentOfCourse>> getAllExamsHistoryByCourseIdAndStudentId(
                                         @RequestParam(name="studentId") Long studentId,
                                         @RequestParam(name="courseId") Long courseId,
                                         Principal principal,
                                         @org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        Student student = studentService.findOneById(studentId);
        log.debug("REST request to get ExamsHistory by studentId and CourseId : {}", studentId, courseId);
        String userId = userService.getUserID(principal);
//        if(!lecturerService.checkIsLecturer(userId)){
//            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
//        }
        Page<ExamsHistoryOfStudentOfCourse> page = examsHistoryService.findAllByCourseIdAndStudentId(courseId,studentId,pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/exams-histories/exams-student")
    public ResponseEntity<ExamsHistory> getAllExamsHistoryByExamsIdAndStudentId(
        @RequestParam(name="studentId") Long studentId,
        @RequestParam(name="examsId") Long examsId) {

        log.debug("REST request to get ExamsHistory by studentId and ExamsId : {}", studentId, examsId);
        ExamsHistory examsHistory = examsHistoryService.findOneByExamsIdAndStudentId(examsId,studentId);
        Student student = studentService.findOneByExamsHistoryId(examsHistory.getId());
        Exams exams = examsRepository.findOneById(examsHistory.getExams().getId());
        Set<Questions> questions = questionsService.findAllbyExamId(examsHistory.getExams().getId());
        exams.setQuestions(questions);
        examsHistory.setExams(exams);
        examsHistory.setStudent(student);
        return ResponseEntity.ok(examsHistory);
    }

    @GetMapping("/exams-histories/student-point/exams/{id}")
    public ResponseEntity<Page<StudentExamsDto>>  getStudentAndPointByExamsId(@PathVariable Long id,@org.springdoc.api.annotations.ParameterObject Pageable pageable,
                                                                              Principal principal){
        log.debug("REST request to getStudentAndPointByExamsId : {}", id);
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        Page<StudentExamsDto> resultf = examsHistoryService.getStudentAndPointByExamId(id, pageable);
        return  ResponseEntity.ok(resultf);

    }

    public void processExams(ExamsHistory examsHistory, ExamsHistoryDto examsHistoryDto){

        List<Long> lstIdAnswersSelected= new ArrayList<>();
       Set<Questions> lstQuestion = examsHistoryDto.getQuestions();
       for (Questions questions: lstQuestion){
           Set<Answers> lstAnswers = questions.getAnswers();
           for(Answers answers : lstAnswers){
               if(answers.getAnswersStatus() != null&&answers.getAnswersStatus().equals("1")){
                   lstIdAnswersSelected.add(answers.getId());
               }
           }
       }
        double point = 0;
       if(lstIdAnswersSelected != null && lstIdAnswersSelected.size() > 0){
           point = answersService.caculatePoint(lstIdAnswersSelected);
       }
       examsHistory.setExamsHistoryPoint(String.valueOf(point));
       examsHistory.setExamsHistoryStatus("1");
    }

//    public static void main(String[] args) {
////       ExamsHistoryService examsHistoryService = new ExamsHistoryService();
//       Object[] ob = examsHistoryService.getIdExam(49951L);
//       System.out.println("=====>"+ob[0]);
//    }
}
