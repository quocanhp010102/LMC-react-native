package com.aladin.repository.search;

import com.aladin.domain.Tutorial;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

public interface TutorialSearchRepository extends ElasticsearchRepository<Tutorial, Long>, TutorialSearchRepositoryInternal {}

interface TutorialSearchRepositoryInternal {
    Page<Tutorial> search(String query, Pageable pageable);
}

class TutorialSearchRepositoryInternalImpl implements TutorialSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public TutorialSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Tutorial> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQueryBuilder()
            .withQuery(multiMatchQuery(query)
                .field("tutorial_title")
                .type(MultiMatchQueryBuilder.Type.PHRASE_PREFIX)).build();
        nativeSearchQuery.setPageable(pageable);
        List<Tutorial> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Tutorial.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
