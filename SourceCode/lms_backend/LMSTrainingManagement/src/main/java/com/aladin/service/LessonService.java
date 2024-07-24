package com.aladin.service;

import com.aladin.domain.History;
import com.aladin.domain.Lesson;
import com.aladin.domain.User;
import com.aladin.repository.LessonRepository;
import com.aladin.repository.search.LessonSearchRepository;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.service.ultil.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Lesson}.
 */
@Service
@Transactional
public class LessonService {

    private final Logger log = LoggerFactory.getLogger(LessonService.class);

    private final LessonRepository lessonRepository;

    private final LessonSearchRepository lessonSearchRepository;

    private final HistoryService historyService;

    private final UserService userService;

    public LessonService(LessonRepository lessonRepository, LessonSearchRepository lessonSearchRepository, HistoryService historyService, UserService userService) {
        this.lessonRepository = lessonRepository;
        this.lessonSearchRepository = lessonSearchRepository;
        this.historyService = historyService;
        this.userService = userService;
    }

//    public LessonService(LessonRepository lessonRepository, LessonSearchRepository lessonSearchRepository, UserService userService) {
//        this.lessonRepository = lessonRepository;
//        this.lessonSearchRepository = lessonSearchRepository;
//        this.userService = userService;
//    }

    /**
     * Save a lesson.
     *
     * @param lesson the entity to save.
     * @return the persisted entity.
     */
    public Lesson save(Lesson lesson) {
        log.debug("Request to save Lesson : {}", lesson);
        Lesson result = new Lesson();
        if(lesson.getId()!=null ){
            saveHistory( lesson, Constant.METHOD_PUT);
            result = lessonRepository.save(lesson);
        }else{
            result = lessonRepository.save(lesson);
            saveHistory( result, Constant.METHOD_POST);
        }

//        lessonSearchRepository.save(lesson);

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
//                if (lesson.getLesson_images() != null) {
//                    existingLesson.setLesson_images(lesson.getLesson_images());
//                }
                if (lesson.getLesson_file() != null) {
                    existingLesson.setLesson_file(lesson.getLesson_file());
                }
//                saveActivityHistory(existingLesson,Constant.METHOD_PUT);
                return existingLesson;
            })
            .map(lessonRepository::save);
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
    @Transactional
    public Optional<Lesson> findOne(Long id) {
        log.debug("Request to get Lesson : {}", id);
        Lesson lesson = lessonRepository.findOneById(id);
//        saveActivityHistory(lesson,Constant.METHOD_GET);
        return lessonRepository.findById(id);
    }

    /**
     * Delete the lesson by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Lesson : {}", id);
        lessonRepository.deleteById(id);
//        lessonSearchRepository.deleteById(id);
    }

    /**
     * Search for the lesson corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Lesson> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Lessons for query {}", query);
        return lessonSearchRepository.search(query, pageable);
    }


    public void saveHistory(Lesson lesson, String method){
        StringBuilder sbActivityHistoryName= new StringBuilder();
        switch (method){
            case "POST":{
                sbActivityHistoryName.append("Thêm mới: ");
                break;
            }
            case  "PUT": {
                sbActivityHistoryName.append("Cập nhập: ");
                break;
            }
            case  "GET": {
                break;
            }
            case "DELETE": {
                sbActivityHistoryName.append("Xoá: ");
                break;
            }
        }
        sbActivityHistoryName.append(lesson.getLesson_name());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sbActivityHistoryName.toString());
//        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        User user = userService.findOneByLogin("maitinhtiep");
        activityHistory.setUser(user);
        activityHistory.setLesson(lesson);
//        historyService.save(activityHistory);
    }
}
