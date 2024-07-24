package com.aladin.web.rest;

import com.aladin.domain.News;
import com.aladin.repository.NewsRepository;
import com.aladin.repository.search.NewsSearchRepository;
import com.aladin.service.NewsService;
import com.aladin.service.UserService;
import com.aladin.service.dto.NotificationDto;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.News}.
 */
@RestController
@RequestMapping("/api")
public class NewsResource {

    private final Logger log = LoggerFactory.getLogger(NewsResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementNews";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NewsService newsService;

    private final NewsRepository newsRepository;

    private final UserService userService;

    private final NewsSearchRepository newsSearchRepository;



    public NewsResource(NewsService newsService,
                        UserService userService,
                        NewsSearchRepository newsSearchRepository,
                        NewsRepository newsRepository) {
        this.newsService = newsService;
        this.newsRepository = newsRepository;
        this.userService = userService;
        this.newsSearchRepository = newsSearchRepository;
    }

    /**
     * {@code POST  /news} : Create a new news.
     *
     * @param news the news to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new news, or with status {@code 400 (Bad Request)} if the news has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/news")
    public ResponseEntity<News> createNews(@Valid @RequestBody News news, Principal principal) throws URISyntaxException {
        log.debug("REST request to save News : {}", news);
        if (news.getId() != null) {
            throw new BadRequestAlertException("A new news cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        News result = newsService.save(news);
        return ResponseEntity
            .created(new URI("/api/news/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /news/:id} : Updates an existing news.
     *
     * @param id the id of the news to save.
     * @param news the news to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated news,
     * or with status {@code 400 (Bad Request)} if the news is not valid,
     * or with status {@code 500 (Internal Server Error)} if the news couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/news/{id}")
    public ResponseEntity<News> updateNews(@PathVariable(value = "id", required = false) final Long id,
                                           Principal principal,
                                           @Valid @RequestBody News news)
        throws URISyntaxException {
        log.debug("REST request to update News : {}, {}", id, news);
        if (news.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, news.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }

        News result = newsService.save(news);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, news.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /news/:id} : Partial updates given fields of an existing news, field will ignore if it is null
     *
     * @param id the id of the news to save.
     * @param news the news to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated news,
     * or with status {@code 400 (Bad Request)} if the news is not valid,
     * or with status {@code 404 (Not Found)} if the news is not found,
     * or with status {@code 500 (Internal Server Error)} if the news couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/news/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<News> partialUpdateNews(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody News news
    ) throws URISyntaxException {
        log.debug("REST request to partial update News partially : {}, {}", id, news);
        if (news.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, news.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<News> result = newsService.partialUpdate(news);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, news.getId().toString())
        );
    }

    /**
     * {@code GET  /news} : get all the news.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of news in body.
     */
    @GetMapping("/news")
    public ResponseEntity<Page<News>> getAllNews(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of News");
        Page<News> page = newsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/news/isDisplay")
    public ResponseEntity<List<News>> getAllNewsIsDisplay(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of News");
        List<News> lstNewsIsDisplay =  newsService.findLimitByIsDisplay();
        return ResponseEntity.ok(lstNewsIsDisplay);
    }

    /**
     * {@code GET  /news/:id} : get the "id" news.
     *
     * @param id the id of the news to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the news, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/news/{id}")
    public ResponseEntity<News> getNews(@PathVariable Long id, Principal principal) {
        log.debug("REST request to get News : {}", id);
        Optional<News> news = newsService.findOne(id, principal);
        return ResponseUtil.wrapOrNotFound(news);
    }

    /**
     * {@code DELETE  /news/:id} : delete the "id" news.
     *
     * @param id the id of the news to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/news/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id, Principal principal) {
        log.debug("REST request to delete News : {}", id);
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        newsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/news?query=:query} : search for the news corresponding
     * to the query.
     *
     * @param query the query of the news search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/news")
    public ResponseEntity<Page<News>> searchNews(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of News for query {}", query);
        Page<News> page = newsService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/news/deletes")
    public void deleteAllByIds(@RequestParam String ids, Principal principal){
        log.debug("REST request to delete All for a page of News for query {}", ids);
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        newsService.deleteMultiByIds(ids);
    }

    @GetMapping("/news/getAllSortDateAndDisplay")
    public ResponseEntity<Page<News>> getAllSortByCreatedDateAndIsDisplay(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ){
        log.debug("REST request to get All and sort by date and isDisplay");
        List<News> lst = newsService.getAllSortByCreatedDateAndIsDisplay(pageable);
        Long total = newsService.getTotalNews();
        Page<News> page = new PageImpl<News>(lst,pageable,total);
        return ResponseEntity.ok(page);
    }

    @PutMapping("/news/updateDisplay/{id}")
    public void updateDisplay(@PathVariable("id") Long id, Principal principal){
        log.debug("REST request to update  Display by Id", id);
        String userid = userService.getUserID(principal);
        log.info("user_id: "+userid);
        if(!userService.checkIsAdmin(userid)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        newsService.updateDisplay(id);
    }

    @GetMapping("/news/search")
    public ResponseEntity<List<News>> searchAllNewsByName(@RequestParam String query,
                                                                          @org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to searchAllExamsByCourseAndExamsName");
        List<News> lstNews = newsService.searchByTitle(query);
        return ResponseEntity.ok(lstNews);
    }
}
