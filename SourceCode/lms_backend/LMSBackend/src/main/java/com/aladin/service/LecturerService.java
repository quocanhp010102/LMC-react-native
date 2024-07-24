package com.aladin.service;

import com.aladin.domain.Lecturer;
import com.aladin.repository.LecturerRepository;

import java.util.Optional;

import com.aladin.repository.search.LecturerSearchRepository;
import com.aladin.service.dto.LecturerDTO;
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
 * Service Implementation for managing {@link Lecturer}.
 */
@Service
public class LecturerService {

    private final Logger log = LoggerFactory.getLogger(LecturerService.class);

    private final LecturerRepository lecturerRepository;
    private final LecturerSearchRepository lecturerSearchRepository;

    public LecturerService(LecturerRepository lecturerRepository, LecturerSearchRepository lecturerSearchRepository) {
        this.lecturerRepository = lecturerRepository;
        this.lecturerSearchRepository = lecturerSearchRepository;
    }

    /**
     * Save a lecturer.
     *
     * @param lecturer the entity to save.
     * @return the persisted entity.
     */

    public Lecturer save(Lecturer lecturer) {
        log.debug("Request to save Lecturer : {}", lecturer);
        Lecturer result = lecturerRepository.save(lecturer);
      //  lecturerSearchRepository.save(result);
        return result;
    }

    /**
     * Partially update a lecturer.
     *
     * @param lecturer the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Lecturer> partialUpdate(Lecturer lecturer) {
        log.debug("Request to partially update Lecturer : {}", lecturer);

        return lecturerRepository
            .findById(lecturer.getId())
            .map(existingLecturer -> {
                if (lecturer.getLecturer_birthday() != null) {
                    existingLecturer.setLecturer_birthday(lecturer.getLecturer_birthday());
                }
                if (lecturer.getLecturer_email() != null) {
                    existingLecturer.setLecturer_email(lecturer.getLecturer_email());
                }
                if (lecturer.getLecturer_fullname() != null) {
                    existingLecturer.setLecturer_fullname(lecturer.getLecturer_fullname());
                }
                if (lecturer.getLecturer_gender() != null) {
                    existingLecturer.setLecturer_gender(lecturer.getLecturer_gender());
                }
                if (lecturer.getLecturer_phone() != null) {
                    existingLecturer.setLecturer_phone(lecturer.getLecturer_phone());
                }
                if (lecturer.getLecturer_avatar() != null) {
                    existingLecturer.setLecturer_avatar(lecturer.getLecturer_avatar());
                }

                return existingLecturer;
            })
            .map(lecturerRepository::save)
            .map(savedLecturer -> {
//                lecturerSearchRepository.save(savedLecturer);

                return savedLecturer;
            });
    }

    /**
     * Get all the lecturers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Lecturer> findAll(Pageable pageable) {
        log.debug("Request to get all Lecturers");
        return lecturerRepository.findAll(pageable);
    }

    /**
     * Get one lecturer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Lecturer> findOne(Long id) {
        log.debug("Request to get Lecturer : {}", id);
        return lecturerRepository.findById(id);
    }

    /**
     * Delete the lecturer by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete Lecturer : {}", id);
        lecturerRepository.deleteById(id);
        lecturerSearchRepository.deleteById(id);
    }

    /**
     * Search for the lecturer corresponding to the query.
     *
     * @param query    the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<LecturerDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Lecturers for query {}", query);
        return lecturerSearchRepository.search(query, pageable);
    }

    @Transactional(readOnly = true)
    public Boolean checkIsLecturer(String user_id) {
        if (lecturerRepository.countLecturer(user_id) == 1 && lecturerRepository.countLecturerByRole(user_id) == 1) {
            return true;
        } else {
            return false;
        }
    }

    @Transactional(readOnly = true)
    public Lecturer getLecturerByUser(String user_id) {
        return lecturerRepository.getLecturerByUser(user_id);
    }


}
