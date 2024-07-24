package com.aladin.repository.search;

import com.aladin.domain.Student;
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

public interface StudentSearchRepository extends ElasticsearchRepository<Student, Long>, StudentSearchRepositoryInternal {
}

interface StudentSearchRepositoryInternal {
    Page<Student> search(String query, Pageable pageable);
}

class StudentSearchRepositoryInternalImpl implements StudentSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public StudentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }


    @Override
    public Page<Student> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Student> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Student.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
