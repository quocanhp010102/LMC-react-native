package com.aladin.repository;

import com.aladin.domain.Exams;
import com.aladin.domain.Questions;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Spring Data SQL repository for the Questions entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionsRepository extends JpaRepository<Questions, Long> {


    List<Questions> findAllByExams(Exams exams);

    Set<Questions> findQuestionsByExams(Exams exams);

    @Transactional
    @Query(value ="SELECT * FROM questions WHERE exams_id =:examsId" ,nativeQuery = true)
    Set<Questions> findAllByExamsId(@Param("examsId") Long examsId );

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM questions WHERE id IN(\n" +
        "(SELECT to_number(column_value) AS IDs FROM xmltable(:ids))\n" +
        ")", nativeQuery = true)
    void deleteMultiByIds(@Param("ids") String ids);
}
