package com.aladin.web.rest;

import com.aladin.domain.Classroom;
import com.aladin.domain.Lecturer;
import com.aladin.domain.Student;
import com.aladin.repository.ClassroomRepository;
import com.aladin.service.*;
import com.aladin.service.dto.ClassroomDepartmentDTO;
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
import javax.ws.rs.Path;

import liquibase.pro.packaged.de;
import liquibase.pro.packaged.v;
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
 * REST controller for managing {@link com.aladin.domain.Classroom}.
 */
@RestController
@RequestMapping("/api")
public class ClassroomResource {

    private final Logger log = LoggerFactory.getLogger(ClassroomResource.class);

    private static final String ENTITY_NAME = "lmsBackendClassroom";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClassroomService classroomService;

    private final ClassroomRepository classroomRepository;

    private final ClassroomStudentService classroomStudentService;

    private final UserService userService;

    private final StudentService studentService;

    private LecturerService lecturerService;

    public ClassroomResource(ClassroomService classroomService, ClassroomRepository classroomRepository, ClassroomStudentService classroomStudentService, UserService userService, StudentService studentService, LecturerService lecturerService) {
        this.classroomService = classroomService;
        this.classroomRepository = classroomRepository;
        this.classroomStudentService = classroomStudentService;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }

    /**
     * {@code POST  /classrooms} : Create a new classroom.
     *
     * @param classroom the classroom to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classroom, or with status {@code 400 (Bad Request)} if the classroom has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/classrooms")
    public ResponseEntity<Classroom> createClassroom(@Valid @RequestBody Classroom classroom, Principal principal) throws URISyntaxException {
        log.debug("REST request to save Classroom : {}", classroom);
        if (classroom.getId() != null) {
            throw new BadRequestAlertException("A new classroom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Classroom result = classroomService.save(classroom);
        return ResponseEntity
            .created(new URI("/api/classrooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /classrooms/:id} : Updates an existing classroom.
     *
     * @param id        the id of the classroom to save.
     * @param classroom the classroom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classroom,
     * or with status {@code 400 (Bad Request)} if the classroom is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classroom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/classrooms/{id}")
    public ResponseEntity<Classroom> updateClassroom(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Classroom classroom, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update Classroom : {}, {}", id, classroom);
        if (classroom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classroom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classroomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
    log.info("update classroom: "+classroom);
        Classroom result = classroomService.save(classroom);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classroom.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /classrooms/:id} : Partial updates given fields of an existing classroom, field will ignore if it is null
     *
     * @param id        the id of the classroom to save.
     * @param classroom the classroom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classroom,
     * or with status {@code 400 (Bad Request)} if the classroom is not valid,
     * or with status {@code 404 (Not Found)} if the classroom is not found,
     * or with status {@code 500 (Internal Server Error)} if the classroom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/classrooms/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<Classroom> partialUpdateClassroom(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Classroom classroom, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Classroom partially : {}, {}", id, classroom);
        if (classroom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classroom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classroomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }

        Optional<Classroom> result = classroomService.partialUpdate(classroom);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, classroom.getId().toString())
        );
    }

    /**
     * {@code GET  /classrooms} : get all the classrooms.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of classrooms in body.
     */
    @GetMapping("/classrooms")
    public ResponseEntity<Page<Classroom>> getAllClassrooms(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of Classrooms");
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSuser", ENTITY_NAME, "OnlyLMSuser");
        }
        Page<Classroom> page = classroomService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /classrooms/:id} : get the "id" classroom.
     *
     * @param id the id of the classroom to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classroom, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/classrooms/{id}")
    public ResponseEntity<Classroom> getClassroom(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get Classroom : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSuser", ENTITY_NAME, "OnlyLMSuser");
        }
        Optional<Classroom> classroom = classroomService.findOne(id);
        return ResponseUtil.wrapOrNotFound(classroom);
    }

    /**
     * {@code DELETE  /classrooms/:id} : delete the "id" classroom.
     *
     * @param id the id of the classroom to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/classrooms/{id}")
    public ResponseEntity<Void> deleteClassroom(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete Classroom : {}", id);

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        classroomStudentService.deleteClassroom(id);
        classroomService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/classrooms?query=:query} : search for the classroom corresponding
     * to the query.
     *
     * @param query    the query of the classroom search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/classrooms")
    public ResponseEntity<Page<Classroom>> searchClassrooms(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of Classrooms for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }

        Page<Classroom> page = classroomService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/classrooms/getByUserLogin")
    public ResponseEntity<Page<Classroom>> getAllClassroomByUserLogin(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of getAllClassroomByUserLogin");
        String user_id = userService.getUserID(principal);
        Student student = studentService.getStudentByUserLogin(user_id);
        if (!userService.checkIsAdmin(user_id) && !studentService.checkIsStudent(user_id) && !lecturerService.checkIsLecturer(user_id)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<Classroom> page = classroomStudentService.getAllClassroomByUserLogin(student.getId(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping(value = "/classrooms/getClassroomByDepartment/{department_id}")
    public ResponseEntity<Page<ClassroomDepartmentDTO>> getAllClassroomByDepartment(@PathVariable(value = "department_id") Long department_id, Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of getAllClassroomByDepartment: ", department_id);
        if (null == department_id) {
            throw new BadRequestAlertException("Invalid department_id", ENTITY_NAME, "department_idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomDepartmentDTO> page = classroomService.getAllClassroomByDepartment(department_id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping(value = "/classrooms/searchClassroomByDepartmentAndClassName/{department_id}")
    public ResponseEntity<Page<ClassroomDepartmentDTO>> searchClassroomByDepartmentAndClassName(@PathVariable(value = "department_id") Long department_id,
                                                                                                @RequestParam(value = "className") String className, Principal principal, Pageable pageable) {
        log.debug("REST request to get a page of searchClassroomByDepartmentAndClassName: ", department_id);
        if (null == department_id) {
            throw new BadRequestAlertException("Invalid department_id", ENTITY_NAME, "department_idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomDepartmentDTO> page = classroomService.searchClassroomByDepartmentAndClassName(department_id, className, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping(value = "/classrooms/searchClassroomByDepartmentAndClassCode/{department_id}")
    public ResponseEntity<Page<ClassroomDepartmentDTO>> searchClassroomByDepartmentAndClassCode(@PathVariable(value = "department_id") Long department_id,
                                                                                                @RequestParam(value = "classCode") String classCode, Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of searchClassroomByDepartmentAndClassCode: ", department_id);
        if (null == department_id) {
            throw new BadRequestAlertException("Invalid department_id", ENTITY_NAME, "department_idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomDepartmentDTO> page = classroomService.searchClassroomByDepartmentAndClassCode(department_id, classCode, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @DeleteMapping("/classroom/deleteClassroom")
    public ResponseEntity deleteMultiClassroom(@RequestBody Long[] student, Principal principal) {
        log.debug("REST request to  deleteMultiClassroom : {}");
        if (student.length == 0) {
            throw new BadRequestAlertException("Invalid student", ENTITY_NAME, "student null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        for (Long detail : student) {
            log.warn("st to deatil: " + detail);
            classroomService.deleteMultiClassroom(detail);
        }
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, student.toString()))
            .build();
    }

    @GetMapping(value = "/classrooms/searchClassroomByDepartmentName")
    public ResponseEntity<Page<ClassroomDepartmentDTO>> searchClassroomByDepartmentName(@RequestParam(value = "department_name") String department_name, Principal principal, Pageable pageable) {
        log.debug("REST request to get a page of searchClassroomByDepartment: ", department_name);
        if (null == department_name || department_name.equals("")) {
            throw new BadRequestAlertException("Invalid department_id", ENTITY_NAME, "department_idnull");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomDepartmentDTO> page = classroomService.searchClassroomByDepartmentName(department_name, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping(value = "/classrooms/searchClassroomDepartmentByClassName")
    public ResponseEntity<Page<ClassroomDepartmentDTO>> searchClassroomByClassName(@RequestParam(value = "class_name") String class_name, Principal principal, Pageable pageable) {
        log.debug("REST request to get a page of searchClassroomByDepartment: ", class_name);
        if (null == class_name || class_name.equals("")) {
            throw new BadRequestAlertException("Invalid class_name", ENTITY_NAME, "class_name_is_null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomDepartmentDTO> page = classroomService.searchClassroomByClassName(class_name, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping(value = "/classrooms/searchClassroomDepartmentByClassCode")
    public ResponseEntity<Page<ClassroomDepartmentDTO>> searchClassroomByClassCode(@RequestParam(value = "class_code") String class_code, Principal principal, Pageable pageable) {
        log.debug("REST request to get a page of searchClassroomByClassCode: ", class_code);
        if (null == class_code || class_code.equals("")) {
            throw new BadRequestAlertException("Invalid class_code", ENTITY_NAME, "class_code_is_null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<ClassroomDepartmentDTO> page = classroomService.searchClassroomByClassCode(class_code, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

//    @GetMapping(value = "/classrooms/searchClassroomByCodeNameAndDepartment")
//    public ResponseEntity<Page<ClassroomDepartmentDTO>> searchClassroomByCodeNameAndDepartment(@RequestParam(value = "param") String param, Principal principal, Pageable pageable) {
//        log.debug("REST request to get a page of searchClassroomByCodeNameAndDepartment: ", param);
//        if (null == param || param.equals("")) {
//            throw new BadRequestAlertException("Invalid param", ENTITY_NAME, "param_is_null");
//        }
//        String userid = userService.getUserID(principal);
//        if (!userService.checkIsAdmin(userid)) {
//            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
//        }
//        Page<ClassroomDepartmentDTO> page = classroomService.searchClassroomByCodeNameAndDepartment("%"+param+"%", pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//        return ResponseEntity.ok().headers(headers).body(page);
//
//    }

    @GetMapping(value = "/classrooms/searchClassroomByCodeNameAndDepartment")
    public ResponseEntity<Page<Classroom>> searchClassroomByCodeNameAndDepartment(@RequestParam(value = "param") String param, Principal principal, Pageable pageable) {
        log.debug("REST request to get a page of searchClassroomByCodeNameAndDepartment: ", param);
        if (null == param || param.equals("")) {
            throw new BadRequestAlertException("Invalid param", ENTITY_NAME, "param_is_null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Page<Classroom> page = classroomService.searchClassroomByCodeNameAndDepartment("%" + param + "%", pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping(value = "/classrooms/checkExistClassroom")
    public ResponseEntity<String> checkExistClassroom(@RequestParam(value = "classCode") String classCode, Principal principal) {
        log.debug("REST request to get a page of checkExistClassroom: ", classCode);
        if (null == classCode || classCode.equals("")) {
            throw new BadRequestAlertException("Invalid Classroom Code", ENTITY_NAME, "classCode_is_null");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        if (classroomService.checkExistClassroom(classCode.trim())) {
            return ResponseEntity.badRequest().body("ClassroomCode is exist");
        } else {
            return ResponseEntity.ok().body(classCode);
        }
    }
}
