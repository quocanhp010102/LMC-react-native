package com.aladin.repository.search;

import com.aladin.service.dto.TutorialDTO;
import com.aladin.service.dto.TypeOfExamsDTO;
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

public interface TutorialSearchRepositoryDTO extends ElasticsearchRepository<TutorialDTO, Long>,TutorialRepositoryInternal {
}
interface TutorialRepositoryInternal {
    Page<TutorialDTO> search(String query, Pageable pageable);
}
class TutorialRepositoryInternalImpl implements TutorialRepositoryInternal {
    private final ElasticsearchRestTemplate elasticsearchTemplate;

    TutorialRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }


    @Override
    public Page<TutorialDTO> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<TutorialDTO> hits = elasticsearchTemplate
            .search(nativeSearchQuery, TutorialDTO.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, elasticsearchTemplate.search(nativeSearchQuery, TutorialDTO.class).getTotalHits());
    }
}
