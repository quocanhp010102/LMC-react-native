package com.aladin.service;

import com.aladin.domain.*;
import com.aladin.repository.NewsRepository;

import java.security.Principal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

import com.aladin.repository.search.NewsSearchRepository;
import com.aladin.security.SecurityUtils;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.service.ultil.Constant;
import org.apache.commons.collections4.PredicateUtils;
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
 * Service Implementation for managing {@link News}.
 */
@Service
@Transactional
public class NewsService {

    private final Logger log = LoggerFactory.getLogger(NewsService.class);

    private final NewsRepository newsRepository;

    private final NewsSearchRepository newsSearchRepository;

    private final HistoryService historyService;

    private final UserService userService;

    public NewsService(NewsRepository newsRepository, NewsSearchRepository newsSearchRepository,
                       UserService userService, HistoryService historyService) {
        this.newsRepository = newsRepository;
        this.newsSearchRepository = newsSearchRepository;
        this.userService = userService;
        this.historyService = historyService;
    }

    /**
     * Save a news.
     *
     * @param news the entity to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//    @CacheEvict(value = "findAllNews", allEntries = true),
//    @CacheEvict(value = "findLimitNewsByIsDisplay", allEntries = true),
//    @CacheEvict(value = "getAllNewsSortByCreatedDateAndIsDisplay",allEntries = true),
//    })
    public News save(News news) {
        log.debug("Request to save News : {}", news);
//        if(news.getId()!=null){
//            saveHistory(news, Constant.METHOD_PUT);
//        }else{
//            saveHistory(news,Constant.METHOD_POST);
//        }
        News news1 = newsRepository.save(news);
        newsSearchRepository.save(news1);
        return news1;
    }

    /**
     * Partially update a news.
     *
     * @param news the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<News> partialUpdate(News news) {
        log.debug("Request to partially update News : {}", news);

        return newsRepository
            .findById(news.getId())
            .map(existingNews -> {
                if (news.getNews_isDisplay() != null) {
                    existingNews.setNews_isDisplay(news.getNews_isDisplay());
                }
                if (news.getNews_created_date() != null) {
                    existingNews.setNews_created_date(news.getNews_created_date());
                }
                if (news.getNews_title() != null) {
                    existingNews.setNews_title(news.getNews_title());
                }
                if (news.getNews_description() != null) {
                    existingNews.setNews_description(news.getNews_description());
                }
                if (news.getNews_content() != null) {
                    existingNews.setNews_content(news.getNews_content());
                }
                if (news.getNews_image() != null) {
                    existingNews.setNews_image(news.getNews_image());
                }
                saveHistory(existingNews,Constant.METHOD_PUT);
                return existingNews;
            })
            .map(newsRepository::save)
            .map(savedNews -> {
                newsRepository.save(savedNews);
                newsSearchRepository.save(savedNews);
                return savedNews;
            });
    }

    /**
     * Get all the news.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */

    @Transactional(readOnly = true)
//    @Cacheable(value = "findAllNews")
    public Page<News> findAll(Pageable pageable) {
        log.debug("Request to get all News");
        return newsRepository.findAll(pageable);
    }

    /**
     * Get one news by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
//    @Cacheable(value = "findOneNews", key = "#id")
    public Optional<News> findOne(Long id, Principal principal) {
        log.debug("Request to get News : {}", id);
//            if(SecurityUtils.isAuthenticated() ) {
//                News news = newsRepository.findOneById(id);
////                saveHistory(news, Constant.METHOD_GET);
//            }
        return newsRepository.findById(id);
    }

    /**
     * Delete the news by id.
     *
     * @param id the id of the entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllNews",allEntries = true),
//        @CacheEvict(value = "findOneNews",allEntries = true),
//        @CacheEvict(value = "findLimitNewsByIsDisplay",allEntries = true),
//        @CacheEvict(value = "getAllNewsSortByCreatedDateAndIsDisplay",allEntries = true),
//    })
    public void delete(Long id) {
        log.debug("Request to delete News : {}", id);
        newsRepository.deleteById(id);
        newsSearchRepository.deleteById(id);
    }

    /**
     * Search for the news corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<News> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of News for query {}", query);
        return newsSearchRepository.search(query, pageable);
    }

    public List<News> searchByTitle(String query){
        log.debug("Request to search  News by title {}", query);
        return newsRepository.searchAllTitle(query);
    }

//    @Cacheable(value = "findLimitNewsByIsDisplay")
    public List<News> findLimitByIsDisplay(){
        List<News> lstNewsIsDisplay = newsRepository.getLimitByIsDisplayAndDisplayDate();
        return lstNewsIsDisplay;
    }
//    @Cacheable(value = "getAllNewsSortByCreatedDateAndIsDisplay")
    public List<News> getAllSortByCreatedDateAndIsDisplay(Pageable pageable){
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        return newsRepository.getAllSortByCreatedDateAndIsDisplay(offset, limit);
    }

    public Long getTotalNews(){
        return newsRepository.totalNews();
    }

    public void deleteMultiByIds(String ids){

        newsRepository.deleteMultiByIds(ids);
        String id[] = ids.split(",");
        for(int i = 0 ;i<id.length; i++){
            newsSearchRepository.deleteById(Long.parseLong(id[i]));
        }
    }

    public void updateDisplay( Long id){
        News news = newsRepository.findOneById(id);
        if(news.getNews_isDisplay().equals("0")){
            newsRepository.updateDisplay("1",id);
        }else{
            newsRepository.updateDisplay("0",id);
        }
    }

    public void saveHistory(News news,String method){
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
        sbActivityHistoryName.append(news.getNews_title());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sbActivityHistoryName.toString());
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        activityHistory.setUser(user);
//        historyService.save(activityHistory);
    }
}
