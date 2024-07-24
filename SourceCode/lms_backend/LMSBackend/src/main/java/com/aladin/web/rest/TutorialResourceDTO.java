package com.aladin.web.rest;

import com.aladin.service.TutorialServiceDTO;
import com.aladin.service.dto.TutorialDTO;
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

import java.util.List;

@RestController
@RequestMapping("/api")
public class TutorialResourceDTO {

    private final Logger log = LoggerFactory.getLogger(StudentResource.class);
    private final TutorialServiceDTO tutorialServiceDTO;

    public TutorialResourceDTO(TutorialServiceDTO tutorialServiceDTO) {
        this.tutorialServiceDTO = tutorialServiceDTO;
    }

    @GetMapping("/_search/tutorials")
    public ResponseEntity<Page<TutorialDTO>> searchStudents(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Students for query {}", query);
        Page<TutorialDTO> page = tutorialServiceDTO.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }
}
