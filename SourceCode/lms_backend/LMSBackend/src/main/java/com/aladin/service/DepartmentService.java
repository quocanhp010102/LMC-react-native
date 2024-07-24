package com.aladin.service;

import com.aladin.domain.Department;
import com.aladin.repository.DepartmentRepository;

import java.util.Optional;

import com.aladin.repository.search.DepartmentSearchRepository;
import com.aladin.service.dto.DepartmentDTO;
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
 * Service Implementation for managing {@link Department}.
 */
@Service
@Transactional
public class DepartmentService {

    private final Logger log = LoggerFactory.getLogger(DepartmentService.class);

    private final DepartmentRepository departmentRepository;

    private final DepartmentSearchRepository departmentSearchRepository;

    public DepartmentService(DepartmentRepository departmentRepository, DepartmentSearchRepository departmentSearchRepository) {
        this.departmentRepository = departmentRepository;
        this.departmentSearchRepository = departmentSearchRepository;
    }

    /**
     * Save a department.
     *
     * @param department the entity to save.
     * @return the persisted entity.
     */

    public Department save(Department department) {
        log.debug("Request to save Department : {}", department);
        Department result = departmentRepository.save(department);
        DepartmentDTO departmentDTO= new DepartmentDTO(result);
        departmentSearchRepository.save(departmentDTO);
        return result;
    }

    /**
     * Partially update a department.
     *
     * @param department the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Department> partialUpdate(Department department) {
        log.debug("Request to partially update Department : {}", department);

        return departmentRepository
            .findById(department.getId())
            .map(existingDepartment -> {
                if (department.getDepartment_name() != null) {
                    existingDepartment.setDepartment_name(department.getDepartment_name());
                }
                if (department.getDepartment_type() != null) {
                    existingDepartment.setDepartment_type(department.getDepartment_type());
                }

                return existingDepartment;
            })
            .map(departmentRepository::save)
            .map(savedDepartment -> {
//                departmentSearchRepository.save(savedDepartment);

                return savedDepartment;
            });
    }

    /**
     * Get all the departments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Department> findAll(Pageable pageable) {
        log.info("department");
        log.debug("Request to get all Departments");
        return departmentRepository.findAll(pageable);
    }

    /**
     * Get one department by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Department> findOne(Long id) {
        log.debug("Request to get Department : {}", id);
        return departmentRepository.findById(id);
    }

    /**
     * Delete the department by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete Department : {}", id);
        departmentRepository.PROC_DELETE_DEPARTMENT(id);
        departmentSearchRepository.deleteById(id);
    }

    /**
     * Search for the department corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<DepartmentDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Departments for query {}", query);
        return departmentSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Department> getDepartmentByType(String type, Pageable pageable) {
        log.debug("Request to get a page of Departments by type: ", type);
        return departmentRepository.getDepartmentByType(type, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Department> getHighLightDepartment(Pageable pageable) {
        log.debug("Request to get a page of Departments by getHighLightDepartment");
        return departmentRepository.getHightlightDepartment(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Department> searchDepartmentByName(String department_name, Pageable pageable) {
        log.debug("Request to get a page of Departments by getHighLightDepartment");
        return departmentRepository.searchDepartmentByName(department_name,pageable);
    }



}

