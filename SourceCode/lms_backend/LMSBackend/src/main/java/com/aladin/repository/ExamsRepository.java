package com.aladin.repository;

import com.aladin.domain.Exams;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the Exams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExamsRepository extends JpaRepository<Exams, Long> {

//    @Query(value = "SELECT * FROM exams WHERE id=:id", nativeQuery = true)
    Exams findOneById(@Param("id") Long id);

    @Query(value = "SELECT * FROM exams WHERE course_id = :id", nativeQuery = true)
    List<Exams> findAllByCourseId(@Param("id") Long id);

    @Query(value = "SELECT exam_total_student_submitted FROM exams e WHERE e.id=:id", nativeQuery = true)
    Long getTotalStudentSubmittedById(@Param("id") Long id);

    @Query(value = "UPDATE exams SET exam_total_student_submitted = :totalStudent WHERE id= :id", nativeQuery = true)
    @Transactional
    @Modifying
    void upDateTotalStudentSubmitedById(@Param("totalStudent") Long totalStudent ,@Param("id") Long id);

}
