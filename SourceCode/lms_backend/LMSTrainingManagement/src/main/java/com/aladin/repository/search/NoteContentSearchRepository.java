package com.aladin.repository.search;

import com.aladin.domain.NoteContent;
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

public interface NoteContentSearchRepository extends ElasticsearchRepository<NoteContent, Long>, NoteContentSearchRepositoryInternal {}

interface NoteContentSearchRepositoryInternal {
    Page<NoteContent> search(String query, Pageable pageable);
}

class NoteContentSearchRepositoryInternalImpl implements NoteContentSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public NoteContentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<NoteContent> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<NoteContent> hits = elasticsearchTemplate
            .search(nativeSearchQuery, NoteContent.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
