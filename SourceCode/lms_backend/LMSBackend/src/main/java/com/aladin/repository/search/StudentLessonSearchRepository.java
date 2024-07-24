package com.aladin.repository.search;

import com.aladin.domain.StudentLesson;
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

public interface StudentLessonSearchRepository extends ElasticsearchRepository<StudentLesson, Long>, StudentLessonSearchRepositoryInternal {}

interface StudentLessonSearchRepositoryInternal {
    Page<StudentLesson> search(String query, Pageable pageable);
}

class StudentLessonSearchRepositoryInternalImpl implements StudentLessonSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    StudentLessonSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<StudentLesson> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<StudentLesson> hits = elasticsearchTemplate
            .search(nativeSearchQuery, StudentLesson.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}