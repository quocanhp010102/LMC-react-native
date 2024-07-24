package com.aladin.web.rest;

import com.aladin.domain.Student;
import com.aladin.repository.CourseStudentRepository;
import com.aladin.repository.StudentRepository;
import com.aladin.service.ClassroomStudentService;
import com.aladin.service.StudentLessonService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.dto.*;
import com.aladin.service.util.AuthenticateUltil;
import com.aladin.web.rest.errors.BadRequestAlertException;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

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
 * REST controller for managing {@link com.aladin.domain.Student}.
 */
@RestController
@RequestMapping("/api")
public class StudentResource {

    private final Logger log = LoggerFactory.getLogger(StudentResource.class);

    private static final String ENTITY_NAME = "lmsBackendStudent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentService studentService;

    private final StudentRepository studentRepository;
    private final UserService userService;

    private final ClassroomStudentService classroomStudentService;

    private final StudentLessonService studentLessonService;

    private final CourseStudentRepository courseStudentRepository;

    public StudentResource(StudentService studentService, StudentRepository studentRepository, UserService userService, ClassroomStudentService classroomStudentService, StudentLessonService studentLessonService, CourseStudentRepository courseStudentRepository) {
        this.studentService = studentService;
        this.studentRepository = studentRepository;
        this.userService = userService;
        this.classroomStudentService = classroomStudentService;
        this.studentLessonService = studentLessonService;
        this.courseStudentRepository = courseStudentRepository;
    }

