package com.aladin.repository;

import com.aladin.domain.Answers;
import com.aladin.domain.Questions;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Spring Data SQL repository for the Answers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnswersRepository extends JpaRepository<Answers, Long> {

//    @Query(value = "DELETE FORM answers WHERE id in (:lstId)",nativeQuery = true)
//    void deleteAllBylstId(@Param("lstId") List<Long> lstId);

    @Query(value = "select NVL(sum(answers_point),'0') from answers where id in(:lstIdAnswersSelected) and answers_status =1 ", nativeQuery = true)
    Double caculatePoint(@Param("lstIdAnswersSelected") List<Long> lstId);

    Set<Answers> findAnswersByQuestions(Questions questions);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM answers WHERE id IN(\n" +
        "(SELECT to_number(column_value) AS IDs FROM xmltable(:ids))\n" +
        ")", nativeQuery = true)
    void deleteMultiByIds(@Param("ids") String ids);
}
