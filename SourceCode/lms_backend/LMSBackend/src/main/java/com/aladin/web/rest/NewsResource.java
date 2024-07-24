package com.aladin.web.rest;

import com.aladin.domain.Department;
import com.aladin.service.LecturerService;
import com.aladin.service.NewsService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.service.dto.NewsDTO;
import com.aladin.web.rest.errors.BadRequestAlertException;
import oracle.net.aso.f;
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
import java.util.List;

import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;

@RestController
@RequestMapping("/api")
public class NewsResource {

    private final Logger log = LoggerFactory.getLogger(DepartmentResource.class);
    private final NewsService newsService;
    private final UserService userService;

    private final StudentService studentService;

    private final LecturerService lecturerService;

    public NewsResource(NewsService newsService, UserService userService, StudentService studentService, LecturerService lecturerService) {
        this.newsService = newsService;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }

    @GetMapping("/_search/news")
    public ResponseEntity<Page<NewsDTO>> searchDepartments(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable, Principal principal
    ) {
        log.debug("REST request to search for a page of Departments for query {}", query);
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        Page<NewsDTO> page = newsService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

}
