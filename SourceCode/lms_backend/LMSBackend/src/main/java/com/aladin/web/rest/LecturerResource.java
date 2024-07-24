package com.aladin.web.rest;

import com.aladin.domain.Lecturer;
import com.aladin.domain.Student;
import com.aladin.repository.LecturerRepository;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.dto.LecturerDTO;
import com.aladin.service.dto.UserOnlyDTO;
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

import liquibase.pro.packaged.P;
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
 * REST controller for managing {@link com.aladin.domain.Lecturer}.
 */
@RestController
@RequestMapping("/api")
public class LecturerResource {

    private final Logger log = LoggerFactory.getLogger(LecturerResource.class);

    private static final String ENTITY_NAME = "lmsBackendLecturer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LecturerService lecturerService;

    private final LecturerRepository lecturerRepository;

    private final UserService userService;

    private final StudentService studentService;

    public LecturerResource(LecturerService lecturerService, LecturerRepository lecturerRepository, UserService userService, StudentService studentService) {
        this.lecturerService = lecturerService;
        this.lecturerRepository = lecturerRepository;
        this.userService = userService;
        this.studentService = studentService;
    }

    /**
     * {@code POST  /lecturers} : Create a new lecturer.
     *
     * @param lecturer the lecturer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lecturer, or with status {@code 400 (Bad Request)} if the lecturer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lecturers")
    public ResponseEntity<Lecturer> createLecturer(@Valid @RequestBody Lecturer lecturer, Principal principal) throws URISyntaxException {
        log.debug("REST request to save Lecturer : {}", lecturer);
        if (lecturer.getId() != null) {
            throw new BadRequestAlertException("A new lecturer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid)) {
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME, "onlyAdmin");
        }
        Lecturer result = lecturerService.save(lecturer);
        return ResponseEntity
            .created(new URI("/api/lecturers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lecturers/:id} : Updates an existing lecturer.
     *
     * @param id the id of the lecturer to save.
     * @param lecturer the lecturer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lecturer,
     * or with status {@code 400 (Bad Request)} if the lecturer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lecturer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lecturers/{id}")
    public ResponseEntity<Lecturer> updateLecturer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Lecturer lecturer, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to update Lecturer : {}, {}", id, lecturer);
        String userid = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userid) && !userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdminAndLecturer", ENTITY_NAME,"OnlyAdminAndLecturer");
        }
        if (lecturer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lecturer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lecturerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Lecturer result = lecturerService.save(lecturer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lecturer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lecturers/:id} : Partial updates given fields of an existing lecturer, field will ignore if it is null
     *
     * @param id the id of the lecturer to save.
     * @param lecturer the lecturer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lecturer,
     * or with status {@code 400 (Bad Request)} if the lecturer is not valid,
     * or with status {@code 404 (Not Found)} if the lecturer is not found,
     * or with status {@code 500 (Internal Server Error)} if the lecturer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lecturers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Lecturer> partialUpdateLecturer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Lecturer lecturer, Principal principal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Lecturer partially : {}, {}", id, lecturer);
        if (lecturer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lecturer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!lecturerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        String userid = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userid) && !userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdminAndLecturer", ENTITY_NAME,"OnlyAdminAndLecturer");
        }

        Optional<Lecturer> result = lecturerService.partialUpdate(lecturer);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lecturer.getId().toString())
        );
    }

    /**
     * {@code GET  /lecturers} : get all the lecturers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lecturers in body.
     */
    @GetMapping("/lecturers")
    public ResponseEntity<Page<Lecturer>> getAllLecturers(@org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal) {
        log.debug("REST request to get a page of Lecturers");

        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<Lecturer> page = lecturerService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET  /lecturers/:id} : get the "id" lecturer.
     *
     * @param id the id of the lecturer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lecturer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lecturers/{id}")
    public ResponseEntity<Lecturer> getLecturer(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get Lecturer : {}", id);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Optional<Lecturer> lecturer = lecturerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lecturer);
    }

    /**
     * {@code DELETE  /lecturers/:id} : delete the "id" lecturer.
     *
     * @param id the id of the lecturer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lecturers/{id}")
    public ResponseEntity<Void> deleteLecturer(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete Lecturer : {}", id);

        String userid = userService.getUserFromAuthentication((AbstractAuthenticationToken) principal).getId();
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        lecturerService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/lecturers?query=:query} : search for the lecturer corresponding
     * to the query.
     *
     * @param query the query of the lecturer search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/lecturers")
    public ResponseEntity<Page<LecturerDTO>> searchLecturers(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of Lecturers for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }

        Page<LecturerDTO> page = lecturerService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/lecturers/myself")
    public ResponseEntity<Lecturer> getLecturerInforByMySelf(Principal principal) throws URISyntaxException{
        log.debug("REST request to getLecturerInforByMySelf");

        String userid = userService.getUserID(principal);
        if(!lecturerService.checkIsLecturer(userid)){
            throw new BadRequestAlertException("OnlyLecturer", ENTITY_NAME,"onlyLecturer");
        }

        Lecturer lecturer= lecturerService.getLecturerByUser(userid);
        if(lecturer==null){
            return ResponseEntity.badRequest().body(lecturer);
        }
        log.warn(lecturer.toString());
        return ResponseEntity
            .created(new URI("/lecturers/myself" + lecturer.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, lecturer.getId().toString()))
            .body(lecturer);
    }


}
