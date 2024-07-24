package com.aladin.repository.search;

import com.aladin.domain.Course;
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

public interface CourseSearchRepository extends ElasticsearchRepository<Course, Long>, CourseSearchRepositoryInternal {}

interface CourseSearchRepositoryInternal {
    Page<Course> search(String query, Pageable pageable);
}

class CourseSearchRepositoryInternalImpl implements CourseSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public CourseSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Course> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Course> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Course.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
