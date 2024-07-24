package com.aladin.web.rest;

import com.aladin.domain.*;
import com.aladin.repository.CourseRepository;
import com.aladin.repository.CourseStudentRepository;
import com.aladin.service.CourseService;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.dto.CourseDepartmentDTO;
import com.aladin.service.dto.CourseOnlyDTO;
import com.aladin.service.dto.CoursePercentDTO;
import com.aladin.service.dto.CoursesDTO;
import com.aladin.service.util.AuthenticateUltil;
import com.aladin.web.rest.errors.BadRequestAlertException;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.StreamSupport;
import javax.mail.Header;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Parameter;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.Course}.
 */
@RestController
@RequestMapping("/api")
public class CourseResource {

    private final Logger log = LoggerFactory.getLogger(CourseResource.class);

    private static final String ENTITY_NAME = "lmsBackendCourse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseService courseService;

    private final CourseRepository courseRepository;

    private final UserService userService;

    private final CourseStudentRepository courseStudentRepository;

    private final LecturerService lecturerService;

    private final StudentService studentService;

    public CourseResource(CourseService courseService, CourseRepository courseRepository, UserService userService, CourseStudentRepository courseStudentRepository, LecturerService lecturerService, StudentService studentService) {
        this.courseService = courseService;
        this.courseRepository = courseRepository;
        this.userService = userService;
        this.courseStudentRepository = courseStudentRepository;
        this.lecturerService = lecturerService;
        this.studentService = studentService;
    }

