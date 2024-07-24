package com.aladin.repository;

import com.aladin.domain.StudentLesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentLessonRepository extends JpaRepository<StudentLesson, Long> {
    @Query
    Optional<StudentLesson> findStudentLessonById(Long id);

    @Query(value = "select count(*) from student_lesson where student_id=?1 and lesson_id=?2 ", nativeQuery = true)
    int countStudentInStudentLesson(Long student_id, Long lesson_id);

    @Query
    Page<StudentLesson> findStudentLessonByStudentIdAndLessonId(Pageable pageable, Long studentId, Long lessonId);

    @Query(value = "SELECT s.id FROM Student s where s.user.id=?1")
    Long getStudentId(String id);

    @Procedure
    void FN_LESSONCALCULATE(int courseId,int studentId);
}
