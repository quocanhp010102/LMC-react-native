package com.aladin.repository.search;

import com.aladin.domain.Classroom;
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

public interface ClassroomSearchRepository extends ElasticsearchRepository<Classroom, Long>, ClassroomSearchRepositoryInternal {}

interface ClassroomSearchRepositoryInternal {
    Page<Classroom> search(String query, Pageable pageable);
}

class ClassroomSearchRepositoryInternalImpl implements ClassroomSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public ClassroomSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Classroom> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Classroom> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Classroom.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
