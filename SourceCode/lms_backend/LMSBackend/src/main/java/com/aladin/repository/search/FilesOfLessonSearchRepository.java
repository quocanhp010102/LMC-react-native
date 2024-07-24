package com.aladin.repository.search;

import com.aladin.domain.FilesOfLesson;
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

public interface FilesOfLessonSearchRepository extends ElasticsearchRepository<FilesOfLesson, Long>, FilesOfLessonSearchRepositoryInternal {}
interface FilesOfLessonSearchRepositoryInternal {
    Page<FilesOfLesson> search(String query, Pageable pageable);
}

class FilesOfLessonSearchRepositoryInternalImpl implements FilesOfLessonSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    FilesOfLessonSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<FilesOfLesson> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<FilesOfLesson> hits = elasticsearchTemplate
            .search(nativeSearchQuery, FilesOfLesson.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
