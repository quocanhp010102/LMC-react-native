package com.aladin.repository.search;

import com.aladin.domain.Note;
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

public interface NoteSearchRepository extends ElasticsearchRepository<Note, Long>, NoteSearchRepositoryInternal {}

interface NoteSearchRepositoryInternal {
    Page<Note> search(String query, Pageable pageable);
}

class NoteSearchRepositoryInternalImpl implements NoteSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    public NoteSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<Note> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<Note> hits = elasticsearchTemplate
            .search(nativeSearchQuery, Note.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
