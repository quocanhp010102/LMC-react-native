package com.aladin.web.rest;

import com.aladin.domain.*;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.CourseStudentRepository;
import com.aladin.repository.StudentRepository;
import com.aladin.service.*;
import com.aladin.service.dto.CourseLectureDTO;
import com.aladin.service.dto.CourseManagerDTO;
import com.aladin.service.dto.CoursePercentDTO;
import com.aladin.service.util.AuthenticateUltil;
import com.aladin.web.rest.errors.BadRequestAlertException;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.QueryParam;

import io.swagger.v3.oas.annotations.Parameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.CourseStudent}.
 */
@RestController
@RequestMapping("/api")
public class CourseStudentResource {

    private final Logger log = LoggerFactory.getLogger(CourseStudentResource.class);

    private static final String ENTITY_NAME = "lmsBackendCourseStudent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseStudentService courseStudentService;

    private final CourseStudentRepository courseStudentRepository;

    private final StudentRepository studentRepository;

    private final UserService userService;

    private final StudentService studentService;

    private final LecturerService lecturerService;

    private KafkaSendNotification kafkaSendNotification;

    private final StudentLessonService studentLessonService;

    private final LessonService lessonService;

    public CourseStudentResource(CourseStudentService courseStudentService, CourseStudentRepository courseStudentRepository,
                                 StudentRepository studentRepository, UserService userService, StudentService studentService, LecturerService lecturerService,
                                 KafkaSendNotification kafkaSendNotification, StudentLessonService studentLessonService, LessonService lessonService) {
        this.courseStudentService = courseStudentService;
        this.courseStudentRepository = courseStudentRepository;
        this.studentRepository = studentRepository;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
        this.kafkaSendNotification = kafkaSendNotification;
        this.studentLessonService = studentLessonService;
        this.lessonService = lessonService;
    }

