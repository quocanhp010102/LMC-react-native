package com.aladin.repository.search;

import com.aladin.domain.Answers;
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

public interface AnswersSearchRepository extends ElasticsearchRepository<Answers, Long>, AnswersSearchRepositoryInternal {}

interface AnswersSearchRepositoryInternal {
    Page<Answers> search(String query, Pageable pageable);
}

class AnswersSearchRepositoryInternalImpl implements AnswersSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public AnswersSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Answers> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Answers> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Answers.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
