package com.aladin.service;

import com.aladin.domain.Classroom;
import com.aladin.repository.ClassroomRepository;

import java.util.Optional;

import com.aladin.repository.search.ClassroomSearchRepository;
import com.aladin.service.dto.ClassroomDepartmentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Classroom}.
 */
@Service
@Transactional
public class ClassroomService {

    private final Logger log = LoggerFactory.getLogger(ClassroomService.class);

    private final ClassroomRepository classroomRepository;
    private final ClassroomSearchRepository classroomSearchRepository;

    public ClassroomService(ClassroomRepository classroomRepository, ClassroomSearchRepository classroomSearchRepository) {
        this.classroomRepository = classroomRepository;
        this.classroomSearchRepository = classroomSearchRepository;
    }

    /**
     * Save a classroom.
     *
     * @param classroom the entity to save.
     * @return the persisted entity.
     */

    public Classroom save(Classroom classroom) {
        log.debug("Request to save Classroom : {}", classroom);
        Classroom result = classroomRepository.save(classroom);
        return result;
    }



    /**
     * Partially update a classroom.
     *
     * @param classroom the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Classroom> partialUpdate(Classroom classroom) {
        log.debug("Request to partially update Classroom : {}", classroom);

        return classroomRepository
            .findById(classroom.getId())
            .map(existingClassroom -> {
                if (classroom.getClassroomName() != null) {
                    existingClassroom.setClassroomName(classroom.getClassroomName());
                }
                if (classroom.getClassroomTotalStudent() != null) {
                    existingClassroom.setClassroomTotalStudent(classroom.getClassroomTotalStudent());
                }

                return existingClassroom;
            })
            .map(classroomRepository::save);
    }

    /**
     * Get all the classrooms.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Classroom> findAll(Pageable pageable) {
        log.debug("Request to get all Classrooms");
        return classroomRepository.findAllClassroom(pageable);
    }

    /**
     * Get one classroom by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Classroom> findOne(Long id) {
        log.debug("Request to get Classroom : {}", id);
        return classroomRepository.findById(id);
    }

    /**
     * Delete the classroom by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete Classroom : {}", id);
        classroomRepository.deleteById(id);
    }

    /**
     * Search for the classroom corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Classroom> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Classrooms for query {}", query);
        return classroomSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ClassroomDepartmentDTO> getAllClassroomByDepartment(Long department_id, Pageable pageable) {
        log.debug("Request to getAllClassroomByDepartment:", department_id);
        return classroomRepository.getAllClassroomByDepartment(department_id, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ClassroomDepartmentDTO> searchClassroomByDepartmentAndClassName(Long department_id, String className, Pageable pageable) {
        log.debug("Request to getAllClassroomByDepartment:", department_id);
        return classroomRepository.searchClassroomByDepartmentAndClassName(department_id, className, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ClassroomDepartmentDTO> searchClassroomByDepartmentAndClassCode(Long department_id, String classCode, Pageable pageable) {
        log.debug("Request to getAllClassroomByDepartment:", department_id);
        return classroomRepository.searchClassroomByDepartmentAndClassCode(department_id, classCode, pageable);
    }


    public void deleteMultiClassroom(Long id) {
        log.debug("Request to deleteMultiClassroom:", id);
        classroomRepository.deleteMultiClassroom(id);
    }

    @Transactional(readOnly = true)
    public Page<ClassroomDepartmentDTO> searchClassroomByDepartmentName(String department_name, Pageable pageable) {
        log.debug("Request to getAllClassroomByDepartment:", department_name);
        return classroomRepository.searchClassroomByDepartmentName(department_name, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ClassroomDepartmentDTO> searchClassroomByClassName(String class_name, Pageable pageable) {
        log.debug("Request to searchClassroomByClassName:", class_name);
        return classroomRepository.searchClassroomByClassName(class_name, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ClassroomDepartmentDTO> searchClassroomByClassCode(String class_code, Pageable pageable) {
        log.debug("Request to searchClassroomByClassCode:", class_code);
        return classroomRepository.searchClassroomByClassCode(class_code, pageable);
    }


    @Transactional(readOnly = true)
    public Page<Classroom> searchClassroomByCodeNameAndDepartment(String param, Pageable pageable) {
        log.debug("Request to searchClassroomByCodeNameAndDepartment:", param);
        return classroomRepository.searchClassroomByCodeNameAndDepartment(param, pageable);
    }

    public boolean checkExistClassroom(String classroomCode) {
        log.debug("Request to checkExistClassroom:", classroomCode);
        if (classroomRepository.countExistClassroom(classroomCode) != 0) {
            return true;
        } else {
            return false;
        }

    }

}
