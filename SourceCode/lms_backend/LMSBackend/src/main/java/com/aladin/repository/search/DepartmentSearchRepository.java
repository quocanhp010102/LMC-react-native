package com.aladin.repository.search;

import com.aladin.domain.Department;
import com.aladin.service.dto.CoursesDTO;
import com.aladin.service.dto.DepartmentDTO;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

public interface DepartmentSearchRepository extends ElasticsearchRepository<DepartmentDTO, Long>, DepartmentSearchRepositoryInternal {}

interface DepartmentSearchRepositoryInternal {
    Page<DepartmentDTO> search(String query, Pageable pageable);
}

class DepartmentSearchRepositoryInternalImpl implements DepartmentSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    DepartmentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<DepartmentDTO> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQueryBuilder()
            .withQuery(multiMatchQuery(query)
                .field("department_name")
                .type(MultiMatchQueryBuilder.Type.PHRASE_PREFIX)).build();
        nativeSearchQuery.setPageable(pageable);
        List<DepartmentDTO> hits = elasticsearchTemplate
            .search(nativeSearchQuery, DepartmentDTO.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, DepartmentDTO.class).getTotalHits());
    }
}
