package com.aladin.web.rest;

import com.aladin.domain.History;
import com.aladin.repository.HistoryRepository;
import com.aladin.service.HistoryService;
import com.aladin.service.dto.IdsDelete;
import com.aladin.web.rest.dto.HistoryDto;
import com.aladin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.*;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.History}.
 */
@RestController
@RequestMapping("/api")
public class HistoryResource {

    private final Logger log = LoggerFactory.getLogger(HistoryResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoryService historyService;

    private final HistoryRepository historyRepository;

    public HistoryResource(HistoryService historyService, HistoryRepository historyRepository) {
        this.historyService = historyService;
        this.historyRepository = historyRepository;
    }

    /**
     * {@code POST  /activity-histories} : Create a new History.
     *
     * @param historyDto the History to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new History, or with status {@code 400 (Bad Request)} if the History has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-histories")
    public ResponseEntity<History> createHistory(@Valid @RequestBody HistoryDto historyDto, Principal principal)
        throws URISyntaxException {
        log.debug("REST request to save History : {}", historyDto);
//        if (History.getId() != null) {
//            throw new BadRequestAlertException("A new History cannot already have an ID", ENTITY_NAME, "idexists");
//        }
        History result = historyService.save(historyDto, principal);
        return ResponseEntity
            .created(new URI("/api/activity-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-histories/:id} : Updates an existing History.
     *
     * @param id the id of the History to save.
     * @param History the History to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated History,
     * or with status {@code 400 (Bad Request)} if the History is not valid,
     * or with status {@code 500 (Internal Server Error)} if the History couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PutMapping("/activity-histories/{id}")
//    public ResponseEntity<History> updateHistory(
//        @PathVariable(value = "id", required = false) final Long id,
//        @Valid @RequestBody History History
//    ) throws URISyntaxException {
//        log.debug("REST request to update History : {}, {}", id, History);
//        if (History.getId() == null) {
//            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
//        }
//        if (!Objects.equals(id, History.getId())) {
//            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
//        }
//
//        if (!historyRepository.existsById(id)) {
//            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
//        }
//
//        History result = historyService.save(History);
//        return ResponseEntity
//            .ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, History.getId().toString()))
//            .body(result);
//    }

    /**
     * {@code PATCH  /activity-histories/:id} : Partial updates given fields of an existing History, field will ignore if it is null
     *
     * @param id the id of the History to save.
     * @param History the History to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated History,
     * or with status {@code 400 (Bad Request)} if the History is not valid,
     * or with status {@code 404 (Not Found)} if the History is not found,
     * or with status {@code 500 (Internal Server Error)} if the History couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-histories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<History> partialUpdateHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody History History
    ) throws URISyntaxException {
        log.debug("REST request to partial update History partially : {}, {}", id, History);
        if (History.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, History.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<History> result = historyService.partialUpdate(History);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, History.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-histories} : get all the activityHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityHistories in body.
     */
    @GetMapping("/activity-histories")
    public ResponseEntity<Page<History>> getAllActivityHistories(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ActivityHistories");
        Page<History> page = historyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    /**
     * {@code GET  /activity-histories/:id} : get the "id" History.
     *
     * @param id the id of the History to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the History, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-histories/{id}")
    public ResponseEntity<History> getHistory(@PathVariable Long id) {
        log.debug("REST request to get History : {}", id);
        Optional<History> History = historyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(History);
    }

    /**
     * {@code DELETE  /activity-histories/:id} : delete the "id" History.
     *
     * @param id the id of the History to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-histories/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        log.debug("REST request to delete History : {}", id);
        historyService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/activity-histories?query=:query} : search for the History corresponding
     * to the query.
     *
     * @param query the query of the History search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/activity-histories")
    public ResponseEntity<List<History>> searchActivityHistories(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of ActivityHistories for query {}", query);
        Page<History> page = historyService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/activity-histories/getBycurrentDate")
    public ResponseEntity<Page<History>> getAllInCurrentDateAndUserLogin(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ){
        log.debug("REST request to getAllInCurrentDateAndUserLogin");
        Long total =  historyService.totalHistoryByDateAndLogin();
        List<History> lst = historyService.findAllByDateAndCurrentUserLogin( pageable);
        Page<History> page = new PageImpl<History>(lst,pageable,total);
        return ResponseEntity.ok(page);
    }

        @GetMapping("/activity-histories/getBycurrentMonth")
    public ResponseEntity<Page<History>> getAllInCurrentMonthAndUserLogin(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ){
        log.debug("REST request to getAllInCurrentMonthAndUserLogin");
        Long total =  historyService.totalHistoryByCurrentMonthAndUserLogin();
        List<History> lst = historyService.findAllByCurrentMonthAndUserLogin( pageable);
        Page<History> page = new PageImpl<History>(lst,pageable,total);
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/activity-histories/deleteAllByIds")
    public void deleteAllByIds(@RequestBody IdsDelete idsDelete){
        historyService.deleteAllByIds(idsDelete.getIds());
    }
}
