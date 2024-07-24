package com.aladin.service;

import com.aladin.domain.Classroom;
import com.aladin.domain.ClassroomStudent;
import com.aladin.domain.Student;
import com.aladin.repository.ClassroomStudentRepository;

import java.util.Optional;

import com.aladin.repository.search.ClassroomStudentSearchRepository;
import com.aladin.service.dto.StudentClassroomDTO;
import com.aladin.service.dto.StudentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ClassroomStudent}.
 */
@Service
@Transactional
public class ClassroomStudentService {

    private final Logger log = LoggerFactory.getLogger(ClassroomStudentService.class);

    private final ClassroomStudentRepository classroomStudentRepository;

    private final ClassroomStudentSearchRepository classroomStudentSearchRepository;

    public ClassroomStudentService(ClassroomStudentRepository classroomStudentRepository, ClassroomStudentSearchRepository classroomStudentSearchRepository) {
        this.classroomStudentRepository = classroomStudentRepository;
        this.classroomStudentSearchRepository = classroomStudentSearchRepository;
    }

    /**
     * Save a classroomStudent.
     *
     * @param classroomStudent the entity to save.
     * @return the persisted entity.
     */
    public ClassroomStudent save(ClassroomStudent classroomStudent) {
        log.debug("Request to save ClassroomStudent : {}", classroomStudent);
        ClassroomStudent result = classroomStudentRepository.save(classroomStudent);
        return result;
    }

    /**
     * Update a classroomStudent.
     *
     * @param classroomStudent the entity to save.
     * @return the persisted entity.
     */
    public ClassroomStudent update(ClassroomStudent classroomStudent) {
        log.debug("Request to save ClassroomStudent : {}", classroomStudent);
        return classroomStudentRepository.save(classroomStudent);
    }

    /**
     * Partially update a classroomStudent.
     *
     * @param classroomStudent the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ClassroomStudent> partialUpdate(ClassroomStudent classroomStudent) {
        log.debug("Request to partially update ClassroomStudent : {}", classroomStudent);

        return classroomStudentRepository
            .findById(classroomStudent.getId())
            .map(existingClassroomStudent -> {
                if (classroomStudent.getIsLeader() != null) {
                    existingClassroomStudent.setIsLeader(classroomStudent.getIsLeader());
                }

                return existingClassroomStudent;
            })
            .map(classroomStudentRepository::save)
            .map(savedClassroomStudent -> {
                classroomStudentSearchRepository.save(savedClassroomStudent);

                return savedClassroomStudent;
            });
    }

    /**
     * Get all the classroomStudents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ClassroomStudent> findAll(Pageable pageable) {
        log.debug("Request to get all ClassroomStudents");
        return classroomStudentRepository.findAll(pageable);
    }

    /**
     * Get one classroomStudent by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ClassroomStudent> findOne(Long id) {
        log.debug("Request to get ClassroomStudent : {}", id);
        return classroomStudentRepository.findById(id);
    }

    /**
     * Delete the classroomStudent by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ClassroomStudent : {}", id);
        classroomStudentRepository.deleteById(id);
    }

    /**
     * Search for the classroomStudent corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ClassroomStudent> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ClassroomStudents for query {}", query);
        return classroomStudentSearchRepository.search(query, pageable);
    }


    @Transactional(readOnly = true)
    public Page<Classroom> getAllClassroomByUserLogin(Long student_id, Pageable pageable) {
        log.debug("Request to getAllClassByUserLogin: ", student_id);
        return classroomStudentRepository.getAllClassByUserLogin(student_id, pageable);
    }

    public void deleteStudentFromClassroom(Long class_id, Long student_id) {
        log.debug("Request to deleteStudentFromClassroom : {}", class_id);
        classroomStudentRepository.deleteStudentFromClass(class_id, student_id);
    }

    public void deleteClassroom(Long class_id) {
        log.debug("Request to deleteClassroomFromClassroomStudent : {}", class_id);
        classroomStudentRepository.deleteClassrooms(class_id);
    }

    public ClassroomStudent findOneById(Long id) {
        return classroomStudentRepository.findOneById(id);
    }

    public void updateTotalStudent(Long classRoomId) {
        classroomStudentRepository.PROC_UPDATE_TOTAL_STUDENT(classRoomId);
    }

    public boolean checkExistStudentInClassroom(Long student_id, Long classroom_id) {
        if (classroomStudentRepository.checkExistStudentInClassroom(student_id, classroom_id) != 0) {
            return true;
        } else {
            return false;
        }
    }


}
