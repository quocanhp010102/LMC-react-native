package com.aladin.repository.search;

import com.aladin.domain.CourseStudent;
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

public interface CourseStudentSearchRepository extends ElasticsearchRepository<CourseStudent, Long>, CourseStudentSearchRepositoryInternal {}

interface CourseStudentSearchRepositoryInternal {
    Page<CourseStudent> search(String query, Pageable pageable);
}

class CourseStudentSearchRepositoryInternalImpl implements CourseStudentSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    CourseStudentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<CourseStudent> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<CourseStudent> hits = elasticsearchTemplate
            .search(nativeSearchQuery, CourseStudent.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
