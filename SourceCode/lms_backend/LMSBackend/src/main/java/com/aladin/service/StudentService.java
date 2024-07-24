package com.aladin.service;

import com.aladin.domain.Student;
import com.aladin.repository.ClassroomStudentRepository;
import com.aladin.repository.StudentRepository;

import java.sql.*;
import java.util.*;

import com.aladin.repository.UserRepository;
import com.aladin.repository.search.StudentSearchRepository;
import com.aladin.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Student}.
 */
@Service
@Transactional
public class StudentService {

    private final Logger log = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;
    private final StudentSearchRepository studentSearchRepository;

    private final UserRepository userRepository;

    private final ClassroomStudentRepository classroomStudentRepository;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public StudentService(StudentRepository studentRepository, StudentSearchRepository studentSearchRepository, UserRepository userRepository, ClassroomStudentRepository classroomStudentRepository) {
        this.studentRepository = studentRepository;
        this.studentSearchRepository = studentSearchRepository;
        this.userRepository = userRepository;
        this.classroomStudentRepository = classroomStudentRepository;
    }

    /**
     * Save a student.
     *
     * @param student the entity to save.
     * @return the persisted entity.
     */

    public Student save(Student student) {
        log.debug("Request to save Student : {}", student);
        Student result = studentRepository.save(student);
//        studentSearchRepository.save(result);
        return result;
    }

