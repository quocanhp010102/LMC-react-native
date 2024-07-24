package com.aladin.service;

import com.aladin.domain.FilesOfCourse;
import com.aladin.domain.FilesOfLesson;
import com.aladin.repository.FilesOfLessonRepository;

import java.util.Optional;

import com.aladin.repository.search.FilesOfCourseSearchRepository;
import com.aladin.repository.search.FilesOfLessonSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FilesOfLesson}.
 */
@Service
@Transactional
public class FilesOfLessonService {

    private final Logger log = LoggerFactory.getLogger(FilesOfLessonService.class);

    private final FilesOfLessonRepository filesOfLessonRepository;
    private final FilesOfLessonSearchRepository filesOfLessonSearchRepository;

    public FilesOfLessonService(FilesOfLessonRepository filesOfLessonRepository, FilesOfLessonSearchRepository filesOfLessonSearchRepository) {
        this.filesOfLessonRepository = filesOfLessonRepository;
        this.filesOfLessonSearchRepository = filesOfLessonSearchRepository;
    }

    /**
     * Save a filesOfLesson.
     *
     * @param filesOfLesson the entity to save.
     * @return the persisted entity.
     */

    public FilesOfLesson save(FilesOfLesson filesOfLesson) {
        log.debug("Request to save FilesOfLesson : {}", filesOfLesson);
        FilesOfLesson result = filesOfLessonRepository.save(filesOfLesson);
//       filesOfCourseSearchRepository.save(result);
        return result;
    }

    /**
     * Partially update a filesOfLesson.
     *
     * @param filesOfLesson the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FilesOfLesson> partialUpdate(FilesOfLesson filesOfLesson) {
        log.debug("Request to partially update FilesOfLesson : {}", filesOfLesson);

        return filesOfLessonRepository
            .findById(filesOfLesson.getId())
            .map(existingFilesOfLesson -> {
                if (filesOfLesson.getFiles_path() != null) {
                    existingFilesOfLesson.setFiles_path(filesOfLesson.getFiles_path());
                }

                return existingFilesOfLesson;
            })
            .map(filesOfLessonRepository::save)
            .map(savedFile -> {
                filesOfLessonRepository.save(savedFile);

                return savedFile;
            });
    }

    /**
     * Get all the filesOfLessons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FilesOfLesson> findAll(Pageable pageable) {
        log.debug("Request to get all FilesOfLessons");
        return filesOfLessonRepository.findAll(pageable);
    }

    /**
     * Get one filesOfLesson by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FilesOfLesson> findOne(Long id) {
        log.debug("Request to get FilesOfLesson : {}", id);
        return filesOfLessonRepository.findById(id);
    }

    /**
     * Delete the filesOfLesson by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete FilesOfLesson : {}", id);
        filesOfLessonRepository.deleteById(id);
//        filesOfLessonSearchRepository.deleteById(id);
    }

    /**
     * Search for the filesOfLesson corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FilesOfLesson> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of FilesOfLessons for query {}", query);
        return filesOfLessonSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public Page<FilesOfLesson> getFilesOfLessonByLesson(Long lesson, Pageable pageable) {
        log.debug("Request to get a page of getFilesOfLessonByLesson by lesson: ", lesson);
        return filesOfLessonRepository.getFilesOfLessonByLesson(lesson, pageable);
    }
}
