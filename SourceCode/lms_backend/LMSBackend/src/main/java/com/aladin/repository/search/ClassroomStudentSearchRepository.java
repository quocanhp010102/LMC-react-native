package com.aladin.repository.search;

import com.aladin.domain.ClassroomStudent;
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

public interface ClassroomStudentSearchRepository extends ElasticsearchRepository<ClassroomStudent, Long>, ClassroomStudentSearchRepositoryInternal {
}
interface ClassroomStudentSearchRepositoryInternal {
    Page<ClassroomStudent> search(String query, Pageable pageable);
}
class ClassroomStudentSearchRepositoryInternalImpl implements ClassroomStudentSearchRepositoryInternal {
    private final ElasticsearchRestTemplate elasticsearchTemplate;

    ClassroomStudentSearchRepositoryInternalImpl(ElasticsearchRestTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Override
    public Page<ClassroomStudent> search(String query, Pageable pageable) {
        NativeSearchQuery nativeSearchQuery = new NativeSearchQuery(queryStringQuery(query));
        nativeSearchQuery.setPageable(pageable);
        List<ClassroomStudent> hits = elasticsearchTemplate
            .search(nativeSearchQuery, ClassroomStudent.class)
            .map(SearchHit::getContent)
            .stream()
            .collect(Collectors.toList());

        return new PageImpl<>(hits, pageable, hits.size());
    }
}