    /**
     * {@code POST  /students} : Create a new student.
     *
     * @param student the student to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new student, or with status {@code 400 (Bad Request)} if the student has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) throws URISyntaxException {
        log.debug("REST request to save Student : {}", student);
        if (student.getId() != null) {
            throw new BadRequestAlertException("A new student cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Student result = studentService.save(student);
        return ResponseEntity
            .created(new URI("/api/students/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /students/:id} : Updates an existing student.
     *
     * @param id      the id of the student to save.
     * @param student the student to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated student,
     * or with status {@code 400 (Bad Request)} if the student is not valid,
     * or with status {@code 500 (Internal Server Error)} if the student couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Student student, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update Student : {}, {}", id, student);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("Only Admin", ENTITY_NAME, "idnull");
        }
        if (student.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, student.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!studentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Student result = studentService.save(student);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, student.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /students/:id} : Partial updates given fields of an existing student, field will ignore if it is null
     *
     * @param id      the id of the student to save.
     * @param student the student to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated student,
     * or with status {@code 400 (Bad Request)} if the student is not valid,
     * or with status {@code 404 (Not Found)} if the student is not found,
     * or with status {@code 500 (Internal Server Error)} if the student couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/students/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<Student> partialUpdateStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Student student
    ) throws URISyntaxException {
        log.debug("REST request to partial update Student partially : {}, {}", id, student);
        if (student.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, student.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!studentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Optional<Student> result = studentService.partialUpdate(student);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, student.getId().toString())
        );
    }

    /**
     * {@code GET  /students} : get all the students.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of students in body.
     */
    @GetMapping("/students")
    public ResponseEntity<Page<Student>> getAllStudents(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Students");
        Page<Student> page = studentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /students/:id} : get the "id" student.
     *
     * @param id the id of the student to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the student, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        log.debug("REST request to get Student : {}", id);
        Optional<Student> student = studentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(student);
    }

    /**
     * {@code DELETE  /students/:id} : delete the "id" student.
     *
     * @param id the id of the student to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        log.debug("REST request to delete Student : {}", id);
        studentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/students?query=:query} : search for the student corresponding
     * to the query.
     *
     * @param query    the query of the student search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/students")
    public ResponseEntity<Page<StudentDTO>> searchStudents(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Students for query {}", query);
        Page<StudentDTO> page = studentService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getByCourse/{id}")
    public ResponseEntity<Page<Student>> getStudentByCourse(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getStudentByCourse : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Page<Student> page = studentService.getAllStudentByCourse(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


    @GetMapping("/students/myself")
    public ResponseEntity<Student> getInforByMySelf(Principal principal) throws URISyntaxException {
        log.debug("REST request to getInforByMySelf");
        String userid = userService.getUserID(principal);
        log.info("user_id: " + userid);
        Student student = studentRepository.getStudentByUser(userid);
        if (student == null) {
            return ResponseEntity.badRequest().body(student);
        }
        log.warn(student.toString());
        return ResponseEntity
            .created(new URI("/students/myself" + student.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, student.getId().toString()))
            .body(student);
    }

    @GetMapping("/students/getAllStudentCourse/{id}")
    public ResponseEntity<Map<String, Object>> getStudentByCourseId(
        @PathVariable("id") Long courseId,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {

        List<StudentLessonDto> list = studentLessonService.getStudentByCourseId(pageable, courseId);
        Integer totalPage = 0;
        Integer totalElement = studentLessonService.total(courseId);
        if (totalElement % pageable.getPageSize() == 0) {
            totalPage = totalElement / pageable.getPageSize();
        } else {
            totalPage = totalElement / pageable.getPageSize() + 1;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("content", list);
        map.put("totalPage", totalPage);
        return ResponseEntity.ok().body(map);
    }

    @GetMapping("/students/getAllStudentCourseByStudentName/{id}")
    public ResponseEntity<Map<String, Object>> getStudentByCourseIdAndStudentName(
        @PathVariable("id") Long courseId,
        @RequestParam("query") String param,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {

        List<StudentLessonDto> list = studentLessonService.getStudentByCourseIdAndStudentName(pageable, courseId, param);
        Integer totalPage = 0;
        Integer totalElement = studentLessonService.totalSearch(courseId, param);
        if (totalElement % pageable.getPageSize() == 0) {
            totalPage = totalElement / pageable.getPageSize();
        } else {
            totalPage = totalElement / pageable.getPageSize() + 1;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("content", list);
        map.put("totalPage", totalPage);
        return ResponseEntity.ok().body(map);
    }

    @GetMapping("/students/getAllStudentByClassroom/{id}")
    public ResponseEntity<Page<StudentClassroomDTO>> getAllStudentByClassroom(@PathVariable(value = "id") Long id, Pageable pageable, Principal principal) {
        log.debug("REST request to get getAllStudentByClassroom : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Page<StudentClassroomDTO> page = studentService.getAllStudentByClassroom(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getStudentAndClass")
    public ResponseEntity<Page<StudentDTO>> getStudentAndClass(Pageable pageable) {
        log.debug("REST request to get getStudentAndClass : {}");
        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        log.warn("====================================> " + getIdUser);
        Student student = studentService.getStudentById(getIdUser);
        log.warn("====================================> " + student);
        Page<StudentDTO> page = studentService.getStudentAndClass(student.getId(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getStudentsByCoursesAndName/{course_id}")
    public ResponseEntity<Page<StudentsDTO>> getStudentsByCoursesAndName(@PathVariable(value = "course_id") Long course_id, @RequestParam(value = "name") String name, Pageable pageable) {
        log.debug("REST request to get getStudentsByCoursesAndName : {}" + course_id);
        Page<StudentsDTO> page = studentService.getStudentsByCoursesAndName(course_id, name, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getAllStudentByClassroomAndName/{id}")
    public ResponseEntity<Page<StudentClassroomDTO>> searchAllStudentByClassAndName(@PathVariable(value = "id") Long id, @RequestParam(value = "name") String name, Pageable pageable, Principal principal) {
        log.debug("REST request to get searchAllStudentByClassAndName : {}", id);
        if (null == id) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Page<StudentClassroomDTO> page = studentService.searchAllStudentByClassAndName(id, name, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getAllStudentByClassroomCode")
    public ResponseEntity<Page<StudentClassroomDTO>> getAllStudentByClassroomCode(@RequestParam(value = "classCode") String classCode, Pageable pageable, Principal principal) {
        log.debug("REST request to get getAllStudentByClassroomCode : {}", classCode);
        if (classCode.equals("") || classCode.length() == 0) {
            throw new BadRequestAlertException("Invalid classroomCode", ENTITY_NAME, "classroomCodenull");
        }
        Page<StudentClassroomDTO> page = studentService.getAllStudentByClassCode(classCode, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getListStudentOnClass")
    public ResponseEntity<Map<String, Object>> getListStudentOnClass(@org.springdoc.api.annotations.ParameterObject Pageable pageable, @RequestParam(value = "query") String param) {
        Map<String, Object> map = new HashMap<>();
        List<StudentCourseDTO> list = studentService.getStudentsOnClass(param, pageable);
        int pageTotal = 1;
        if (studentRepository.countStudentOnClass("%" + param + "%") % pageable.getPageSize() != 0) {
            pageTotal = studentRepository.countStudentOnClass("%" + param + "%") / pageable.getPageSize() + 1;
        } else {
            pageTotal = studentRepository.countStudentOnClass("%" + param + "%") / pageable.getPageSize();
        }
        map.put("listStudent", list);
        map.put("pageTotal", pageTotal);
        return ResponseEntity.ok().body(map);
    }

    @GetMapping("/students/getStudentByNameCodeAndClass")
    public ResponseEntity<Page<Student>> searchStudentByNameCodeAndClass(@RequestParam(value = "param") String param, Pageable pageable, Principal principal) {
        log.debug("REST request to get searchStudentByNameCodeAndClass : {}", param);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<Student> page = studentService.getStudentByNameCodeAndClass("%" + param + "%", pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getStudentNotInCourse/{course_id}")
    public ResponseEntity<Page<Student>> getStudentNotInCourse(@PathVariable(value = "course_id") Long course_id, @RequestParam(value = "student_name") String student_name, Pageable pageable, Principal principal) {
        log.debug("REST request to get getStudentNotInCourse : {}", course_id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        log.info("param_student_name: "+student_name);
        Page<Student> page = null;
        if (student_name.trim().equalsIgnoreCase("") || student_name.isEmpty() || student_name.trim().equals(" ")) {
            page = studentService.getAllStudentNotInCourse(course_id, pageable);
        } else {
            page = studentService.getStudentNotInCourse(course_id,"%"+ student_name.trim().toLowerCase() +"%", pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/students/getStudentNotInClassroom/{classroom_id}")
    public ResponseEntity<Page<Student>> getStudentNotInClassroom(@PathVariable(value = "classroom_id") Long classroom_id, @RequestParam(value = "student_name") String student_name, Pageable pageable, Principal principal) {
        log.debug("REST request to get getStudentNotInClassroom : {}", classroom_id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        log.info("param_student_name: "+student_name);
        Page<Student> page = null;
        if (student_name.trim().equalsIgnoreCase("") || student_name.isEmpty() || student_name.trim().equals(" ")) {
            page = studentService.getAllStudentNotInClassroom(classroom_id, pageable);
        } else {
            page = studentService.getStudentNotInClassroom(classroom_id, "%"+ student_name.trim().toLowerCase() +"%", pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }


}
