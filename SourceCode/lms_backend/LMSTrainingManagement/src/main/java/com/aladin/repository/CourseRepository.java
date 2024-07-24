package com.aladin.repository;

import com.aladin.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the Course entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query(value = "select count(*) from Course where department_id= ?1", nativeQuery = true)
    int countCourseByDepartment(Long department);

    @Query(value = "SELECT * FROM course WHERE id =:id",nativeQuery = true)
    Course findOneById(@Param("id") Long id);

    @Query(value = "SELECT c.id, c.COURSE_NAME FROM course c WHERE id = (select course_id from exams e where e.id =:examsId)",nativeQuery = true)
    String findOneByExamsId(@Param("examsId") Long examsId);

    @Query(value = "SELECT c.id, c.COURSE_NAME FROM course c WHERE id = :id",nativeQuery = true)
    String getOneById(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query(value = "update course set course_total_exams = ((select NVL(course_total_exams,0) from course where id =:courseId)+1) where id =:courseId", nativeQuery = true)
    void updateWhenAddExams(@Param("courseId") Long courseId);
}