    /**
     * Partially update a student.
     *
     * @param student the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Student> partialUpdate(Student student) {
        log.debug("Request to partially update Student : {}", student);

        return studentRepository
            .findById(student.getId())
            .map(existingStudent -> {
                if (student.getStudent_code() != null) {
                    existingStudent.setStudent_code(student.getStudent_code());
                }
                if (student.getStudent_birthday() != null) {
                    existingStudent.setStudent_birthday(student.getStudent_birthday());
                }
                if (student.getStudent_email() != null) {
                    existingStudent.setStudent_email(student.getStudent_email());
                }
                if (student.getStudent_fullname() != null) {
                    existingStudent.setStudent_fullname(student.getStudent_fullname());
                }
                if (student.getStudent_gender() != null) {
                    existingStudent.setStudent_gender(student.getStudent_gender());
                }
                if (student.getStudent_phone() != null) {
                    existingStudent.setStudent_phone(student.getStudent_phone());
                }
                if (student.getStudent_avatar() != null) {
                    existingStudent.setStudent_avatar(student.getStudent_avatar());
                }

                return existingStudent;
            })
            .map(studentRepository::save)
            .map(savedStudent -> {
//                studentSearchRepository.save(savedStudent);

                return savedStudent;
            });
    }

    /**
     * Get all the students.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Student> findAll(Pageable pageable) {
        log.debug("Request to get all Students");
        return studentRepository.findAll(pageable);
    }

    /**
     * Get one student by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Student> findOne(Long id) {
        log.debug("Request to get Student : {}", id);
        return studentRepository.findById(id);
    }

    /**
     * Delete the student by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Student : {}", id);
        studentRepository.deleteById(id);
        studentSearchRepository.deleteById(id);
    }

    /**
     * Search for the student corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudentDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Students for query {}", query);
        return studentSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Student> getAllStudentByCourse(Long course_id, Pageable pageable) {
        log.debug("Request to get a page of getAllStudentByCourse by course_id: ", course_id);
        return studentRepository.getStudentByCourse(course_id, pageable);
    }

    @Transactional(readOnly = true)
    public Boolean checkIsStudent(String user_id) {
        if (studentRepository.countStudent(user_id) == 1 && studentRepository.countStudentByRole(user_id) == 1) {
            return true;
        } else {
            return false;
        }
    }

    public Page<StudentsDTO> getStudentsByCoursesId(Long id, Pageable pageable) {
        return studentRepository.getStudentsByCoursesId(id, pageable);
    }

    //get User by role
    @Transactional(readOnly = true)
    public Page<UserOnlyDTO> getAllUserByRole(Pageable pageable) {
        return studentRepository.getAllUserWithRole(pageable);
    }

    @Transactional(readOnly = true)
    public Student getStudentByUserLogin(String user_id) {
        log.debug("Request to get a page of getStudentByUserLogin by user_id: ", user_id);
        return studentRepository.getStudentByUser(user_id);
    }


    public Page<StudentClassroomDTO> getAllStudentByClassroom(Long classroom_id, Pageable pageable) {
        log.debug("Request to get a page of getAllStudentByClassroom by classroom_id: ", classroom_id);
        return classroomStudentRepository.getAllStudentByClass(classroom_id, pageable);

    }

    public Page<StudentDTO> getStudentAndClass(Long id, Pageable pageable) {
        return studentRepository.getStudentAndClass(id, pageable);
    }

    public Student getStudentById(String id) {
        return studentRepository.getStudentById(id);
    }

    public Page<StudentsDTO> getStudentsByCoursesAndName(Long course_id, String name, Pageable pageable) {
        log.debug("Request to get a page of getStudentsByCoursesAndName : ", course_id);
        return studentRepository.getStudentsByCoursesAndName(course_id, name, pageable);
    }

    public Page<StudentClassroomDTO> searchAllStudentByClassAndName(Long classroom_id, String name, Pageable pageable) {
        log.debug("Request to get a page of searchAllStudentByClassAndName : ", classroom_id);
        return classroomStudentRepository.searchAllStudentByClassAndName(classroom_id, name, pageable);
    }

    public Page<StudentClassroomDTO> getAllStudentByClassCode(String classCode, Pageable pageable) {
        log.debug("Request to get a page of getAllStudentByClassCode : ", classCode);
        return classroomStudentRepository.getAllStudentByClassCode(classCode, pageable);
    }

    public Page<Student> getListStudentOnClass(String param, Pageable pageable) {
        return studentRepository.getListStudentOnClass(param, pageable);
    }

    public List<StudentCourseDTO> getStudentOnClass(String param, Pageable pageable) {
        Page<Student> students = studentRepository.getListStudentOnClass("%" + param + "%", pageable);
        List<Student> studentList = students.getContent();
        List<StudentCourseDTO> studentCourseDTOS = new ArrayList<>();
        studentList.forEach(p -> {
            StudentCourseDTO studentCourseDTO = new StudentCourseDTO(p);
            studentCourseDTOS.add(studentCourseDTO);
        });
        return studentCourseDTOS;
    }

    public List<StudentCourseDTO> getStudentsOnClass(String param, Pageable pageable) {
        String sql = "select distinct s.student_code, s.student_fullname,c.classroom_name from classroom_student cs inner join classroom c on c.id=cs.classroom_id " +
            "inner join student s on s.id= cs.student_id where s.student_fullname like ? or s.student_code like ? or c.classroom_code like ? " +
            "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

        return jdbcTemplate.query(sql, new Object[]{"%" + param + "%", "%" + param + "%", "%" + param + "%", pageable.getPageNumber() * pageable.getPageSize(), pageable.getPageSize()}, (rs, rowNum) ->
            new StudentCourseDTO(
                rs.getString("student_code"),
                rs.getString("student_fullname"),
                rs.getString("classroom_name")
            ));
    }

    public Page<Student> getStudentByNameCodeAndClass(String param, Pageable pageable) {
        log.debug("request to getStudentByNameCodeAndClass: " + param);
        return studentRepository.getStudentByNameCodeAndClass(param, pageable);
    }

    public List<Student> getAllStudentIDByCourse(Long course_id) {
        log.debug("request to getAllStudentIDByCourse: " + course_id);
        return studentRepository.getAllStudentIDByCourse(course_id);
    }


    public Student getStudentByStudentID(Long student_id) {
        log.debug("request to getStudentByStudentID: " + student_id);
        return studentRepository.findOneById(student_id);
    }


    public Page<Student> getStudentNotInCourse(Long course_id, String student_name, Pageable pageable) {
        log.debug("request to getStudentNotInCourse: " + course_id);
        return studentRepository.getStudentNotInCourse(course_id, student_name, pageable);
    }

    public Page<Student> getAllStudentNotInCourse(Long course_id, Pageable pageable) {
        log.debug("request to getStudentNotInCourse: " + course_id);
        return studentRepository.getAllStudentNotInCourse(course_id, pageable);
    }

    public Page<Student> getStudentNotInClassroom(Long classroom_id, String student_name, Pageable pageable) {
        log.debug("request to getStudentNotInClassroom: " + classroom_id);
        return studentRepository.getStudentNotInClassroom(classroom_id, student_name, pageable);
    }

    public Page<Student> getAllStudentNotInClassroom(Long classroom_id, Pageable pageable) {
        log.debug("request to getStudentNotInClassroom: " + classroom_id);
        return studentRepository.getAllStudentNotInClassroom(classroom_id, pageable);
    }
}
