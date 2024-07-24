package com.aladin.web.rest;

import com.aladin.domain.TypeOfExams;
import com.aladin.repository.TypeOfExamsRepository;
import com.aladin.service.TypeOfExamsService;
import com.aladin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.aladin.domain.TypeOfExams}.
 */
@RestController
@RequestMapping("/api")
public class TypeOfExamsResource {

    private final Logger log = LoggerFactory.getLogger(TypeOfExamsResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementTypeOfExams";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeOfExamsService typeOfExamsService;

    private final TypeOfExamsRepository typeOfExamsRepository;

    public TypeOfExamsResource(TypeOfExamsService typeOfExamsService, TypeOfExamsRepository typeOfExamsRepository) {
        this.typeOfExamsService = typeOfExamsService;
        this.typeOfExamsRepository = typeOfExamsRepository;
    }

    /**
     * {@code POST  /type-of-exams} : Create a new typeOfExams.
     *
     * @param typeOfExams the typeOfExams to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeOfExams, or with status {@code 400 (Bad Request)} if the typeOfExams has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-of-exams")
    public ResponseEntity<TypeOfExams> createTypeOfExams(@RequestBody TypeOfExams typeOfExams) throws URISyntaxException {
        log.debug("REST request to save TypeOfExams : {}", typeOfExams);
        if (typeOfExams.getId() != null) {
            throw new BadRequestAlertException("A new typeOfExams cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeOfExams result = typeOfExamsService.save(typeOfExams);
        return ResponseEntity
            .created(new URI("/api/type-of-exams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-of-exams/:id} : Updates an existing typeOfExams.
     *
     * @param id the id of the typeOfExams to save.
     * @param typeOfExams the typeOfExams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeOfExams,
     * or with status {@code 400 (Bad Request)} if the typeOfExams is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeOfExams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-of-exams/{id}")
    public ResponseEntity<TypeOfExams> updateTypeOfExams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeOfExams typeOfExams
    ) throws URISyntaxException {
        log.debug("REST request to update TypeOfExams : {}, {}", id, typeOfExams);
        if (typeOfExams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeOfExams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeOfExamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeOfExams result = typeOfExamsService.save(typeOfExams);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeOfExams.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-of-exams/:id} : Partial updates given fields of an existing typeOfExams, field will ignore if it is null
     *
     * @param id the id of the typeOfExams to save.
     * @param typeOfExams the typeOfExams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeOfExams,
     * or with status {@code 400 (Bad Request)} if the typeOfExams is not valid,
     * or with status {@code 404 (Not Found)} if the typeOfExams is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeOfExams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-of-exams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeOfExams> partialUpdateTypeOfExams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeOfExams typeOfExams
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeOfExams partially : {}, {}", id, typeOfExams);
        if (typeOfExams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeOfExams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeOfExamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeOfExams> result = typeOfExamsService.partialUpdate(typeOfExams);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeOfExams.getId().toString())
        );
    }

    /**
     * {@code GET  /type-of-exams} : get all the typeOfExams.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeOfExams in body.
     */
    @GetMapping("/type-of-exams")
    public ResponseEntity<List<TypeOfExams>> getAllTypeOfExams(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of TypeOfExams");
        Page<TypeOfExams> page = typeOfExamsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /type-of-exams/:id} : get the "id" typeOfExams.
     *
     * @param id the id of the typeOfExams to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeOfExams, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-of-exams/{id}")
    public ResponseEntity<TypeOfExams> getTypeOfExams(@PathVariable Long id) {
        log.debug("REST request to get TypeOfExams : {}", id);
        Optional<TypeOfExams> typeOfExams = typeOfExamsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(typeOfExams);
    }

    /**
     * {@code DELETE  /type-of-exams/:id} : delete the "id" typeOfExams.
     *
     * @param id the id of the typeOfExams to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-of-exams/{id}")
    public ResponseEntity<Void> deleteTypeOfExams(@PathVariable Long id) {
        log.debug("REST request to delete TypeOfExams : {}", id);
        typeOfExamsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/type-of-exams?query=:query} : search for the typeOfExams corresponding
     * to the query.
     *
     * @param query the query of the typeOfExams search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/type-of-exams")
    public ResponseEntity<List<TypeOfExams>> searchTypeOfExams(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of TypeOfExams for query {}", query);
        Page<TypeOfExams> page = typeOfExamsService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
