package com.aladin.repository;

import com.aladin.domain.Authority;
import com.aladin.domain.Tutorial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Spring Data SQL repository for the Tutorial entity.
 */
@SuppressWarnings("unused")
//@Repository
public interface TutorialRepository extends JpaRepository<Tutorial, Long> {

    Tutorial findOneById(Long id);

    @Query(value = " select * from tutorial \n" +
        "        where tutorial.id in(\n" +
        "        select DISTINCT(tutorial_authorities.tutorial_id) from tutorial_authorities\n" +
        "        where tutorial_authorities.authority_name in (:lstAuthorities) \n" +
        "        ) ORDER BY tutorial.tutorial_is_display DESC ,tutorial.tutorial_created_date DESC\n" +
        "        FETCH NEXT 8 ROWS ONLY"
                    ,nativeQuery = true)
    List<Tutorial> findByLstAuthAndLimit(@Param("lstAuthorities") List<String> lstAuthorities);

    @Query(value = "SELECT *FROM tutorial " +
        " ORDER BY tutorial.tutorial_is_display DESC ,tutorial.tutorial_created_date DESC" +
        " FETCH NEXT 8 ROWS ONLY"
        ,nativeQuery = true)
    List<Tutorial> findByLimit();

    @Query(value = "select * from tutorial \n" +
        "        where tutorial.id in(\n" +
        "        select DISTINCT(tutorial_authorities.tutorial_id) from tutorial_authorities\n" +
        "        where tutorial_authorities.authority_name in (:lstAuthorities) \n" +
        "        ) offset :start rows fetch next :limit rows only", nativeQuery = true
        )
    List<Tutorial> findAllByLstAuth(@Param("lstAuthorities") List<String> lstAuthorities,
                                    @Param("start") Long start,
                                    @Param("limit") Integer limit);
    @Query(value = "select count(*) from tutorial \n" +
        "        where tutorial.id in(\n" +
        "        select DISTINCT(tutorial_authorities.tutorial_id) from tutorial_authorities\n" +
        "        where tutorial_authorities.authority_name in (:lstAuthorities) \n" +
        "        )"
        ,nativeQuery = true)
    Long getTotalByLstAuth(@Param("lstAuthorities") List<String> lstAuthorities);

    @Query(value = "SELECT count(*)FROM tutorial inner join tutorial_authorities on tutorial.id=tutorial_authorities.tutorial_id " +
        "WHERE tutorial.tutorial_is_display = :isDisplay and tutorial_authorities.authority_name in ( :lstAuthorities)"
        ,nativeQuery = true)
    Long getTotalByisDisplayAndLstAuth(@Param("isDisplay") String isDisplay,
                                       @Param("lstAuthorities") List<String> lstAuthorities);

    @Query(value = "DELETE FROM tutorial WHERE id in(:ids)",nativeQuery = true)
    void deleteAllByLstId(@Param("ids") List<Long> ids);

    @Modifying
    @Transactional
    @Query(value = "UPDATE tutorial t SET t.tutorial_is_display= :isDisplay WHERE t.id = :id", nativeQuery = true)
    void updateDisplay(@Param("isDisplay") String isDisplay,@Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tutorial WHERE id IN(\n" +
        "(SELECT to_number(column_value) AS IDs FROM xmltable(:ids))\n" +
        ")", nativeQuery = true)
    void deleteMultiByIds(@Param("ids") String ids);

    @Query("FROM Tutorial t ORDER BY t.id DESC")
    Page<Tutorial> findAllAndOrderById(Pageable pageable);

    @Query(value = "select * from tutorial where id in(\n" +
        "SELECT TUTORIAL_ID\n" +
        "FROM tutorial_authorities\n" +
        "GROUP BY TUTORIAL_ID\n" +
        "HAVING COUNT(*) = 2\n" +
        ")and tutorial_is_display =1 and rownum <=8", nativeQuery = true)
    List<Tutorial> findAllByIsDisplayAndAllUser();

}
