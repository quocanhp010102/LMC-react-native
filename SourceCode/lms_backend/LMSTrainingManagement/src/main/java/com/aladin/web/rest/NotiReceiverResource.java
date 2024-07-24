package com.aladin.web.rest;

import com.aladin.domain.NotiReceiver;
import com.aladin.repository.NotiReceiverRepository;
import com.aladin.service.NotiReceiverService;
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
 * REST controller for managing {@link com.aladin.domain.NotiReceiver}.
 */
@RestController
@RequestMapping("/api")
public class NotiReceiverResource {

    private final Logger log = LoggerFactory.getLogger(NotiReceiverResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementNotiReceiver";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotiReceiverService notiReceiverService;

    private final NotiReceiverRepository notiReceiverRepository;

    public NotiReceiverResource(NotiReceiverService notiReceiverService, NotiReceiverRepository notiReceiverRepository) {
        this.notiReceiverService = notiReceiverService;
        this.notiReceiverRepository = notiReceiverRepository;
    }

    /**
     * {@code POST  /noti-receivers} : Create a new notiReceiver.
     *
     * @param notiReceiver the notiReceiver to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new notiReceiver, or with status {@code 400 (Bad Request)} if the notiReceiver has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/noti-receivers")
    public ResponseEntity<NotiReceiver> createNotiReceiver(@RequestBody NotiReceiver notiReceiver) throws URISyntaxException {
        log.debug("REST request to save NotiReceiver : {}", notiReceiver);
        if (notiReceiver.getId() != null) {
            throw new BadRequestAlertException("A new notiReceiver cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NotiReceiver result = notiReceiverService.save(notiReceiver);
        return ResponseEntity
            .created(new URI("/api/noti-receivers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /noti-receivers/:id} : Updates an existing notiReceiver.
     *
     * @param id the id of the notiReceiver to save.
     * @param notiReceiver the notiReceiver to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notiReceiver,
     * or with status {@code 400 (Bad Request)} if the notiReceiver is not valid,
     * or with status {@code 500 (Internal Server Error)} if the notiReceiver couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/noti-receivers/{id}")
    public ResponseEntity<NotiReceiver> updateNotiReceiver(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NotiReceiver notiReceiver
    ) throws URISyntaxException {
        log.debug("REST request to update NotiReceiver : {}, {}", id, notiReceiver);
        if (notiReceiver.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notiReceiver.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notiReceiverRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NotiReceiver result = notiReceiverService.save(notiReceiver);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notiReceiver.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /noti-receivers/:id} : Partial updates given fields of an existing notiReceiver, field will ignore if it is null
     *
     * @param id the id of the notiReceiver to save.
     * @param notiReceiver the notiReceiver to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notiReceiver,
     * or with status {@code 400 (Bad Request)} if the notiReceiver is not valid,
     * or with status {@code 404 (Not Found)} if the notiReceiver is not found,
     * or with status {@code 500 (Internal Server Error)} if the notiReceiver couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/noti-receivers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NotiReceiver> partialUpdateNotiReceiver(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NotiReceiver notiReceiver
    ) throws URISyntaxException {
        log.debug("REST request to partial update NotiReceiver partially : {}, {}", id, notiReceiver);
        if (notiReceiver.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notiReceiver.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notiReceiverRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NotiReceiver> result = notiReceiverService.partialUpdate(notiReceiver);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notiReceiver.getId().toString())
        );
    }

    /**
     * {@code GET  /noti-receivers} : get all the notiReceivers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notiReceivers in body.
     */
    @GetMapping("/noti-receivers")
    public ResponseEntity<List<NotiReceiver>> getAllNotiReceivers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of NotiReceivers");
        Page<NotiReceiver> page = notiReceiverService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /noti-receivers/:id} : get the "id" notiReceiver.
     *
     * @param id the id of the notiReceiver to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the notiReceiver, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/noti-receivers/{id}")
    public ResponseEntity<NotiReceiver> getNotiReceiver(@PathVariable Long id) {
        log.debug("REST request to get NotiReceiver : {}", id);
        Optional<NotiReceiver> notiReceiver = notiReceiverService.findOne(id);
        return ResponseUtil.wrapOrNotFound(notiReceiver);
    }

    /**
     * {@code DELETE  /noti-receivers/:id} : delete the "id" notiReceiver.
     *
     * @param id the id of the notiReceiver to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/noti-receivers/{id}")
    public ResponseEntity<Void> deleteNotiReceiver(@PathVariable Long id) {
        log.debug("REST request to delete NotiReceiver : {}", id);
        notiReceiverService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/noti-receivers?query=:query} : search for the notiReceiver corresponding
     * to the query.
     *
     * @param query the query of the notiReceiver search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/noti-receivers")
    public ResponseEntity<List<NotiReceiver>> searchNotiReceivers(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of NotiReceivers for query {}", query);
        Page<NotiReceiver> page = notiReceiverService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
