package com.aladin.repository;

import com.aladin.domain.Exams;
import com.aladin.domain.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the News entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query(value = "SELECT * FROM news WHERE news_is_display= :isDisplay AND rownum <= 5",nativeQuery = true)
    List<News> findAllByIsDisplay(@Param("isDisplay") Long isDisplay);

    @Query(value = "SELECT * FROM (SELECT * FROM news  where id not in (:lstNewsId) ORDER BY dbms_random.value) WHERE rownum <= :totalNews ",nativeQuery = true)
    List<News> getRandomNews(@Param("lstNewsId") List<Long> lstNewsId, @Param("totalNews") Long totalNews);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM news WHERE id IN(\n" +
        "(SELECT to_number(column_value) AS IDs FROM xmltable(:ids))\n" +
        ")", nativeQuery = true)
    void deleteMultiByIds(@Param("ids") String ids);

    News findOneById(Long id);

    @Query(value = "select * from (select * from news order by news_created_date desc) tbn order by tbn.news_is_display desc offset :start rows fetch next :limit rows only", nativeQuery = true)
    List<News> getAllSortByCreatedDateAndIsDisplay(@Param("start") Long start, @Param("limit") Integer limit);

    @Query(value = "select count(*) from news", nativeQuery = true)
    Long totalNews();

    @Modifying
    @Transactional
    @Query(value = "UPDATE news n SET news_is_display= :isDisplay WHERE n.id = :id", nativeQuery = true)
    void updateDisplay(@Param("isDisplay") String isDisplay,@Param("id") Long id);

    @Query(value = "select * from news n order by n.news_is_display desc ,n.news_created_date desc FETCH NEXT 5 ROWS ONLY ", nativeQuery = true)
    List<News> getLimitByIsDisplayAndDisplayDate();

    @Query(value = "SELECT * FROM news WHERE  UPPER (NEWS_TITLE) like UPPER( '%'||:query||'%');", nativeQuery = true)
    List<News> searchAllTitle(@Param("query") String query);
}
