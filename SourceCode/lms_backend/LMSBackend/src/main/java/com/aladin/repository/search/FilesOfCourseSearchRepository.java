package com.aladin.repository.search;

import com.aladin.domain.FilesOfCourse;
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

public interface FilesOfCourseSearchRepository extends ElasticsearchRepository<FilesOfCourse, Long>, FilesOfCourseSearchRepositoryInternal {}
interface FilesOfCourseSearchRepositoryInternal {
    Page<FilesOfCourse> search(String query, Pageable pageable);
}

class FilesOfCourseSearchRepositoryInternalImpl implements FilesOfCourseSearchRepositoryInternal {

    private final ElasticsearchRestTemplate elasticsearchTemplate;

    FilesOfCourseSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<FilesOfCourse> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<FilesOfCourse> hits = elasticsearchTemplate
            .search(nativeSearchQuery, FilesOfCourse.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
