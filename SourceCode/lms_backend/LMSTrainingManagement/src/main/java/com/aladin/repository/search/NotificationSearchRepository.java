package com.aladin.repository.search;

import com.aladin.domain.Notification;
import com.aladin.service.dto.NotificationDto;
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

public interface NotificationSearchRepository extends ElasticsearchRepository<NotificationDto, Long>, NotificationSearchRepositoryInternal {}

interface NotificationSearchRepositoryInternal {
    Page<NotificationDto> search(String query, Pageable pageable);
}

class NotificationSearchRepositoryInternalImpl implements NotificationSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public NotificationSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<NotificationDto> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQueryBuilder()
            .withQuery(multiMatchQuery(query)
                .field("notificationTitle")
                .field("notificationContent")
                .type(MultiMatchQueryBuilder.Type.PHRASE_PREFIX)).build();
        nativeSearchQuery.setPageable(pageable);
        List<NotificationDto> hits = elasticsearchTemplate
            .search(nativeSearchQuery, NotificationDto.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, NotificationDto.class).getTotalHits());
    }
}
