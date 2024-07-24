package com.aladin.repository.search;

import com.aladin.domain.Lesson;
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

public interface LessonSearchRepository extends ElasticsearchRepository<Lesson, Long>, LessonSearchRepositoryInternal {}

interface LessonSearchRepositoryInternal {
    Page<Lesson> search(String query, Pageable pageable);
}

class LessonSearchRepositoryInternalImpl implements LessonSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public LessonSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Lesson> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Lesson> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Lesson.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