    /**
     * {@code POST  /courses} : Create a new course.
     *
     * @param course the course to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new course, or with status {@code 400 (Bad Request)} if the course has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course, Principal principal) throws URISyntaxException {
        log.debug("REST request to save Course : {}", course);
        if (course.getId() != null) {
            throw new BadRequestAlertException("A new course cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        log.info("user_id: " + userid);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        User user = userService.getUserByID(userid);
        Course result = courseService.save(course, user);
        return ResponseEntity
            .created(new URI("/api/courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /courses/:id} : Updates an existing course.
     *
     * @param id     the id of the course to save.
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/courses/{id}")
    public ResponseEntity<Course> updateCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Course course, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update Course : {}, {}", id, course);

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, course.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        User user = userService.getUserByID(userid);
        Course result = courseService.save(course, user);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /courses/:id} : Partial updates given fields of an existing course, field will ignore if it is null
     *
     * @param id     the id of the course to save.
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 404 (Not Found)} if the course is not found,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/courses/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<Course> partialUpdateCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Course course, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Course partially : {}, {}", id, course);
        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, course.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        Optional<Course> result = courseService.partialUpdate(course);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString())
        );
    }

    /**
     * {@code GET  /courses} : get all the courses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("/courses")
    public ResponseEntity<Page<Course>> getAllCourses(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of Courses");
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<Course> page = courseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /courses/:id} : get the "id" course.
     *
     * @param id the id of the course to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the course, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get Course : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        User user = userService.getUserByID(userid);
        Optional<Course> course = courseService.findOne(id, user);
        return ResponseUtil.wrapOrNotFound(course);
    }

    /**
     * {@code DELETE  /courses/:id} : delete the "id" course.
     *
     * @param id the id of the course to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete Course : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        courseService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/courses?query=:query} : search for the course corresponding
     * to the query.
     *
     * @param query    the query of the course search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/courses")
    public ResponseEntity<Page<CoursesDTO>> searchCourses(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of Courses for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }

        Page<CoursesDTO> page = courseService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/courses/getByCurrentStudent")
    public ResponseEntity<Page<CoursePercentDTO>> getAllCoursesByStudent(Pageable pageable, Principal principal) {
        log.debug("REST request to get getAllCoursesByStudent");
        String user_id = userService.getUserID(principal);
        Student student = studentService.getStudentById(user_id);
        if (!studentService.checkIsStudent(user_id)) {
            throw new BadRequestAlertException("OnlyStudent", ENTITY_NAME, "OnlyStudent");
        }
        if (student == null || student.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        } else {
            Page<CoursePercentDTO> page = courseService.getAllCourseByCurrentStudent(student.getId(), pageable);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page);
        }
    }

    @GetMapping("/courses/getByDepartment/{id}")
    public ResponseEntity<Page<Course>> getAllCoursesByDepartment(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getAllCoursesByDepartment : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Page<Course> page = courseService.getAllCourseByDepartment(id, pageable);
        log.info(page.getTotalElements() + "");
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }
    @GetMapping("/courses/getByDepartmentAndName/{id}")
    public ResponseEntity<Page<Course>> getCourseByDepartmentAndName(@PathVariable(value = "id") Long id, @RequestParam(value ="name") String name, Pageable pageable, Principal principal) {
        log.debug("REST request to get getCourseByDepartmentAndName : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Page<Course> page = courseService.getCourseByDepartmentAndName(id,"%"+name.trim().toLowerCase()+"%", pageable);
        log.info(page.getTotalElements() + "");
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/courses/getByLecturer/{id}")
    public ResponseEntity<Page<Course>> getAllCoursesByLecturer(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getAllCoursesByLecturer : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }
        Page<Course> page = courseService.getAllCourseByLecturer(id, pageable);
        log.info(page.getTotalElements() + "");
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @GetMapping("/coursesByLecturersId")
    public ResponseEntity<Page<CourseOnlyDTO>> getAllCoursesByLectureId(Pageable pageable, Principal principal) {
        log.debug("REST request to getAllCoursesByLectureId : {}");

        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        Lecturer lecturer = lecturerService.getLecturerByUser(getIdUser);

        String userid = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userid) ){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"OnlyLecturer");
        }
        Page<CourseOnlyDTO> page = courseService.getCoursesByLectureId(lecturer.getId(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/courses/getDetailByDepartment/{id}")
    public ResponseEntity<Page<CourseDepartmentDTO>> getCourseDetailByDepartment(@PathVariable("id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to getCourseDetailByDepartment : {}");
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<CourseDepartmentDTO> page = courseService.getCourseDetailByDepartment(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/courses/getDetailByDepartmentAndName/{id}")
    public ResponseEntity<Page<CourseDepartmentDTO>> getCourseDetailByDepartmentAndName(@PathVariable("id") Long id,
                                                                                        @RequestParam(value = "name") String name, Pageable pageable, Principal principal) {
        log.debug("REST request to getCourseDetailByDepartmentAndName : {}");
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<CourseDepartmentDTO> page = courseService.getCourseDetailByDepartmentAndName(id, name, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/courses/coursesByLecturersAndName")
    public ResponseEntity<Page<CourseOnlyDTO>> getCoursesByLectureIdAndCourseName(@RequestParam(value = "course_name") String course_name, Pageable pageable, Principal principal) {
        log.debug("REST request to getCoursesByLectureIdAndCourseName : {}");

        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        Lecturer lecturer = lecturerService.getLecturerByUser(getIdUser);

        String user_id = userService.getUserID(principal);

        if (!lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME, "onlyLecturer");
        }

        Page<CourseOnlyDTO> page = courseService.getCoursesByLectureIdAndCourseName(lecturer.getId(), course_name, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @PostMapping("/delete_more_course")
    public void deleteWhereIdIn(@RequestParam String id, Principal principal) {
        log.debug("request to deleteWhereIdIn with id: " + id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        courseService.deleteAnswerWhereIdIn(id);
    }

    @GetMapping("/coursesByLecturersIdAllField")
    public ResponseEntity<Page<CourseOnlyDTO>> getAllCoursesByLectureId(Pageable pageable,
                                                                        @RequestParam("query") String param) {
        log.debug("REST request to getAllCoursesByLectureId : {}");

        String login_info= AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser=courseStudentRepository.getIdUser(login_info);
        Lecturer lecturer=lecturerService.getLecturerByUser(getIdUser);
        Page<CourseOnlyDTO> page = null;
        SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        Long courseId =-1L;
        String newstring = null;
        LocalDate localDate = null;
        try{
            date = dt.parse(param);
            localDate = LocalDate.parse(param);
        }
        catch (ParseException p){
            try {
                courseId = Long.valueOf(param);
            }
            catch (NumberFormatException e){
                courseId = -1L;
            }
        }
        page=courseService.getCoursesByLectureIdAllField(lecturer.getId(),courseId,"%"+param+"%",localDate, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }
}
