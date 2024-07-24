package com.aladin.repository.search;

import com.aladin.domain.NotiReceiver;
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

public interface NotiReceiverSearchRepository extends ElasticsearchRepository<NotiReceiver, Long>, NotiReceiverSearchRepositoryInternal {}

interface NotiReceiverSearchRepositoryInternal {
    Page<NotiReceiver> search(String query, Pageable pageable);
}

class NotiReceiverSearchRepositoryInternalImpl implements NotiReceiverSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public NotiReceiverSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<NotiReceiver> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<NotiReceiver> hits = elasticsearchTemplate
            .search(nativeSearchQuery, NotiReceiver.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
