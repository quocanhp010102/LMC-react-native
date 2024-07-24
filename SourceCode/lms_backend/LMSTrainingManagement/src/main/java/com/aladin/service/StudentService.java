package com.aladin.service;

import com.aladin.domain.Student;
import com.aladin.repository.StudentRepository;

import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.StudentSearchRepository;
import jdk.dynalink.linker.LinkerServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
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

    public StudentService(StudentRepository studentRepository, StudentSearchRepository studentSearchRepository) {
        this.studentRepository = studentRepository;
        this.studentSearchRepository = studentSearchRepository;
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
                studentSearchRepository.save(savedStudent);

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
     //   studentSearchRepository.deleteById(id);
    }

    /**
     * Search for the student corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Student> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Students for query {}", query);
        return studentSearchRepository.search(query, pageable);
    }

    public List<Student> findAllByExamsId(Long examsId){
        log.debug("Request to findAllByExamsId", examsId);
        return  studentRepository.findAllByExamsId(examsId);
    }

    public Student findOneById(Long id){
        log.debug("Request to findOneById", id);
        return  studentRepository.findOneByid(id);
    }

    public Student findOneByExamsHistoryId(Long id){
        log.debug("Request to findOneByExamsHistoryId", id);
        return studentRepository.findOneByExamsHistory(id);
    }

    @Transactional(readOnly = true)
    public Boolean checkIsStudent(String user_id) {
        if (studentRepository.countStudent(user_id) == 1 && studentRepository.countStudentByRole(user_id) == 1) {
            return true;
        } else {
            return false;
        }
    }

}
