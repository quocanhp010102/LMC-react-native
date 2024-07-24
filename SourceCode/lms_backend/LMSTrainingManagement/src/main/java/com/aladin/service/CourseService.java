package com.aladin.service;

import com.aladin.domain.Course;
import com.aladin.domain.History;
import com.aladin.domain.User;
import com.aladin.repository.CourseRepository;
import com.aladin.repository.search.CourseSearchRepository;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.service.ultil.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Course}.
 */
@Service
@Transactional
public class CourseService {

    private final Logger log = LoggerFactory.getLogger(CourseService.class);

    private final CourseRepository courseRepository;

    private final CourseSearchRepository courseSearchRepository;

    private final UserService userService;

    private final HistoryService historyService;

    public CourseService(CourseRepository courseRepository, CourseSearchRepository courseSearchRepository, UserService userService, HistoryService historyService) {
        this.courseRepository = courseRepository;
        this.courseSearchRepository = courseSearchRepository;
        this.userService = userService;
        this.historyService = historyService;
    }

    /**
     * Save a course.
     *
     * @param course the entity to save.
     * @return the persisted entity.
     */
    public Course save(Course course) {
        log.debug("Request to save Course : {}", course);
        Course result = new Course();
        if(course.getId()!=null){
            saveHistory(course, Constant.METHOD_PUT);
            result=  courseRepository.save(course);
        }else{
            result=  courseRepository.save(course);
            saveHistory(result, Constant.METHOD_POST);
        }


//       courseSearchRepository.save(result);
        return result;
    }

    /**
     * Partially update a course.
     *
     * @param course the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Course> partialUpdate(Course course) {
        log.debug("Request to partially update Course : {}", course);

        return courseRepository
            .findById(course.getId())
            .map(existingCourse -> {
                if (course.getCourseNotification() != null) {
                    existingCourse.setCourseNotification(course.getCourseNotification());
                }
                if (course.getCourseName() != null) {
                    existingCourse.setCourseName(course.getCourseName());
                }

                return existingCourse;
            })
            .map(courseRepository::save)
            .map(savedCourse -> {
                courseSearchRepository.save(savedCourse);
                saveHistory(savedCourse,Constant.METHOD_PUT);
                return savedCourse;
            });
    }

    /**
     * Get all the courses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Course> findAll(Pageable pageable) {
        log.debug("Request to get all Courses");
        return courseRepository.findAll(pageable);
    }

    /**
     * Get one course by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional
    public Optional<Course> findOne(Long id) {
        log.debug("Request to get Course : {}", id);
        Course result = courseRepository.findOneById(id);
//        saveHistory(result,Constant.METHOD_GET);
        return courseRepository.findById(id);
    }

    /**
     * Delete the course by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Course : {}", id);
        courseRepository.deleteById(id);
//        courseSearchRepository.deleteById(id);
    }

    /**
     * Search for the course corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Course> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Courses for query {}", query);
        return courseSearchRepository.search(query, pageable);
    }

    public void updateWhenAddExams( Long courseId){
        log.debug("Request to update ưhen add exams {}", courseId);
        courseRepository.updateWhenAddExams(courseId);
    }


    public Course findOneByExamsId(Long examsId){
        String ob = courseRepository.findOneByExamsId(examsId);
        String[] parts = ob.split(",");
        Course course = new Course();
        course.setId((Long.valueOf(parts[0])));
        course.setCourseName( parts[1]);
        return  course;
    }

    public Course getOneById(Long id){
        String ob = courseRepository.getOneById(id);
        String[] parts = ob.split(",");
        Course course = new Course();
        course.setId((Long.valueOf(parts[0])));
        course.setCourseName( parts[1]);
        return  course;
    }

    public Course findOneById(Long id){
        return courseRepository.findOneById(id);
    }

    public int countCourseByDepartment(Long deoartment){
        return courseRepository.countCourseByDepartment(deoartment);
    }

    public void saveHistory(Course course, String method){
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
        sbActivityHistoryName.append(course.getCourseName());
        History history = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        history.setHistoryTime(sdf.format(new Date()));
        history.setHistoryName(sbActivityHistoryName.toString());
//        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        User user = userService.findOneByLogin("maitinhtiep");
        history.setUser(user);
        history.setCourse(course);
//        historyService.save(history);
    }
}
