package com.aladin.repository.search;

import com.aladin.domain.ExamsHistory;
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

public interface ExamsHistorySearchRepository extends ElasticsearchRepository<ExamsHistory, Long>, ExamsHistorySearchRepositoryInternal {}

interface ExamsHistorySearchRepositoryInternal {
    Page<ExamsHistory> search(String query, Pageable pageable);
}

class ExamsHistorySearchRepositoryInternalImpl implements ExamsHistorySearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public ExamsHistorySearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<ExamsHistory> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<ExamsHistory> hits = elasticsearchTemplate
            .search(nativeSearchQuery, ExamsHistory.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
