package com.aladin.service;

import com.aladin.domain.*;
import com.aladin.repository.HistoryRepository;
import com.aladin.repository.TutorialRepository;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

import com.aladin.repository.search.TutorialSearchRepository;
import com.aladin.security.SecurityUtils;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.service.ultil.Constant;
import com.aladin.web.rest.dto.HistoryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tutorial}.
 */
@Service
@Transactional
public class TutorialService {

    private final Logger log = LoggerFactory.getLogger(TutorialService.class);

    private final TutorialRepository tutorialRepository;

    private final TutorialSearchRepository tutorialSearchRepository;

    private final HistoryService historyService;

    private final UserService userService;

    private final HistoryRepository historyRepository;

    public TutorialService(TutorialRepository tutorialRepository, TutorialSearchRepository tutorialSearchRepository,
                           HistoryService historyService,
                           HistoryRepository historyRepository,
                           UserService userService) {
        this.tutorialRepository = tutorialRepository;
        this.tutorialSearchRepository = tutorialSearchRepository;
        this.historyService = historyService;
        this.userService = userService;
        this.historyRepository = historyRepository;
    }

    /**
     * Save a tutorial.
     *
     * @param tutorial the entity to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllTutorials",allEntries = true),
//        @CacheEvict(value = "findAllTutorialsByAuthoritiesAndLimit",allEntries = true),
//        @CacheEvict(value = "findTutorialsByLimit",allEntries = true),
//        @CacheEvict(value = "findAllTutorialsByLstAuthen",allEntries = true),
//    })
    public Tutorial save(Tutorial tutorial) {
        log.debug("Request to save Tutorial : {}", tutorial);
//        if(tutorial.getId()!=null){
//            saveHistory(tutorial, Constant.METHOD_PUT);
//        }else{
//            saveHistory(tutorial, Constant.METHOD_POST);
//        }
        Tutorial tutorial1 = tutorialRepository.save(tutorial);
        tutorialSearchRepository.save(tutorial1);
        return tutorial1;
    }

    /**
     * Partially update a tutorial.
     *
     * @param tutorial the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Tutorial> partialUpdate(Tutorial tutorial) {
        log.debug("Request to partially update Tutorial : {}", tutorial);

        return tutorialRepository
            .findById(tutorial.getId())
            .map(existingTutorial -> {
                if (tutorial.getTutorial_title() != null) {
                    existingTutorial.setTutorial_title(tutorial.getTutorial_title());
                }
                if (tutorial.getTutorial_video() != null) {
                    existingTutorial.setTutorial_video(tutorial.getTutorial_video());
                }
                if (tutorial.getTutorial_createdDate() != null) {
                    existingTutorial.setTutorial_createdDate(tutorial.getTutorial_createdDate());
                }
//                saveHistory(existingTutorial,Constant.METHOD_PUT);
                tutorialSearchRepository.save(existingTutorial);
                return existingTutorial;
            })
            .map(tutorialRepository::save);

    }

    /**
     * Get all the tutorials.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional
//    @Cacheable(value = "findAllTutorials")
    public Page<Tutorial> findAll(Pageable pageable) {
        log.debug("Request to get all Tutorials");
        return tutorialRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
//    @Cacheable(value = "findAllTutorialsByAuthoritiesAndLimit")
    public List<Tutorial> findAllByAuthoritiesAndLimit() {
        log.debug("Request to get all Tutorials");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<String> lstAtuthorities= new ArrayList<>();
        for (GrantedAuthority author :authentication.getAuthorities()){
            lstAtuthorities.add(author.getAuthority());
        }
        if(lstAtuthorities.contains("ROLE_ADMIN")){
            lstAtuthorities.add("ROLE_STUDENT");
            lstAtuthorities.add("ROLE_LECTURER");
        }

        List<Tutorial> lstTutorials=  tutorialRepository.findByLstAuthAndLimit(lstAtuthorities);
        return lstTutorials;
    }

    @Transactional
//    @Cacheable(value = "findTutorialsByLimit")
    public List<Tutorial> findByLimit(){
        log.debug("Request to findByLimit");
        return  tutorialRepository.findByLimit();
    }

//    @Cacheable(value = "findAllTutorialsByLstAuthen")
    public Page<Tutorial> findAllByLstAuthen(Pageable pageable){
        log.debug("Request to findAllByLstAuthen");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<String> lstAtuthorities= new ArrayList<>();
        for (GrantedAuthority author :authentication.getAuthorities()){
            lstAtuthorities.add(author.getAuthority());
        }
        if(lstAtuthorities.contains("ROLE_ADMIN")){
            Page<Tutorial> page = tutorialRepository.findAllAndOrderById(pageable);
            return page;

        }else{
            Long offset = pageable.getOffset();
            Integer limit = pageable.getPageSize();
            List<Tutorial> lstTutorials=  tutorialRepository.findAllByLstAuth(lstAtuthorities,
                offset,
                limit);
            Long total = tutorialRepository.getTotalByLstAuth(lstAtuthorities);
            Page<Tutorial> page = new PageImpl<Tutorial>(lstTutorials,pageable,total);
            return  page;
        }

    }

    public Long getTotalByLstAuth(){
        log.debug("Request to getTotalByLstAuth");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<String> lstAtuthorities= new ArrayList<>();
        for (GrantedAuthority author :authentication.getAuthorities()){
            lstAtuthorities.add(author.getAuthority());
        }
        return tutorialRepository.getTotalByLstAuth(lstAtuthorities);
    }

    @Transactional(readOnly = true)
    public Long getTotalByIsDisplayAndAuthorities() {
        log.debug("Request to get all Tutorials");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<String> lstAtuthorities= new ArrayList<>();
        for (GrantedAuthority author :authentication.getAuthorities()){
            lstAtuthorities.add(author.getAuthority());
        }
        return tutorialRepository.getTotalByisDisplayAndLstAuth("1", lstAtuthorities);
    }


    /**
     * Get one tutorial by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional()
//    @Cacheable(value = "findOneTutorials", key = "#id")
    public Optional<Tutorial> findOne(Long id) {
        log.debug("Request to get Tutorial : {}", id);
//        if(SecurityUtils.isAuthenticated()){
//            Tutorial tutorial = tutorialRepository.findOneById(id);
//            saveHistory(tutorial,Constant.METHOD_GET);
//        }
        return tutorialRepository.findById(id);
    }

    /**
     * Delete the tutorial by id.
     *
     * @param id the id of the entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findOneTutorials",allEntries = true),
//        @CacheEvict(value = "findAllTutorialsByLstAuthen",allEntries = true),
//        @CacheEvict(value = "findTutorialsByLimit",allEntries = true),
//        @CacheEvict(value = "findAllTutorialsByAuthoritiesAndLimit",allEntries = true),
//        @CacheEvict(value = "findAllTutorials",allEntries = true),
//    })
    public void delete(Long id) {
        log.debug("Request to delete Tutorial : {}", id);
        tutorialRepository.deleteById(id);
        tutorialSearchRepository.deleteById(id);
    }

    /**
     * Search for the tutorial corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Tutorial> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Tutorials for query {}", query);
        return tutorialSearchRepository.search(query, pageable);
    }


    /**
     * deleteMultiByIds.
     *
     * @param ids the query of the search.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findOneTutorials",allEntries = true),
//        @CacheEvict(value = "findAllTutorialsByLstAuthen",allEntries = true),
//        @CacheEvict(value = "findTutorialsByLimit",allEntries = true),
//        @CacheEvict(value = "findAllTutorialsByAuthoritiesAndLimit",allEntries = true),
//        @CacheEvict(value = "findAllTutorials",allEntries = true),
//    })
    public void deleteMultiByIds(String ids){
        tutorialRepository.deleteMultiByIds(ids);
    }


    public void updateDisplay(Long id){
        Tutorial tutorial = tutorialRepository.findOneById(id);
        if(tutorial.getTutorial_isDisplay().equals("0")){
            tutorialRepository.updateDisplay("1",id);
        }else{
            tutorialRepository.updateDisplay("0",id);
        }

    }

//    public List<Tutorial> findAllByIsDisplay(String isDisplay){
//        log.debug("Request to get Tutorials is Display ");
//        return tutorialRepository.findAllByIsDisplay(isDisplay);
//    }

    public void deleteAllByIds(List<Long> ids){
        tutorialRepository.deleteAllByLstId(ids);
    }

    public void saveHistory(Tutorial tutorial, String method){
        StringBuilder sbActivityHistoryName= new StringBuilder();
        switch (method){
            case "POST":{
                sbActivityHistoryName.append("Thêm mới: ");
                break;
            }
            case  "PUT": {
                sbActivityHistoryName.append("Cập nhập: ");
                break;
            }
            case  "GET": {
                break;
            }
            case "DELETE": {
                sbActivityHistoryName.append("Xoá: ");
                break;
            }
        }
        sbActivityHistoryName.append(tutorial.getTutorial_title());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sbActivityHistoryName.toString());
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
//        User user = userService.findOneByLogin("maitinhtiep");
        activityHistory.setUser(user);
        historyRepository.save(activityHistory);
    }
}
