package com.aladin.repository.search;

import com.aladin.domain.Lesson;
import com.aladin.service.dto.LessonDTO;
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

public interface LessonSearchRepositoryDTO extends ElasticsearchRepository<LessonDTO, Long>,LessonSearchRepositoryDTOInternal {
}
interface LessonSearchRepositoryDTOInternal {
    Page<LessonDTO> search(String query, Pageable pageable);
}
class LessonSearchRepositoryDTOInternalImpl implements LessonSearchRepositoryDTOInternal {
    private final ElasticsearchRestTemplate elasticsearchTemplate;

    LessonSearchRepositoryDTOInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<LessonDTO> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<LessonDTO> hits = elasticsearchTemplate
            .search(nativeSearchQuery, LessonDTO.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
