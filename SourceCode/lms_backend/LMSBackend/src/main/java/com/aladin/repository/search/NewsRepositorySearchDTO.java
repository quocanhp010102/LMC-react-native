package com.aladin.repository.search;

import com.aladin.domain.Course;
import com.aladin.domain.Department;
import com.aladin.service.dto.NewsDTO;
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

public interface NewsRepositorySearchDTO extends ElasticsearchRepository<NewsDTO, Long>, NewsSearchRepositoryInternal {
}
interface NewsSearchRepositoryInternal {
    Page<NewsDTO> search(String query, Pageable pageable);
}
class NewsSearchRepositoryInternalImpl implements NewsSearchRepositoryInternal {
    private final ElasticsearchRestTemplate elasticsearchTemplate;

    NewsSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<NewsDTO> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQueryBuilder()
            .withQuery(multiMatchQuery(query)
                .field("news_title")
                .field("news_content")
                .field("news_description")
                .type(MultiMatchQueryBuilder.Type.PHRASE_PREFIX)).build();
        nativeSearchQuery.setPageable(pageable);
        List<NewsDTO> hits = elasticsearchTemplate
            .search(nativeSearchQuery, NewsDTO.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, NewsDTO.class).getTotalHits());
    }
}
