package com.aladin.repository.search;

import com.aladin.domain.Admin;
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

public interface AdminSearchRepository extends ElasticsearchRepository<Admin, Long>, AdminSearchRepositoryInternal {
}

interface AdminSearchRepositoryInternal {
    Page<Admin> search(String query, Pageable pageable);
}

class AdminSearchRepositoryInternalImpl implements AdminSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public AdminSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }


    @Override
    public Page<Admin> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Admin> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Admin.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, Admin.class).getTotalHits());
    }
}
