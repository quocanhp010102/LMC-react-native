package com.aladin.repository;

import com.aladin.domain.FilesOfCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FilesOfCourse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FilesOfCourseRepository extends JpaRepository<FilesOfCourse, Long> {}
