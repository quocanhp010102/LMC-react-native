package com.aladin.repository.search;

import com.aladin.domain.Student;
import com.aladin.service.dto.LecturerDTO;
import com.aladin.service.dto.StudentDTO;
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

public interface StudentSearchRepository extends ElasticsearchRepository<StudentDTO, Long>, StudentSearchRepositoryInternal {
}

interface StudentSearchRepositoryInternal {
    Page<StudentDTO> search(String query, Pageable pageable);
}

class StudentSearchRepositoryInternalImpl implements StudentSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public StudentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }


    @Override
    public Page<StudentDTO> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<StudentDTO> hits = elasticsearchTemplate
            .search(nativeSearchQuery, StudentDTO.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, StudentDTO.class).getTotalHits());
    }
}
