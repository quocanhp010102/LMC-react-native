package com.aladin.service;

import com.aladin.domain.CourseStudent;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.CourseStudentRepository;

import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.CourseStudentSearchRepository;
import com.aladin.service.dto.CourseLectureDTO;
import com.aladin.service.dto.CourseManagerDTO;
import com.aladin.service.dto.CoursePercentDTO;
import com.aladin.service.util.AuthenticateUltil;
import liquibase.pro.packaged.co;
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
 * Service Implementation for managing {@link CourseStudent}.
 */
@Service
@Transactional
public class CourseStudentService {

    private final Logger log = LoggerFactory.getLogger(CourseStudentService.class);

    private final CourseStudentRepository courseStudentRepository;
    private final CourseStudentSearchRepository courseStudentSearchRepository;

    private final KafkaSendNotification kafkaSendNotification;

    public CourseStudentService(CourseStudentRepository courseStudentRepository,
                                KafkaSendNotification kafkaSendNotification,
                                CourseStudentSearchRepository courseStudentSearchRepository) {
        this.courseStudentRepository = courseStudentRepository;
        this.kafkaSendNotification = kafkaSendNotification;
        this.courseStudentSearchRepository = courseStudentSearchRepository;
    }

    /**
     * Save a courseStudent.
     *
     * @param courseStudent the entity to save.
     * @return the persisted entity.
     */

    public CourseStudent save(CourseStudent courseStudent) {
        log.debug("Request to save CourseStudent : {}", courseStudent);
        CourseStudent result = courseStudentRepository.save(courseStudent);
        return result;
    }

    /**
     * Partially update a courseStudent.
     *
     * @param courseStudent the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CourseStudent> partialUpdate(CourseStudent courseStudent) {
        log.debug("Request to partially update CourseStudent : {}", courseStudent);

        return courseStudentRepository
            .findById(courseStudent.getId())
            .map(existingCourseStudent -> {
                if (courseStudent.getCourseStudent_notification() != null) {
                    existingCourseStudent.setCourseStudent_notification(courseStudent.getCourseStudent_notification());
                }

                return existingCourseStudent;
            })
            .map(courseStudentRepository::save)
            .map(savedCourseStudent -> {
                courseStudentSearchRepository.save(savedCourseStudent);

                return savedCourseStudent;
            });
    }

    /**
     * Get all the courseStudents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CourseStudent> findAll(Pageable pageable) {
        log.debug("Request to get all CourseStudents");
        return courseStudentRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<CoursePercentDTO> getCourseStudentPercent(Pageable pageable) {
        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);

        return courseStudentRepository.courseStudentPercentDTO(pageable, getIdUser);
    }

    @Transactional(readOnly = true)
    public Page<CourseLectureDTO> getCourseLecture(Pageable pageable) {
        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        String lectureId= courseStudentRepository.getLectureId(getIdUser);
        return courseStudentRepository.getCourseLecture(pageable, Long.valueOf(lectureId));
    }

    @Transactional(readOnly = true)
    public Page<CourseLectureDTO> getCourseLectureHistory(Pageable pageable) {
        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        String getLectureId=courseStudentRepository.getLectureId(getIdUser);
        return courseStudentRepository.getCourseLectureHistory(pageable, getLectureId);
    }


    @Transactional(readOnly = true)
//    @Cacheable(value = "findCourseStudentByCourse")
    public Page<CourseStudent> getCourseStudentByCourseId(Long id, Pageable pageable) {
        return courseStudentRepository.findByCourseId(id, pageable);
    }

    @Transactional(readOnly = true)
    public float percentComplete(Long courseId, Long studentId) {
        return courseStudentRepository.percentComplete(courseId, studentId);
    }

    /**
     * Get one courseStudent by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CourseStudent> findOne(Long id) {
        log.debug("Request to get CourseStudent : {}", id);
        return courseStudentRepository.findById(id);
    }

    /**
     * Delete the courseStudent by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete CourseStudent : {}", id);
        courseStudentRepository.deleteById(id);
    }

    /**
     * Search for the courseStudent corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CourseStudent> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of CourseStudents for query {}", query);
        return courseStudentSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public void updateStudentInCourse(Long course_id) {
        courseStudentRepository.updateTotalStudent(course_id);
    }

    @Transactional(readOnly = true)
    public Page<CourseStudent> getCourseByStudent(String student, Pageable pageable) {
        log.debug("Request to get a page of course by student: ", student);

        return courseStudentRepository.findCourseByStudent(student, pageable);
    }


    @Transactional(readOnly = true)
    public Page<CourseStudent> getStudentByCourse(Long course, Pageable pageable) {
        log.debug("Request to get a page of student by course: ", course);

        return courseStudentRepository.findtudentsByCourse(course, pageable);
    }

    @Transactional(readOnly = true)
    public Page<CourseManagerDTO> getCourseManager(Pageable pageable, Long courseId) {
        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        return courseStudentRepository.getCourseManager(pageable, courseId);
    }

    @Transactional(readOnly = true)
    public Page<CourseManagerDTO> searchCourseManagerByName(Pageable pageable, Long courseId, String student_name) {
        log.debug("Request to searchCourseManagerByName : {}", courseId);
        return courseStudentRepository.searchCourseManagerByName(pageable, courseId, student_name);

    }

    public void deleteCourseStudentByCourse(Long course_id) {
        log.debug("Request to deleteCourseStudentByCourse : {}", course_id);
        courseStudentRepository.deleteCourseStudentByCourse(course_id);
    }

    //delete student from course
    public void deleteStudentFromCourse(Long course_id, Long student_id) {
        log.debug("Request to deleteStudentFromCourse : {}", course_id);
        courseStudentRepository.deleteStudentFromCourse(course_id, student_id);
    }

    public void updateCourseTotalStudent(Long id) {
        try {
            log.debug("Request To Update Course Total Student With Course ID =" + id + "\n");
            courseStudentRepository.SP_UPDATE_COURSE_TOTAL_STUDENT(id);
        } catch (Exception e) {
            log.debug("Update Course Total Student Error: ID Course=" + id + "\n");
            e.printStackTrace();
        }

    }


    @Transactional(readOnly = true)
    public Page<CoursePercentDTO> searchCourseStudentPercentDTO(String user_id, String param, Pageable pageable) {
        log.debug("Request to searchCourseStudentPercentDTO : {}", user_id);
        return courseStudentRepository.searchCourseStudentPercentDTO(user_id, param, pageable);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getCourseStudentPercentHistory(Long student_id) {
        log.debug("Request to getCourseStudentPercentHistory : {}", student_id);
        return courseStudentRepository.getCourseStudentPercentHistory(student_id);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getCourseLectureHistory() {
        String login_info = AuthenticateUltil.getLoginByCurrentLogin();
        String getIdUser = courseStudentRepository.getIdUser(login_info);
        String lectureId= courseStudentRepository.getLectureId(getIdUser);
        return courseStudentRepository.getCourseLectureHistory(lectureId);

    }

    @Transactional(readOnly = true)
    public Boolean checkExistCourseStudent(Long course_id, Long student_id) {
        if (courseStudentRepository.countCourseStudentByStudent(course_id, student_id) != 0) {
            return true;
        } else {
            return false;
        }
    }

    public void deleteStudentLessonByStudentIdAndCourseId(Long studentId,Long lesson_id){
        courseStudentRepository.deleteStudentLessonByStudentIdAndCourseId(studentId,lesson_id);
    }


}
