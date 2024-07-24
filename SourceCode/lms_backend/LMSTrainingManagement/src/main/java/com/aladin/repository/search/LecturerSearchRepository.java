package com.aladin.repository.search;

import com.aladin.domain.Lecturer;
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

public interface LecturerSearchRepository extends ElasticsearchRepository<Lecturer, Long>, LecturerSearchRepositoryInternal {}

interface LecturerSearchRepositoryInternal {
    Page<Lecturer> search(String query, Pageable pageable);
}

class LecturerSearchRepositoryInternalImpl implements LecturerSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public LecturerSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Lecturer> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Lecturer> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Lecturer.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
