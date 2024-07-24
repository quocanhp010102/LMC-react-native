package com.aladin.service;

import com.aladin.domain.Student;
import com.aladin.domain.StudentLesson;
import com.aladin.repository.StudentLessonRepository;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.StudentLessonSearchRepository;
import com.aladin.service.dto.StudentLessonDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link StudentLesson}.
 */
@Service
@Transactional
public class StudentLessonService {

    private final Logger log = LoggerFactory.getLogger(StudentLessonService.class);

    private final StudentLessonRepository studentLessonRepository;
    private final StudentLessonSearchRepository studentLessonSearchRepository;

    private final UserService userService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public StudentLessonService(StudentLessonRepository studentLessonRepository, StudentLessonSearchRepository studentLessonSearchRepository, UserService userService) {
        this.studentLessonRepository = studentLessonRepository;
        this.studentLessonSearchRepository = studentLessonSearchRepository;
        this.userService = userService;
    }

    /**
     * Save a studentLesson.
     *
     * @param studentLesson the entity to save.
     * @return the persisted entity.
     */

    public StudentLesson save(StudentLesson studentLesson) {
        log.debug("Request to save StudentLesson : {}", studentLesson);
        StudentLesson result = studentLessonRepository.save(studentLesson);
        return result;
    }

    /**
     * Partially update a studentLesson.
     *
     * @param studentLesson the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StudentLesson> partialUpdate(StudentLesson studentLesson) {
        log.debug("Request to partially update StudentLesson : {}", studentLesson);

        return studentLessonRepository
            .findById(studentLesson.getId())
            .map(existingStudentLesson -> {

                return existingStudentLesson;
            })
            .map(studentLessonRepository::save)
            .map(savedStudentLesson -> {
                studentLessonSearchRepository.save(savedStudentLesson);

                return savedStudentLesson;
            });
    }

    /**
     * Get all the studentLessons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudentLesson> findAll(Pageable pageable) {
        log.debug("Request to get all StudentLessons");
        return studentLessonRepository.findAll(pageable);
    }

    /**
     * Get one studentLesson by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StudentLesson> findOne(Long id) {
        log.debug("Request to get StudentLesson : {}", id);
        return studentLessonRepository.findStudentLessonById(id);
    }

    /**
     * Delete the studentLesson by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete StudentLesson : {}", id);
        studentLessonRepository.deleteById(id);
    }

    /**
     * Search for the studentLesson corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudentLesson> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of StudentLessons for query {}", query);
        return studentLessonSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public int countStudentInStudentLesson(Long student_id, Long lesson_id) {
        log.debug("Request to countStudentInStudentLesson for query {}", student_id, lesson_id);
        return studentLessonRepository.countStudentInStudentLesson(student_id, lesson_id);
    }

    @Transactional(readOnly = true)
    public Page<StudentLesson> findStudentLessonByLessonAndStudent(Pageable pageable, Long lessonId, Principal principal) {
        Long getIdStudent = studentLessonRepository.getStudentId(userService.getUserID(principal));
        return studentLessonRepository.findStudentLessonByStudentIdAndLessonId(pageable, getIdStudent, lessonId);
    }


    public void updatePercent(int courseId, int studentId) {
        studentLessonRepository.FN_LESSONCALCULATE(courseId, studentId);
    }

    public List<StudentLessonDto> getStudentByCourseId(Pageable pageable, Long CourseId) {
        String sql = "select s.id as id,c.course_name as coursename, s.student_code as code,  s.STUDENT_FULLNAME  as fullname\n" +
            ",((select count(id) from lesson l where l.COURSE_ID=? )-(select count(student_lesson.id)from student_lesson \n" +
            "             inner join lesson on lesson.id=student_lesson.lesson_id \n" +
            "             where student_lesson.is_done=0 and student_id=s.id  and lesson.course_id=?))/ (NVL( NULLIF(( select count(id) from lesson l where l.COURSE_ID=? ),0),1))*100 as sum_percent\n" +
            "             from student s    \n" +
            "             inner join student_lesson sl on sl.student_id = s.id    \n" +
            "             inner join course_student cs on cs.student_id = s.id  \n" +
            "             inner join course c on c.id = cs.course_id\n" +
            "             where cs.course_id = ?    \n" +
            "             group by s.student_code,s.STUDENT_FULLNAME, s.id, c.course_name\n" +
            "             order by fullname asc " +
            "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
        return jdbcTemplate.query(sql, new Object[]{CourseId, CourseId, CourseId, CourseId, pageable.getPageNumber() * pageable.getPageSize(), pageable.getPageSize()}, (rs, rowNum) ->
            new StudentLessonDto(
                CourseId,
                rs.getString("fullname"),
                rs.getInt("sum_percent"),
                rs.getLong("id"),
                rs.getString("code"),
                rs.getString("coursename")
            ));
    }

    public List<StudentLessonDto> getStudentByCourseIdAndStudentName(Pageable pageable, Long CourseId, String param) {
        String sql = "select s.id as id,c.course_name as coursename, s.student_code as code,  s.STUDENT_FULLNAME  as fullname\n" +
            ",((select count(id) from lesson l where l.COURSE_ID=? )-(select count(student_lesson.id)from student_lesson \n" +
            "             inner join lesson on lesson.id=student_lesson.lesson_id \n" +
            "             where student_lesson.is_done=0 and student_id=s.id  and lesson.course_id=?)) / (NVL( NULLIF(( select count(id) from lesson l where l.COURSE_ID=? ),0),1)) *100 as sum_percent\n" +
            "             from student s    \n" +
            "             inner join student_lesson sl on sl.student_id = s.id    \n" +
            "             inner join course_student cs on cs.student_id = s.id  \n" +
            "             inner join course c on c.id = cs.course_id\n" +
            "             where cs.course_id = ? and lower(s.student_fullname) like ? \n" +
            "             group by s.student_code,s.STUDENT_FULLNAME, s.id, c.course_name\n" +
            "             order by fullname asc " +
            " OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";
        return jdbcTemplate.query(sql, new Object[]{CourseId, CourseId, CourseId, CourseId, "%" + param.toLowerCase() + "%", "%" + param.toLowerCase() + "%", pageable.getPageNumber() * pageable.getPageSize(), pageable.getPageSize()}, (rs, rowNum) ->
            new StudentLessonDto(
                CourseId,
                rs.getString("fullname"),
                rs.getInt("sum_percent"),
                rs.getLong("id"),
                rs.getString("code"),
                rs.getString("coursename")
            ));
    }

    public int total(Long CourseId) {
        String sql = "select s.id as id,c.course_name as coursename, s.student_code as code,  s.STUDENT_FULLNAME  as fullname\n" +
            ",((select count(id) from lesson l where l.COURSE_ID=? )-(select count(student_lesson.id)from student_lesson \n" +
            "             inner join lesson on lesson.id=student_lesson.lesson_id \n" +
            "             where student_lesson.is_done=0 and student_id=s.id  and lesson.course_id=?))/ (NVL( NULLIF(( select count(id) from lesson l where l.COURSE_ID=? ),0),1))*100 as sum_percent\n" +
            "             from student s    \n" +
            "             inner join student_lesson sl on sl.student_id = s.id    \n" +
            "             inner join course_student cs on cs.student_id = s.id  \n" +
            "             inner join course c on c.id = cs.course_id\n" +
            "             where cs.course_id = ?   \n" +
            "             group by s.student_code,s.STUDENT_FULLNAME, s.id, c.course_name\n";
        return jdbcTemplate.query(sql, new Object[]{CourseId, CourseId, CourseId, CourseId}, (rs, rowNum) ->
            new StudentLessonDto(
                CourseId,
                rs.getString("fullname"),
                rs.getInt("sum_percent")
            )).size();
    }

    public int totalSearch(Long CourseId, String param) {
        String sql = "select s.id as id,c.course_name as coursename, s.student_code as code,  s.STUDENT_FULLNAME  as fullname\n" +
            ",((select count(id) from lesson l where l.COURSE_ID=? )-(select count(student_lesson.id)from student_lesson \n" +
            "             inner join lesson on lesson.id=student_lesson.lesson_id \n" +
            "             where student_lesson.is_done=0 and student_id=s.id  and lesson.course_id=?))/ (NVL( NULLIF(( select count(id) from lesson l where l.COURSE_ID=? ),0),1))*100 as sum_percent\n" +
            "             from student s    \n" +
            "             inner join student_lesson sl on sl.student_id = s.id    \n" +
            "             inner join course_student cs on cs.student_id = s.id  \n" +
            "             inner join course c on c.id = cs.course_id\n" +
            "             where cs.course_id = ?   and s.student_fullname like ?  \n" +
            "             group by s.student_code,s.STUDENT_FULLNAME, s.id, c.course_name\n" +
            "             order by fullname asc ";
        return jdbcTemplate.query(sql, new Object[]{CourseId, CourseId, CourseId, CourseId, "%" + param + "%"}, (rs, rowNum) ->
            new StudentLessonDto(
                CourseId,
                rs.getString("fullname"),
                rs.getInt("sum_percent")
            )).size();
    }
}
