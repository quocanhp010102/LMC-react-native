package com.aladin.web.rest;

import com.aladin.domain.Tutorial;
import com.aladin.repository.TutorialRepository;
import com.aladin.repository.search.TutorialSearchRepository;
import com.aladin.security.SecurityUtils;
import com.aladin.service.AuthorityService;
import com.aladin.service.TutorialService;
import com.aladin.service.UserService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.Tutorial}.
 */
@RestController
@RequestMapping("/api")
public class TutorialResource {

    private final Logger log = LoggerFactory.getLogger(TutorialResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementTutorial";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TutorialService tutorialService;

    private final TutorialRepository tutorialRepository;

    private final AuthorityService authorityService;

    private  final UserService userService;

    private final TutorialSearchRepository tutorialSearchRepository;

    public TutorialResource(TutorialService tutorialService,
                            UserService userService,
                            TutorialRepository tutorialRepository,
                            AuthorityService authorityService, TutorialSearchRepository tutorialSearchRepository) {
        this.tutorialService = tutorialService;
        this.tutorialRepository = tutorialRepository;
        this.authorityService = authorityService;
        this.userService = userService;
        this.tutorialSearchRepository = tutorialSearchRepository;
    }

    /**
     * {@code POST  /tutorials} : Create a new tutorial.
     *
     * @param tutorial the tutorial to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tutorial, or with status {@code 400 (Bad Request)} if the tutorial has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tutorials")
    public ResponseEntity<Tutorial> createTutorial(@Valid @RequestBody Tutorial tutorial, Principal principal) throws URISyntaxException {
        log.debug("REST request to save Tutorial : {}", tutorial);
        if (tutorial.getId() != null) {
            throw new BadRequestAlertException("A new tutorial cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        if(tutorial.getAuthorities() == null  || tutorial.getAuthorities().size() == 0){
            throw new BadRequestAlertException("Authorities is not null", ENTITY_NAME,"Authorities is not null");
        }
        tutorial= tutorialService.save(tutorial);
        return ResponseEntity
            .created(new URI("/api/tutorials/" + tutorial.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, tutorial.getId().toString()))
            .body(tutorial);
    }

    /**
     * {@code PUT  /tutorials/:id} : Updates an existing tutorial.
     *
     * @param id the id of the tutorial to save.
     * @param tutorial the tutorial to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tutorial,
     * or with status {@code 400 (Bad Request)} if the tutorial is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tutorial couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tutorials/{id}")
    public ResponseEntity<Tutorial> updateTutorial(
        @PathVariable(value = "id", required = false) final Long id,Principal principal,
        @Valid @RequestBody Tutorial tutorial
    ) throws URISyntaxException {
        log.debug("REST request to update Tutorial : {}, {}", id, tutorial);
        if (tutorial.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tutorial.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tutorialRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }

//        Tutorial result = TutorialMapper.convertToEntity(tutorial,authorityService);
        tutorial=tutorialService.save(tutorial);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tutorial.getId().toString()))
            .body(tutorial);
    }

    /**
     * {@code PATCH  /tutorials/:id} : Partial updates given fields of an existing tutorial, field will ignore if it is null
     *
     * @param id the id of the tutorial to save.
     * @param tutorial the tutorial to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tutorial,
     * or with status {@code 400 (Bad Request)} if the tutorial is not valid,
     * or with status {@code 404 (Not Found)} if the tutorial is not found,
     * or with status {@code 500 (Internal Server Error)} if the tutorial couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tutorials/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tutorial> partialUpdateTutorial(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Tutorial tutorial
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tutorial partially : {}, {}", id, tutorial);
        if (tutorial.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tutorial.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tutorialRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
//        Tutorial tutorialUpdate = TutorialMapper.convertToEntity(tutorial,authorityService);
        Optional<Tutorial> result = tutorialService.partialUpdate(tutorial);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tutorial.getId().toString())
        );
    }

    /**
     * {@code GET  /tutorials} : get all the tutorials.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tutorials in body.
     */
    @GetMapping("/tutorials")
    public ResponseEntity<Page<Tutorial>> getAllTutorials(@org.springdoc.api.annotations.ParameterObject Pageable pageable
    ,Principal principal) {
        log.debug("REST request to get a page of Tutorials");
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        Page<Tutorial> page = tutorialService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }


    @GetMapping("/tutorials/isDisplay")
    public ResponseEntity<List<Tutorial>> getAllTutorialsIsDisplay() {
    log.debug("REST request to get a page of Tutorials");
    List<Tutorial> lst =tutorialRepository.findAllByIsDisplayAndAllUser();
    return ResponseEntity.ok(lst);
}

    @GetMapping("/tutorials/authen")
    public ResponseEntity<Page<Tutorial>> getAllTutorialByAuthen(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Tutorials");
        Page<Tutorial> lst = tutorialService.findAllByLstAuthen(pageable);
        return ResponseEntity.ok(lst);
    }


    /**
     * {@code GET  /tutorials/:id} : get the "id" tutorial.
     *
     * @param id the id of the tutorial to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tutorial, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tutorials/{id}")
    public ResponseEntity<Tutorial> getTutorial(@PathVariable Long id) {
        log.debug("REST request to get Tutorial : {}", id);
        Optional<Tutorial> tutorial = tutorialService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tutorial);
    }

    /**
     * {@code DELETE  /tutorials/:id} : delete the "id" tutorial.
     *
     * @param id the id of the tutorial to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tutorials/{id}")
    public ResponseEntity<Void> deleteTutorial(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete Tutorial : {}", id);
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        tutorialService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/tutorials?query=:query} : search for the tutorial corresponding
     * to the query.
     *
     * @param query the query of the tutorial search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/tutorials")
    public ResponseEntity<Page<Tutorial>> searchTutorials(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Tutorials for query {}", query);
        Page<Tutorial> page = tutorialService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }




    @PutMapping("/tutorials/updateDisplay/{id}")
    public void updateDisplay(@PathVariable("id") Long id, Principal principal){
        log.debug("REST request to update  Display by Id", id);
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        tutorialService.updateDisplay(id);
    }

    @DeleteMapping("/tutorials/deletes")
    public ResponseEntity<?> deleteMultiByIds(@RequestParam String ids, Principal principal){
        log.debug("REST request to deleteMultiByIds", ids);
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        tutorialService.deleteMultiByIds(ids);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
