package com.aladin.service;

import com.aladin.domain.Lecturer;
import com.aladin.repository.search.NewsRepositorySearchDTO;
import com.aladin.service.dto.NewsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NewsService {
    private final Logger log = LoggerFactory.getLogger(LecturerService.class);
    private final NewsRepositorySearchDTO newsRepositorySearchDTO;

    public NewsService(NewsRepositorySearchDTO newsRepositorySearchDTO) {
        this.newsRepositorySearchDTO = newsRepositorySearchDTO;
    }

    @Transactional(readOnly = true)
    public Page<NewsDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Lecturers for query {}", query);
        return newsRepositorySearchDTO.search(query, pageable);
    }
}
