package com.aladin.repository.search;

import com.aladin.domain.Questions;
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

public interface QuestionsSearchRepository extends ElasticsearchRepository<Questions, Long>, QuestionsSearchRepositoryInternal {}

interface QuestionsSearchRepositoryInternal {
    Page<Questions> search(String query, Pageable pageable);
}

class QuestionsSearchRepositoryInternalImpl implements QuestionsSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public QuestionsSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Questions> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Questions> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Questions.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
