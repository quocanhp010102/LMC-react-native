package com.aladin.repository.search;

import com.aladin.domain.QuestionAndAnswer;
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

public interface QuestionAndAnswerSearchRepository extends ElasticsearchRepository<QuestionAndAnswer, Long>,QuestionAndAnswerSearchRepositoryInternal{
}

interface QuestionAndAnswerSearchRepositoryInternal {
    Page<QuestionAndAnswer> search(String query, Pageable pageable);
}

class QuestionAndAnswerSearchRepositoryInternalImpl implements QuestionAndAnswerSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    QuestionAndAnswerSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<QuestionAndAnswer> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<QuestionAndAnswer> hits = elasticsearchTemplate
            .search(nativeSearchQuery, QuestionAndAnswer.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
