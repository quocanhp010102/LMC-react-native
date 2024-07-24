package com.aladin.repository;

import com.aladin.domain.FilesOfLesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FilesOfLesson entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FilesOfLessonRepository extends JpaRepository<FilesOfLesson, Long> {

    @Query(value = "select * from files_of_lesson where lesson_id=?1", nativeQuery = true)
    Page<FilesOfLesson> getFilesOfLessonByLesson(Long lesson, Pageable pageable);
}
