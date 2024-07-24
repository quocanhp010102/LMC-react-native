package com.aladin.web.rest;//package com.aladin.web.rest;


import com.aladin.service.*;
import com.aladin.service.dto.NewsDTO;
import com.aladin.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

import java.security.Principal;

import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;


@RestController
@RequestMapping("/api")
public class SearchAllResource {


    private final Logger log = LoggerFactory.getLogger(SearchAllResource.class);
    private final SearchAllService searchAllService;
    private final UserService userService;

    private final NewsService newsService;

    private final StudentService studentService;

    private final LecturerService lecturerService;


    public SearchAllResource(SearchAllService searchAllService, UserService userService, NewsService newsService, StudentService studentService, LecturerService lecturerService) {
        this.searchAllService = searchAllService;
        this.userService = userService;
        this.newsService = newsService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }

    @GetMapping("/_search-all")
    public ResponseEntity<Page<NewsDTO>> searchAllByRole(@RequestParam("query") String query, Pageable pageable, Principal principal) {
        log.debug("REST request to search for a page of Departments for query {}", query);
        Page<NewsDTO> page = newsService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

}