    /**
     * {@code POST  /course-students} : Create a new courseStudent.
     *
     * @param courseStudent the courseStudent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courseStudent, or with status {@code 400 (Bad Request)} if the courseStudent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/course-students")
    public ResponseEntity<CourseStudent> createCourseStudent(@Valid @RequestBody CourseStudent courseStudent, Principal principal) throws URISyntaxException {
        log.debug("REST request to save CourseStudent : {}", courseStudent);
        if (courseStudent.getId() != null) {
            throw new BadRequestAlertException("A new courseStudent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        if (courseStudentService.checkExistCourseStudent(courseStudent.getCourse().getId(), courseStudent.getStudent().getId())) {
            throw new BadRequestAlertException("CourseStudentExist", ENTITY_NAME, "CourseStudentExist");
        }
        CourseStudent result = courseStudentService.save(courseStudent);

        List<Lesson> list=lessonService.getAllLessonByCourseId(courseStudent.getCourse().getId());
        System.out.println(list);
        for (int i=0;i<list.size();i++){
            if (studentLessonService.countStudentInStudentLesson(courseStudent.getStudent().getId(),list.get(i).getId())!=0){
                continue;
            }else{
                //insert into studentLesson
                StudentLesson studentLesson=new StudentLesson();
                studentLesson.setLesson(list.get(i));
                studentLesson.setPercent(0.0F);
                studentLesson.setIsDone("0");
                Student student=studentService.getStudentByStudentID(courseStudent.getStudent().getId());
                log.debug("studentID: "+student.getId());
                log.info("student insert lesson: "+student);
                studentLesson.setStudent(student);

                studentLessonService.save(studentLesson);
            }
        }
        courseStudentService.updateStudentInCourse(courseStudent.getCourse().getId());
        return ResponseEntity
            .created(new URI("/api/course-students/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /course-students/:id} : Updates an existing courseStudent.
     *
     * @param id            the id of the courseStudent to save.
     * @param courseStudent the courseStudent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseStudent,
     * or with status {@code 400 (Bad Request)} if the courseStudent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courseStudent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/course-students/{id}")
    public ResponseEntity<CourseStudent> updateCourseStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CourseStudent courseStudent, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update CourseStudent : {}, {}", id, courseStudent);
        if (courseStudent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseStudent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseStudentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        CourseStudent result = courseStudentService.save(courseStudent);
        courseStudentService.updateStudentInCourse(courseStudent.getCourse().getId());
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseStudent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /course-students/:id} : Partial updates given fields of an existing courseStudent, field will ignore if it is null
     *
     * @param id            the id of the courseStudent to save.
     * @param courseStudent the courseStudent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseStudent,
     * or with status {@code 400 (Bad Request)} if the courseStudent is not valid,
     * or with status {@code 404 (Not Found)} if the courseStudent is not found,
     * or with status {@code 500 (Internal Server Error)} if the courseStudent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/course-students/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<CourseStudent> partialUpdateCourseStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CourseStudent courseStudent, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update CourseStudent partially : {}, {}", id, courseStudent);
        if (courseStudent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseStudent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseStudentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        Optional<CourseStudent> result = courseStudentService.partialUpdate(courseStudent);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseStudent.getId().toString())
        );
    }

    /**
     * {@code GET  /course-students} : get all the courseStudents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courseStudents in body.
     */
    @GetMapping("/course-students")
    public ResponseEntity<Page<CourseStudent>> getAllCourseStudents(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of CourseStudents");

        String userid = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        Page<CourseStudent> page = courseStudentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/course-students-percent")
    public ResponseEntity<Page<CoursePercentDTO>> getAllCourseStudentDTO(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of CourseStudents");

        String user_id = userService.getUserID(principal);
        if (!studentService.checkIsStudent(user_id)) {
            throw new BadRequestAlertException("OnlyStudent", ENTITY_NAME, "OnlyStudent");
        }

        Page<CoursePercentDTO> page = courseStudentService.getCourseStudentPercent(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/course-lecture")
    public ResponseEntity<Page<CourseLectureDTO>> getAllCourseLecture(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of CourseStudents");

        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        Page<CourseLectureDTO> page = courseStudentService.getCourseLecture(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @GetMapping("/course-students-courseId/{id}")
    public ResponseEntity<Page<CourseStudent>> getCourseStudentByCourseId(@PathVariable Long id, @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        String user_id = userService.getUserID(principal);

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<CourseStudent> courseStudentList = courseStudentService.getCourseStudentByCourseId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), courseStudentList);
        return ResponseEntity.ok().headers(headers).body(courseStudentList);
    }


    @GetMapping("/course-students-courseId/{courseId}/{studentId}")
    public float percentComplete(@PathVariable Long courseId, @PathVariable Long studentId, Principal principal) {

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        return courseStudentService.percentComplete(courseId, studentId);
    }


    @GetMapping("/course-manager/{courseId}")
    public ResponseEntity<Page<CourseManagerDTO>> getCourseManager(@org.springdoc.api.annotations.ParameterObject Pageable pageable, @PathVariable Long courseId, Principal principal) {
        log.debug("REST request to get a page of CourseStudents");
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        Page<CourseManagerDTO> page = courseStudentService.getCourseManager(pageable, courseId);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/course-manager/searchByStudentName/{courseId}")
    public ResponseEntity<Page<CourseManagerDTO>> searchCourseManagerByName(@org.springdoc.api.annotations.ParameterObject Pageable pageable,
                                                                            @PathVariable Long courseId, Principal principal, @RequestParam(value = "studentName") String studentName) {
        log.debug("REST request to get a page of searchCourseManagerByName");
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        Page<CourseManagerDTO> page = courseStudentService.searchCourseManagerByName(pageable, courseId, "%" + studentName + "%");
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    /**
     * {@code GET  /course-students/:id} : get the "id" courseStudent.
     *
     * @param id the id of the courseStudent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courseStudent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/course-students/{id}")
    public ResponseEntity<CourseStudent> getCourseStudent(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get CourseStudent : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Optional<CourseStudent> courseStudent = courseStudentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(courseStudent);
    }

    /**
     * {@code DELETE  /course-students/:id} : delete the "id" courseStudent.
     *
     * @param id the id of the courseStudent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/course-students/{id}")
    public ResponseEntity<Void> deleteCourseStudent(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete CourseStudent : {}", id);

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        courseStudentService.delete(id);
        CourseStudent courseStudent = courseStudentService.findOne(id).get();
        courseStudentService.updateStudentInCourse(courseStudent.getCourse().getId());
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/course-students?query=:query} : search for the courseStudent corresponding
     * to the query.
     *
     * @param query    the query of the courseStudent search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/course-students")
    public ResponseEntity<Page<CourseStudent>> searchCourseStudents(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of CourseStudents for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<CourseStudent> page = courseStudentService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @GetMapping("/course-students/getByStudent")
    public ResponseEntity<Page<CourseStudent>> getCourseByStudent(Pageable pageable, Principal principal) {

        String user_id = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        Student student = studentRepository.getStudentByUser(user_id);
        log.debug("REST request to get getCourseByStudent : {}", student.getId());
        if (null == student.getId()) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }

        Page<CourseStudent> page = courseStudentService.getCourseByStudent(String.valueOf(student.getId()), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/course-students/getByCourse/{id}")
    public ResponseEntity<Page<CourseStudent>> getStudentByCourse(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getLessonByCourse : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<CourseStudent> page = courseStudentService.getStudentByCourse(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @DeleteMapping("/course-students/deleteStudent/{course_id}")
    public ResponseEntity deleteStudentFromCourses(@PathVariable(value = "course_id") Long course_id,
                                                   @RequestBody Long[] student, Principal principal) {
        log.debug("REST request to delete CourseStudent : {}", course_id);
        if (null == course_id) {
            throw new BadRequestAlertException("Invalid course_id", ENTITY_NAME, "course_id null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        List<Lesson> list=lessonService.getAllLessonByCourseId(course_id);
        for (Long detail : student) {
            log.warn("st to deatil: " + detail);
            courseStudentService.deleteStudentFromCourse(course_id, detail);
            courseStudentService.updateStudentInCourse(course_id);

            for (int i=0;i<list.size();i++){
                courseStudentService.deleteStudentLessonByStudentIdAndCourseId(detail,list.get(i).getId());
            }
        }
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, course_id.toString()))
            .build();
    }

    @PostMapping("/course-students/insertStudent/{course_id}")
    public ResponseEntity insertStudentFromCourses(@PathVariable(value = "course_id") Long course_id,
                                                   @RequestBody Long[] student, Principal principal) throws URISyntaxException {
        log.debug("REST request to insert CourseStudent : {}", course_id);
        if (null == course_id) {
            throw new BadRequestAlertException("Invalid course_id", ENTITY_NAME, "course_id null");
        }

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        for (Long detail : student) {
            log.warn("st to detail: " + detail);
            CourseStudent courseStudent = new CourseStudent();

            Course course = new Course();
            course.setId(course_id);
            courseStudent.setCourse(course);

            Student st = new Student();
            st.setId(detail);
            courseStudent.setStudent(st);
            courseStudent.setCourse_percent(0.0F);

            if (!courseStudentService.checkExistCourseStudent(courseStudent.getCourse().getId(), courseStudent.getStudent().getId())) {
                courseStudent = courseStudentService.save(courseStudent);
                courseStudentService.updateStudentInCourse(courseStudent.getCourse().getId());
            }
            kafkaSendNotification.courseStudentAlert(courseStudent, userid);
        }
        return ResponseEntity
            .created(new URI("/api/course-students/" + course_id))
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, course_id.toString()))
            .build();
    }

    @GetMapping("/course-students/searchCourseByCurrentUser")
    public ResponseEntity<Page<CoursePercentDTO>> searchCourseStudentPercentDTO(@org.springdoc.api.annotations.ParameterObject Pageable pageable,
                                                                                Principal principal, @RequestParam(value = "param") String param) {
        log.debug("REST request to get a page of searchCourseStudentPercentDTO");

        String user_id = userService.getUserID(principal);
        if (!studentService.checkIsStudent(user_id)) {
            throw new BadRequestAlertException("OnlyStudent", ENTITY_NAME, "OnlyStudent");
        }
        Page<CoursePercentDTO> page = courseStudentService.searchCourseStudentPercentDTO(user_id, "%" + param + "%", pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @GetMapping("/course-lecture-history")
    public List<CourseLectureDTO> getAllCourseLectureHistory(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of CourseStudents");
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }

        List<CourseLectureDTO> list = new ArrayList<>();
        CourseLectureDTO courseLectureDTO;

        List<Object[]> listObject = courseStudentService.getCourseLectureHistory();
        for (Object[] object : listObject) {
            courseLectureDTO = new CourseLectureDTO();
            courseLectureDTO.setCourseId(Long.valueOf(object[0].toString()));
            courseLectureDTO.setCourseName(String.valueOf(object[1].toString()));
            courseLectureDTO.setCourseImage(String.valueOf(object[2].toString()));
            list.add(courseLectureDTO);
        }
        return list;
    }

    @GetMapping("/course-students-percent-history")
    public List<CoursePercentDTO> getAllCourseStudentHistoryDTO(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of CourseStudents");

        String user_id = userService.getUserID(principal);

        if (!studentService.checkIsStudent(user_id)) {
            throw new BadRequestAlertException("OnlyStudent", ENTITY_NAME, "OnlyStudent");
        }
        Student student = studentService.getStudentById(user_id);
        List<Object[]> listObject = courseStudentService.getCourseStudentPercentHistory(student.getId());
        List<CoursePercentDTO> list = new ArrayList<>();
        CoursePercentDTO coursePercentDTO;

        for (Object[] object : listObject) {
            coursePercentDTO = new CoursePercentDTO();
            coursePercentDTO.setCourseId(Long.valueOf(object[0].toString()));
            coursePercentDTO.setCourseName(String.valueOf(object[1].toString()));
            coursePercentDTO.setCourseImage(String.valueOf(object[3].toString()));
            coursePercentDTO.setPercent(Float.valueOf(object[2].toString()));
            list.add(coursePercentDTO);
        }

        return list;
    }


}
