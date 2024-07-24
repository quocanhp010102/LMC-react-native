package com.aladin.repository.search;

import com.aladin.domain.Lecturer;
import com.aladin.service.dto.CoursesDTO;
import com.aladin.service.dto.LecturerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

public interface LecturerSearchRepository extends ElasticsearchRepository<LecturerDTO, Long>, LecturerSearchRepositoryInternal {}
interface LecturerSearchRepositoryInternal {
    Page<LecturerDTO> search(String query, Pageable pageable);
}

class LecturerSearchRepositoryInternalImpl implements LecturerSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    LecturerSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<LecturerDTO> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<LecturerDTO> hits = elasticsearchTemplate
            .search(nativeSearchQuery, LecturerDTO.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, LecturerDTO.class).getTotalHits());
    }
}
