package com.aladin.repository.search;

import com.aladin.domain.Exams;
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

public interface ExamsSearchRepository extends ElasticsearchRepository<Exams, Long>, ExamsSearchRepositoryInternal {}

interface ExamsSearchRepositoryInternal {
    Page<Exams> search(String query, Pageable pageable);
}

class ExamsSearchRepositoryInternalImpl implements ExamsSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public ExamsSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Exams> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Exams> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Exams.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
