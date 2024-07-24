package com.aladin.web.rest;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.aladin.domain.Answers;
import com.aladin.domain.Course;
import com.aladin.domain.Exams;
import com.aladin.domain.Questions;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.CourseRepository;
import com.aladin.repository.ExamsRepository;
import com.aladin.service.*;
import com.aladin.web.rest.errors.BadRequestAlertException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Period;
import java.util.*;
import java.util.stream.StreamSupport;

import com.fasterxml.jackson.core.JsonProcessingException;
import liquibase.pro.packaged.S;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.joda.time.DateTime;
import org.joda.time.Hours;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.Exams}.
 */
@RestController
@RequestMapping("/api")
public class ExamsResource {

    private final Logger log = LoggerFactory.getLogger(ExamsResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementExams";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExamsService examsService;

    private final ExamsRepository examsRepository;

    private final LecturerService lecturerService;

    private  final UserService userService;

    private  final StudentService studentService;

    private  final QuestionsService questionsService;

    private final CourseRepository courseRepository;

    private final CourseService courseService;

//    private static List<Questions> lstQuestionImportExcel= new ArrayList<>();
    private final KafkaSendNotification kafkaSendNotification;

    public ExamsResource(ExamsService examsService,
                         ExamsRepository examsRepository,
                         LecturerService lecturerService,
                         UserService userService,
                         StudentService studentService,
                         QuestionsService questionsService,
                         CourseRepository courseRepository,
                         CourseService courseService,
                         KafkaSendNotification kafkaSendNotification) {
        this.examsService = examsService;
        this.questionsService = questionsService;
        this.examsRepository = examsRepository;
        this.lecturerService = lecturerService;
        this.userService = userService;
        this.studentService = studentService;
        this.courseRepository = courseRepository;
        this.courseService = courseService;
        this.kafkaSendNotification = kafkaSendNotification;
    }

    /**
     * {@code POST  /exams} : Create a new exams.
     *
     * @param exams the exams to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exams, or with status {@code 400 (Bad Request)} if the exams has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exams")
    public ResponseEntity<Exams> createExams(@RequestBody Exams exams, Principal principal) throws URISyntaxException {
        log.debug("REST request to save Exams : {}", exams);
        if (exams.getId() != null) {
            throw new BadRequestAlertException("A new exams cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userId = userService.getUserID(principal);
         if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        vailidate(exams);
        // check neu la ba thi trac nghiem thi tu dong them diem
        if(exams.getTypeOfExams().getId() !=null  && exams.getTypeOfExams().getId() == 1){
            addPoints(exams);
        }
        Exams result = examsService.save(exams);
        kafkaSendNotification.alertExams(result, principal);
        return ResponseEntity
            .created(new URI("/api/exams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /exams/:id} : Updates an existing exams.
     *
     * @param id the id of the exams to save.
     * @param exams the exams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exams,
     * or with status {@code 400 (Bad Request)} if the exams is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exams/{id}")
    public ResponseEntity<Exams> updateExams(@PathVariable(value = "id", required = false) final Long id,
                                             @RequestBody Exams exams,
                                             Principal principal)
        throws URISyntaxException {
        log.debug("REST request to update Exams : {}, {}", id, exams);
        if (exams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        if(exams.getTypeOfExams().getId() !=null  && exams.getTypeOfExams().getId() == 1){
            addPoints(exams);
        }

        Exams result = examsService.save(exams);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exams.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /exams/:id} : Partial updates given fields of an existing exams, field will ignore if it is null
     *
     * @param id the id of the exams to save.
     * @param exams the exams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exams,
     * or with status {@code 400 (Bad Request)} if the exams is not valid,
     * or with status {@code 404 (Not Found)} if the exams is not found,
     * or with status {@code 500 (Internal Server Error)} if the exams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Exams> partialUpdateExams(@PathVariable(value = "id", required = false) final Long id, @RequestBody Exams exams)
        throws URISyntaxException {
        log.debug("REST request to partial update Exams partially : {}, {}", id, exams);
        if (exams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Exams> result = examsService.partialUpdate(exams);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exams.getId().toString())
        );
    }

    /**
     * {@code GET  /exams} : get all the exams.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exams in body.
     */
    @GetMapping("/exams")
    public ResponseEntity<List<Exams>> getAllExams(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Exams");


        Page<Exams> page = examsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /exams/:id} : get the "id" exams.
     *
     * @param id the id of the exams to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exams, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exams/{id}")
    public ResponseEntity<Exams> getExams(@PathVariable Long id,Principal principal) throws JsonProcessingException {
        log.debug("REST request to get Exams : {}", id);
        String userId = userService.getUserID(principal);
        Exams examsTest = examsRepository.findOneById(id);
        if(studentService.checkIsStudent(userId)){
            if(examsService.checkTimePassExams(id)){
                if(examsService.checkStudentPassedExams(id, userId)){
                    // hoc sinh chua thi
                    Set<Questions> questions = questionsService.findAllbyExamId(examsTest.getId());
                    examsTest.setQuestions(questions);
                    if(examsTest.getTypeOfExams().getId() == 1){
                        processAnswers(examsTest.getQuestions());
                    }
                }else{
                    Set<Questions> questions = new HashSet<>();
                    examsTest.setQuestions(questions);
                }
            }else{
                Set<Questions> questions = new HashSet<>();
                examsTest.setQuestions(questions);
            }

        }else{
            Set<Questions> questions = questionsService.findAllbyExamId(examsTest.getId());
            examsTest.setQuestions(questions);
        }
        Course course = courseService.findOneByExamsId(examsTest.getId());
        examsTest.setCourse(course);
        return ResponseEntity.ok(examsTest);
    }

    @GetMapping("/exams/beforePass/{id}")
    public ResponseEntity<Exams> getExamsBeforePass(@PathVariable Long id,Principal principal) throws JsonProcessingException {
        log.debug("REST request to get Exams : {}", id);

        String userId = userService.getUserID(principal);
        Exams examsTest = examsRepository.findOneById(id);
        if(examsService.checkStudentPassedExams(id, userId)){
            examsTest.setExamStatus("0");
        }else{
            examsTest.setExamStatus("1");
        }
        examsTest.setQuestions(null);
        Course course = courseService.findOneByExamsId(examsTest.getId());
        examsTest.setCourse(course);
        return ResponseEntity.ok(examsTest);
    }


    /**
     * {@code DELETE  /exams/:id} : delete the "id" exams.
     *
     * @param id the id of the exams to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> deleteExams(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete Exams : {}", id);
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        examsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/exams?query=:query} : search for the exams corresponding
     * to the query.
     *
     * @param query the query of the exams search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/exams")
    public ResponseEntity<List<Exams>> searchExams(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Exams for query {}", query);
        Page<Exams> page = examsService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/exams/course/{id}")
    public ResponseEntity<Page<Exams>> getAllExamsOfCourse(@PathVariable Long id,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get all Exams Of Course");
        List<Exams> lstExams = examsService.findAllByCourseId(id, pageable);
        Long total = examsService.getTotalByCourseId(id);
        Page<Exams> pages = new PageImpl<Exams>(lstExams, pageable, total);
        return ResponseEntity.ok(pages);
    }

    @GetMapping("/exams/course")
    public ResponseEntity<List<Exams>> searchAllExamsByCourseAndExamsName(@RequestParam Long courseId,
                                                           @RequestParam String query,
                                                           @org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to searchAllExamsByCourseAndExamsName");
        List<Exams> lstExams = examsService.searchAllByCourseIdAndExamsName(courseId, query);
        return ResponseEntity.ok(lstExams);
    }

    @DeleteMapping("/exams/deletes")
    public ResponseEntity<?> deleteMultiByIds(@RequestParam String ids , Principal principal){
        log.debug("REST request to deleteMultiByIds");
        String userId = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userId)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        examsService.deleteMultiByIds(ids);
        return ResponseEntity.ok(HttpStatus.OK);
    }



//    @PostMapping("/exams/uploadFile")
//    public List<Questions> uploadExcel(@RequestParam("file")MultipartFile file) throws IOException {
//        lstQuestionImportExcel.removeAll(lstQuestionImportExcel);
//        XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
//        XSSFSheet worksheet = workbook.getSheetAt(0);
//        List<Questions> lstQuestions = new ArrayList<>();
//        for (int i = 0; i < worksheet.getPhysicalNumberOfRows(); i++) {
//            if (i > 1) {
//                Questions questions = new Questions();
//                List<Answers> lstAnswers= new ArrayList<>();
//                List<Integer> lstIndexStatus= new ArrayList<>();
//                XSSFRow row = worksheet.getRow(i);
//                for(int j=0;j<row.getPhysicalNumberOfCells();j++){
//                    switch(j) {
//                        case 0:
//                            questions.setQuestionsName(row.getCell(j).getStringCellValue());
//                            break;
//                        case 1:{
//                            String[] lstStatus = row.getCell(j).getStringCellValue().split(",");
//                            lstIndexStatus= getStatusAnswers(lstStatus);
//                            break;
//                        }
//                        default:{
//                            Answers answers = new Answers();
//                            answers.setAnswersName(row.getCell(j).getStringCellValue());
//                            if(lstIndexStatus.contains(j)){
//                                answers.setAnswersStatus("1");
//                            }else{
//                                answers.setAnswersStatus("0");
//                            }
//                            lstAnswers.add(answers);
//                            break;
//                        }
//                    }
//                }
//                Set<Answers> setAnswer = new HashSet<>(lstAnswers);
//                questions.setAnswers(setAnswer);
//                lstQuestions.add(questions);
//            }
//
//        }
//        System.out.println("test");
//        lstQuestionImportExcel.addAll(lstQuestions);
//        return  lstQuestions;
//    }
    public List<Integer> getStatusAnswers(String[] lstStatus){
        List<Integer> lstIndexStatus = new ArrayList<>();
        for(int i =0; i< lstStatus.length;i++){
            int index=0;
            switch(lstStatus[i]) {
                case "A": {
                    index = 2;
                    lstIndexStatus.add(index);
                    break;
                }
                case "B":{
                    index= 3;
                    lstIndexStatus.add(index);
                    break;
                }
                case "C":{
                    index= 4;
                    lstIndexStatus.add(index);
                    break;
                }
                case "D":{
                    index= 5;
                    lstIndexStatus.add(index);
                    break;
                }
                case "E":{
                    index= 6;
                    lstIndexStatus.add(index);
                    break;
                }
                case "F":{
                    index= 7;
                    lstIndexStatus.add(index);
                    break;
                }
                default:{

                    break;
                }
            }
        }
        return  lstIndexStatus;
    }

    public void addPoints ( Exams exams){
        double questionPoint=  (double) 100/ (double) exams.getQuestions().size();
        questionPoint= (double) Math.round(questionPoint * 100) / (double) 100;
        for(Questions questions : exams.getQuestions()){
            questions.setQuestionsPoint(String.valueOf(questionPoint));
            int countStatus = 0;
            for(Answers answers : questions.getAnswers()){
                if(answers.getAnswersStatus()!=null && answers.getAnswersStatus().equals("1")){
                    countStatus++;
                }
            }
            double answersPoint = (double) questionPoint/ (double) countStatus;
            answersPoint= (double) Math.round(answersPoint * 100) / (double) 100;
            for(Answers answers: questions.getAnswers()){
                if(answers.getAnswersStatus()!=null && answers.getAnswersStatus().equals("1")){
                    answers.setAnswersPoint(String.valueOf(answersPoint));
                }else{
                    answers.setAnswersPoint("0");
                }
            }
        }
    }

    public void processAnswers(Set<Questions>  questionsSet){
        for(Questions questions :questionsSet){
            for(Answers answers: questions.getAnswers()){
                answers.setAnswersStatus(null);
                answers.setAnswersPoint(null);
            }
        }
    }

    public void vailidate(Exams exams)  {

        int compareDate = exams.getExamOpenTime().compareTo(exams.getExamCloseTime());

        if (compareDate == 0){
            // thời gian bắt dầu = tgian két thúc
            throw new BadRequestAlertException("Exams close time equal open time", ENTITY_NAME, "Exams close time equal open time");
        } else{
            if(compareDate > 0){
                // thời gian kết thúc sớm hơn tgian bắt đầu
                throw new BadRequestAlertException("Exams close time before open time", ENTITY_NAME, "Exams close time before open time");
            }
        }

        if(exams.getExamLimittedWorkingTime() == null || exams.getExamLimittedWorkingTime().equals("0")) {
            throw new BadRequestAlertException("Exam limitted working time is null", ENTITY_NAME, "Exam limitted working time is null");
        } else{
            long limitTime = Long.valueOf(exams.getExamLimittedWorkingTime());
            if(limitTime == 0){
                throw new BadRequestAlertException("Exam limitted working time invalid", ENTITY_NAME, "Exam limitted working time invalid");
            } else{
                long difference_In_Time
                    = exams.getExamCloseTime().getTime() - exams.getExamOpenTime().getTime();
                long difference_In_Minutes
                    = (difference_In_Time
                    / (1000 * 60));

                if(limitTime > difference_In_Minutes){
                    throw new BadRequestAlertException("Exam limitted working time invalid", ENTITY_NAME, "Exam limitted working time invalid");
                }
            }
        }


        if (exams.getQuestions() == null || exams.getQuestions().size() == 0){
            throw new BadRequestAlertException("Question is null", ENTITY_NAME, "question is null");
        } else {
            exams.getQuestions().forEach(p->{
                if(p.getQuestionsName() == null ||  p.getQuestionsName().equals("")){
                    if(p.getQuestionsFile() == null || p.getQuestionsFile().equals("")){
                        throw new BadRequestAlertException("Question is null", ENTITY_NAME, "question is null");
                    }
                }
            });
            if (exams.getTypeOfExams().getId() == 1){
                for(Questions questions : exams.getQuestions()){
                    if(questions.getAnswers() == null || questions.getAnswers().size() == 0){
                        throw new BadRequestAlertException("Answers is null", ENTITY_NAME, "answers is null");
                    }
                }
            }
        }
    }

}
