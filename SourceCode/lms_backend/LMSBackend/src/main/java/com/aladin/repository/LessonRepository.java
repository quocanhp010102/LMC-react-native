package com.aladin.repository;

import com.aladin.domain.Department;
import com.aladin.domain.Lesson;
import liquibase.pro.packaged.P;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the Lesson entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
//    @Query(value = "select * from Lesson where course_id=?1", nativeQuery = true)
//    Page<Lesson> getLessonsByCourseId(Long courseId, Pageable pageable);
    Page<Lesson> getLessonByCourseId(Long course_id, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "delete from lesson where id=?1", nativeQuery = true)
    void deleteLessonByID(Long id);

    Lesson findOneById(Long id);

    @Query(value = "SELECT l FROM Lesson l WHERE l.course.id=?1")
    List<Lesson> getAllLessonByCourseId(Long courseId);

}
