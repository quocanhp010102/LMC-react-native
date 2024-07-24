package com.aladin.service;

import com.aladin.domain.Admin;
import com.aladin.repository.AdminRepository;
import java.util.Optional;

import com.aladin.repository.search.AdminSearchRepository;
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
 * Service Implementation for managing {@link Admin}.
 */
@Service
@Transactional
public class AdminService {

    private final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final AdminRepository adminRepository;
    private final AdminSearchRepository adminSearchRepository;

    public AdminService(AdminRepository adminRepository, AdminSearchRepository adminSearchRepository) {
        this.adminRepository = adminRepository;
        this.adminSearchRepository = adminSearchRepository;
    }

    /**
     * Save a admin.
     *
     * @param admin the entity to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllAdmin",allEntries = true),
//        @CacheEvict(value = "findAdminByUser",allEntries = true),
//        @CacheEvict(value = "findUpdateAdmin",allEntries = true),
//    })
    public Admin save(Admin admin) {
        log.debug("Request to save Admin : {}", admin);
        Admin result=adminRepository.save(admin);
//        adminSearchRepository.save(result);
        return result;
    }

    /**
     * Update a admin.
     *
     * @param admin the entity to save.
     * @return the persisted entity.
     */
//    @CachePut(value = "findUpdateAdmin")
    public Admin update(Admin admin) {
        log.debug("Request to save Admin : {}", admin);
        return adminRepository.save(admin);
    }

    /**
     * Partially update a admin.
     *
     * @param admin the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Admin> partialUpdate(Admin admin) {
        log.debug("Request to partially update Admin : {}", admin);

        return adminRepository
            .findById(admin.getId())
            .map(existingAdmin -> {
                if (admin.getAdmin_code() != null) {
                    existingAdmin.setAdmin_code(admin.getAdmin_code());
                }
                if (admin.getAdmin_birthday() != null) {
                    existingAdmin.setAdmin_birthday(admin.getAdmin_birthday());
                }
                if (admin.getAdmin_email() != null) {
                    existingAdmin.setAdmin_email(admin.getAdmin_email());
                }
                if (admin.getAdmin_fullname() != null) {
                    existingAdmin.setAdmin_fullname(admin.getAdmin_fullname());
                }
                if (admin.getAdmin_gender() != null) {
                    existingAdmin.setAdmin_gender(admin.getAdmin_gender());
                }
                if (admin.getAdmin_phone() != null) {
                    existingAdmin.setAdmin_phone(admin.getAdmin_phone());
                }
                if (admin.getAdmin_avatar() != null) {
                    existingAdmin.setAdmin_avatar(admin.getAdmin_avatar());
                }

                return existingAdmin;
            })
            .map(adminRepository::save);
    }

    /**
     * Get all the admins.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
//    @Cacheable("findAllAdmin")
    public Page<Admin> findAll(Pageable pageable) {
        log.debug("Request to get all Admins");
        return adminRepository.findAll(pageable);
    }

    /**
     * Get one admin by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
//    @Cacheable(value = "findAllAdmin", key = "#id")
    public Optional<Admin> findOne(Long id) {
        log.debug("Request to get Admin : {}", id);
        return adminRepository.findById(id);
    }

    /**
     * Delete the admin by id.
     *
     * @param id the id of the entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllAdmin",allEntries = true),
//        @CacheEvict(value = "findAdminByUser",allEntries = true),
//        @CacheEvict(value = "findUpdateAdmin",allEntries = true),
//    })
    public void delete(Long id) {
        log.debug("Request to delete Admin : {}", id);
        adminRepository.deleteById(id);
//        adminSearchRepository.deleteById(id);
    }

    /**
     * Search for the admin corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Admin> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Admins for query {}", query);
        return adminSearchRepository.search(query, pageable);
    }

//    @Cacheable(value = "findAdminByUser")
    public Admin getAdminByUser(String user_id){
        log.debug("Request to getAdminByUser  : {}", user_id);
        return adminRepository.getAdminByUser(user_id);
    }

}
