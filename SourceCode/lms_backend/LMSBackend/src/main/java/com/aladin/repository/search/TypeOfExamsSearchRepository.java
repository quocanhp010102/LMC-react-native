package com.aladin.repository.search;

import com.aladin.domain.TypeOfExams;
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

public interface TypeOfExamsSearchRepository extends ElasticsearchRepository<TypeOfExams, Long>, TypeOfExamsSearchRepositoryInternal {}

interface TypeOfExamsSearchRepositoryInternal {
    Page<TypeOfExams> search(String query, Pageable pageable);
}

class TypeOfExamsSearchRepositoryInternalImpl implements TypeOfExamsSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public TypeOfExamsSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<TypeOfExams> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<TypeOfExams> hits = elasticsearchTemplate
            .search(nativeSearchQuery, TypeOfExams.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}