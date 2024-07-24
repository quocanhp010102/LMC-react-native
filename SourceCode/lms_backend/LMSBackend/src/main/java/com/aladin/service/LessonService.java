package com.aladin.service;

import com.aladin.domain.Department;
import com.aladin.domain.Lesson;
import com.aladin.domain.User;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.LessonRepository;

import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.LessonSearchRepository;
import org.hibernate.procedure.spi.ParameterRegistrationImplementor;
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
 * Service Implementation for managing {@link Lesson}.
 */
@Service
@Transactional
public class LessonService {

    private final Logger log = LoggerFactory.getLogger(LessonService.class);

    private final LessonRepository lessonRepository;

    private final LessonSearchRepository lessonSearchRepository;

    private final KafkaSendNotification kafkaSendNotification;

    public LessonService(LessonRepository lessonRepository,
                         KafkaSendNotification kafkaSendNotification,
                         LessonSearchRepository lessonSearchRepository) {
        this.lessonRepository = lessonRepository;
        this.lessonSearchRepository = lessonSearchRepository;
        this.kafkaSendNotification = kafkaSendNotification;
    }

    /**
     * Save a lesson.
     *
     * @param lesson the entity to save.
     * @return the persisted entity.
     */
    public Lesson save(Lesson lesson, User user) {
        log.debug("Request to save Lesson : {}", lesson);
        Lesson result = lessonRepository.save(lesson);
        return result;
    }

    /**
     * Partially update a lesson.
     *
     * @param lesson the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Lesson> partialUpdate(Lesson lesson) {
        log.debug("Request to partially update Lesson : {}", lesson);

        return lessonRepository
            .findById(lesson.getId())
            .map(existingLesson -> {
                if (lesson.getLesson_name() != null) {
                    existingLesson.setLesson_name(lesson.getLesson_name());
                }
                if (lesson.getLesson_notification() != null) {
                    existingLesson.setLesson_notification(lesson.getLesson_notification());
                }
                if (lesson.getLesson_content() != null) {
                    existingLesson.setLesson_content(lesson.getLesson_content());
                }
                return existingLesson;
            })
            .map(lessonRepository::save);
//            .map(savedFile -> {
////                lessonSearchRepository.save(savedFile);
//
//                return savedFile;
//            });
    }


    /**
     * Get all the lessons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Lesson> findAll(Pageable pageable) {
        log.debug("Request to get all Lessons");
        return lessonRepository.findAll(pageable);
    }

    /**
     * Get one lesson by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Lesson> findOne(Long id, User user) {
        log.debug("Request to get Lesson : {}", id);
        Lesson lesson = lessonRepository.findOneById(id);
        return lessonRepository.findById(id);
    }

    /**
     * Delete the lesson by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete Lesson : {}", id);
        lessonRepository.deleteLessonByID(id);
    }

    @Transactional(readOnly = true)
    public Page<Lesson> getLessonsByCourse(Long course, Pageable pageable) {
        log.debug("Request to get a page of Lesson by course: ", course);
        log.warn("course_id: "+course);
        return lessonRepository.getLessonByCourseId(course, pageable);
    }

    public List<Lesson> getAllLessonByCourseId(Long courseId){
        return lessonRepository.getAllLessonByCourseId(courseId);
    }
}


