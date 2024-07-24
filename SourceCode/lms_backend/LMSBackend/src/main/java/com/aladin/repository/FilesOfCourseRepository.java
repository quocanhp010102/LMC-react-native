package com.aladin.repository;

import com.aladin.domain.FilesOfCourse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;

/**
 * Spring Data SQL repository for the FilesOfCourse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FilesOfCourseRepository extends JpaRepository<FilesOfCourse, Long> {

    @Query(value = "select * from files_of_course where course_id=?1", nativeQuery = true)
    Page<FilesOfCourse> getFilesOfCourseByCourse(Long course_id, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = "delete from files_of_course where id = ?1", nativeQuery = true)
    void deleteFilesOfCourseByCourse(Long course_id);
}
