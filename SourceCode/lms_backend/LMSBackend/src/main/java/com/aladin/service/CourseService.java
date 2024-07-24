package com.aladin.service;

import com.aladin.domain.Course;
import com.aladin.domain.FilesOfCourse;
import com.aladin.domain.History;
import com.aladin.domain.User;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.CourseRepository;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.CourseSearchRepository;
import com.aladin.service.dto.CourseDepartmentDTO;
import com.aladin.service.dto.CourseOnlyDTO;
import com.aladin.service.dto.CoursePercentDTO;
import com.aladin.service.dto.CoursesDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final KafkaSendNotification kafkaSendNotification;

    public CourseService(CourseRepository courseRepository,
                         KafkaSendNotification kafkaSendNotification,
                         CourseSearchRepository courseSearchRepository1, UserService userService) {

        this.courseRepository = courseRepository;
        this.kafkaSendNotification = kafkaSendNotification;
        this.courseSearchRepository = courseSearchRepository1;
        this.userService = userService;
    }

    /**
     * Save a course.
     *
     * @param course the entity to save.
     * @return the persisted entity.
     */

    public Course save(Course course, User user) {
        log.debug("Request to save Course : {}", course);
        String method = "";
        if (course.getId() != null) {
            method = "PUT";
        } else {
            method = "POST";
        }
        Course result = courseRepository.save(course);
//        kafkaSendNotification.historyCourse(course,method, user);
        if (method.equals("POST")) {
            kafkaSendNotification.alertCourse(course);
        }
        CoursesDTO coursesDTO = new CoursesDTO(result);
        courseSearchRepository.save(coursesDTO);
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
                if (course.getCourseDescription() != null) {
                    existingCourse.setCourseDescription(course.getCourseDescription());
                }
                if (course.getCourseCreatedDate() != null) {
                    existingCourse.setCourseCreatedDate(course.getCourseCreatedDate());
                }
                if (course.getCourseImage() != null) {
                    existingCourse.setCourseImage(course.getCourseImage());
                }


                return existingCourse;
            })
            .map(courseRepository::save);
//            .map(savedCourse -> {
//                courseSearchRepository.save(savedCourse);
//                return savedCourse;
//            });
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
    @Transactional(readOnly = true)
    public Optional<Course> findOne(Long id, User user) {
        log.debug("Request to get Course : {}", id);
        String method = "GET";
        log.debug("courese_id: " + id);
        Course result = courseRepository.findOneById(id);
        kafkaSendNotification.historyCourse(result, method, user);
        return courseRepository.findById(id);
    }

    /**
     * Delete the course by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.info("Request to delete Course : {}", id);
        courseRepository.deleteById(id);
        courseSearchRepository.deleteById(id);
    }

    /**
     * Search for the course corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CoursesDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Courses for query {}", query);
        return courseSearchRepository.search(query, pageable);
    }

    public int countCourseByDepartment(Long department) {
        return courseRepository.countCourseByDepartment(department);
    }

    @Transactional(readOnly = true)
    public Page<CoursePercentDTO> getAllCourseByCurrentStudent(Long student_id, Pageable pageable) {
        log.debug("Request to get a page of getAllCourseByStudentID by student: ", student_id);
        return courseRepository.getCourseByCurrentStudent(student_id, pageable);
    }


    @Transactional(readOnly = true)
    public Page<Course> getAllCourseByDepartment(Long department_id, Pageable pageable) {
        log.debug("Request to get a page of getAllCourseByDepartment by department: ", department_id);
        return courseRepository.getCourseByDepartment(department_id, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Course> getCourseByDepartmentAndName(Long department_id, String courseName, Pageable pageable) {
        log.debug("Request to get a page of getAllCourseByDepartment by department: ", department_id);
        return courseRepository.getCourseByDepartmentAndName(department_id, courseName, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Course> getAllCourseByLecturer(Long lecturer_id, Pageable pageable) {
        log.debug("Request to get a page of getAllCourseByLecturer by lecturer: ", lecturer_id);
        return courseRepository.getCourseByLecturer(lecturer_id, pageable);
    }

    public void deleteCourseByDepartment(Long department_id) {
        log.debug("Request to deleteCourseByDepartment : {}", department_id);
        courseRepository.deleteCourseByDepartment(department_id);
    }

    public Page<CourseOnlyDTO> getCoursesByLectureId(Long id, Pageable pageable) {
        log.debug("Request to getCoursesByLectureId : {}", id);
        return courseRepository.getCoursesByLectureId(id, pageable);
    }

    public Page<CourseDepartmentDTO> getCourseDetailByDepartment(Long department_id, Pageable pageable) {
        log.debug("Request to getCourseDetailByDepartment : {}", department_id);
        return courseRepository.getCourseDetailByDepartment(department_id, pageable);
    }

    public Page<CourseDepartmentDTO> getCourseDetailByDepartmentAndName(Long department_id, String courseName, Pageable pageable) {
        log.debug("Request to getCourseDetailByDepartmentAndName : {}", department_id);
        return courseRepository.getCourseDetailByDepartmentAndName(department_id, courseName, pageable);
    }

    public Page<CourseOnlyDTO> getCoursesByLectureIdAndCourseName(Long id, String course_name, Pageable pageable) {
        log.debug("Request to getCoursesByLectureIdAndCourseName : {}", id);
        return courseRepository.getCoursesByLectureIdAndCourseName(id, course_name, pageable);
    }

    @Transactional
    public void deleteAnswerWhereIdIn(String id) {
        courseRepository.PROC_DELTE_MORE_COURSE(id);
    }

    public Page<CourseOnlyDTO> getCoursesByLectureIdAllField(Long id, Long courseId, String param, LocalDate date, Pageable pageable) {
        return courseRepository.getCoursesByLectureIdAllField(id, courseId, param, date, pageable);
    }


}
