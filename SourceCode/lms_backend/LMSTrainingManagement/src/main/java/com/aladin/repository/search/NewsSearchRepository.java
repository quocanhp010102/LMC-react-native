package com.aladin.repository.search;

import com.aladin.domain.News;
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

public interface NewsSearchRepository extends ElasticsearchRepository<News, Long>, NewsSearchRepositoryInternal {}

interface NewsSearchRepositoryInternal {
    Page<News> search(String query, Pageable pageable);
}

class NewsSearchRepositoryInternalImpl implements NewsSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public NewsSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<News> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<News> hits = elasticsearchTemplate
            .search(nativeSearchQuery, News.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
