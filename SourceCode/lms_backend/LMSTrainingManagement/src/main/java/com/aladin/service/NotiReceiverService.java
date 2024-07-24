package com.aladin.service;

import com.aladin.domain.NotiReceiver;
import com.aladin.repository.NotiReceiverRepository;
import java.util.Optional;

import com.aladin.repository.search.NotiReceiverSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link NotiReceiver}.
 */
@Service
@Transactional
public class NotiReceiverService {

    private final Logger log = LoggerFactory.getLogger(NotiReceiverService.class);

    private final NotiReceiverRepository notiReceiverRepository;

    private final NotiReceiverSearchRepository notiReceiverSearchRepository;

    public NotiReceiverService(NotiReceiverRepository notiReceiverRepository, NotiReceiverSearchRepository notiReceiverSearchRepository) {
        this.notiReceiverRepository = notiReceiverRepository;
        this.notiReceiverSearchRepository = notiReceiverSearchRepository;
    }

    /**
     * Save a notiReceiver.
     *
     * @param notiReceiver the entity to save.
     * @return the persisted entity.
     */
    public NotiReceiver save(NotiReceiver notiReceiver) {
        log.debug("Request to save NotiReceiver : {}", notiReceiver);
        return notiReceiverRepository.save(notiReceiver);
    }

    /**
     * Partially update a notiReceiver.
     *
     * @param notiReceiver the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<NotiReceiver> partialUpdate(NotiReceiver notiReceiver) {
        log.debug("Request to partially update NotiReceiver : {}", notiReceiver);

        return notiReceiverRepository
            .findById(notiReceiver.getId())
            .map(existingNotiReceiver -> {
                if (notiReceiver.getNotiReceiverStatus() != null) {
                    existingNotiReceiver.setNotiReceiverStatus(notiReceiver.getNotiReceiverStatus());
                }

                return existingNotiReceiver;
            })
            .map(notiReceiverRepository::save);
    }

    /**
     * Get all the notiReceivers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NotiReceiver> findAll(Pageable pageable) {
        log.debug("Request to get all NotiReceivers");
        return notiReceiverRepository.findAll(pageable);
    }

    /**
     * Get one notiReceiver by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<NotiReceiver> findOne(Long id) {
        log.debug("Request to get NotiReceiver : {}", id);
        return notiReceiverRepository.findById(id);
    }

    /**
     * Delete the notiReceiver by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete NotiReceiver : {}", id);
        notiReceiverRepository.deleteById(id);
    }

    /**
     * Search for the notiReceiver corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NotiReceiver> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of NotiReceivers for query {}", query);
        return notiReceiverSearchRepository.search(query, pageable);
    }
}
