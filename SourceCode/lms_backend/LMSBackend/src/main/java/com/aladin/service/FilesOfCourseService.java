package com.aladin.service;

import com.aladin.domain.CourseStudent;
import com.aladin.domain.FilesOfCourse;
import com.aladin.repository.FilesOfCourseRepository;
import java.util.Optional;

import com.aladin.repository.search.FilesOfCourseSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FilesOfCourse}.
 */
@Service
@Transactional
public class FilesOfCourseService {

    private final Logger log = LoggerFactory.getLogger(FilesOfCourseService.class);

    private final FilesOfCourseRepository filesOfCourseRepository;

    private final FilesOfCourseSearchRepository filesOfCourseSearchRepository;

    public FilesOfCourseService(FilesOfCourseRepository filesOfCourseRepository, FilesOfCourseSearchRepository filesOfCourseSearchRepository) {
        this.filesOfCourseRepository = filesOfCourseRepository;
        this.filesOfCourseSearchRepository = filesOfCourseSearchRepository;
    }

    /**
     * Save a filesOfCourse.
     *
     * @param filesOfCourse the entity to save.
     * @return the persisted entity.
     */

    public FilesOfCourse save(FilesOfCourse filesOfCourse) {
        log.debug("Request to save FilesOfCourse : {}", filesOfCourse);
        FilesOfCourse result= filesOfCourseRepository.save(filesOfCourse);
//        filesOfCourseSearchRepository.save(result);
        return result;
    }

    /**
     * Partially update a filesOfCourse.
     *
     * @param filesOfCourse the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FilesOfCourse> partialUpdate(FilesOfCourse filesOfCourse) {
        log.debug("Request to partially update FilesOfCourse : {}", filesOfCourse);

        return filesOfCourseRepository
            .findById(filesOfCourse.getId())
            .map(existingFilesOfCourse -> {
                if (filesOfCourse.getFileOfCoursePath() != null) {
                    existingFilesOfCourse.setFileOfCoursePath(filesOfCourse.getFileOfCoursePath());
                }

                return existingFilesOfCourse;
            })
            .map(filesOfCourseRepository::save)
            .map(savedFile -> {
                filesOfCourseSearchRepository.save(savedFile);

                return savedFile;
            });
    }

    /**
     * Get all the filesOfCourses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FilesOfCourse> findAll(Pageable pageable) {
        log.debug("Request to get all FilesOfCourses");
        return filesOfCourseRepository.findAll(pageable);
    }

    /**
     * Get one filesOfCourse by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FilesOfCourse> findOne(Long id) {
        log.debug("Request to get FilesOfCourse : {}", id);
        return filesOfCourseRepository.findById(id);
    }

    /**
     * Delete the filesOfCourse by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete FilesOfCourse : {}", id);
        filesOfCourseRepository.deleteFilesOfCourseByCourse(id);
    }

    /**
     * Search for the filesOfCourse corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FilesOfCourse> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of FilesOfCourses for query {}", query);
        return filesOfCourseSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public Page<FilesOfCourse> getFilesOfCourseByCourse(Long course, Pageable pageable) {
        log.debug("Request to get a page of FilesOfCourses by course: ", course);
        return filesOfCourseRepository.getFilesOfCourseByCourse(course, pageable);
    }

    public void deleteFilesOfCourseByCourse(Long course_id) {
        log.debug("Request to deleteFilesOfCourseByCourse : {}", course_id);
        filesOfCourseRepository.deleteFilesOfCourseByCourse(course_id);
    }


}
