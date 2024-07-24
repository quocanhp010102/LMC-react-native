package com.aladin.service;

import com.aladin.domain.Course;
import com.aladin.domain.History;
import com.aladin.domain.Lesson;
import com.aladin.domain.User;
import com.aladin.repository.HistoryRepository;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.aladin.repository.search.HistorySearchRepository;
import com.aladin.web.rest.dto.HistoryDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link History}.
 */
@Service
@Transactional
public class HistoryService {

    private final Logger log = LoggerFactory.getLogger(HistoryService.class);

    private final HistoryRepository historyRepository;

    private final HistorySearchRepository HistorySearchRepository;

    private final UserService userService;

    public HistoryService(HistoryRepository HistoryRepository,
                          UserService userService,
                          HistorySearchRepository historySearchRepository) {
        this.historyRepository = HistoryRepository;
        this.HistorySearchRepository = historySearchRepository;
        this.userService = userService;
    }

    /**
     * Save a History.
     *
     * @param historyDto the entity to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllHistoryByCurrentMonthAndUserLogin", allEntries = true),
//        @CacheEvict(value = "totalHistoryByCurrentMonthAndUserLogin", allEntries = true),
//        @CacheEvict(value = "totalHistoryByDateAndLogin", allEntries = true),
//        @CacheEvict(value = "findAllHistoryByDateAndCurrentUserLogin", allEntries = true),
//    })
    public History save(HistoryDto historyDto, Principal principal) {
        log.debug("Request to save History : {}", historyDto);
        String userId = userService.getUserID(principal);
        User user = userService.findOneById(userId);
        History history = new History();
        StringBuilder sb = new StringBuilder();
        processContent(historyDto.getMethod(), sb);
        sb.append(historyDto.getName());
        if(historyDto.getCourse() != null){
            if(historyDto.getMethod().equals("GET")){
                Course course = new Course();
                course.setId(historyDto.getCourse().getId());
                history.setCourse(course);
            }
        }else if(historyDto.getLesson() != null){
            if(historyDto.getMethod().equals("GET")) {
                Lesson lesson = new Lesson();
                lesson.setId(historyDto.getLesson().getId());
                history.setLesson(lesson);
            }
        }
        history.setHistoryName(sb.toString());
        history.setUser(user);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        history.setHistoryTime(sdf.format(new Date()));

        return historyRepository.save(history);
    }

    /**
     * Partially update a History.
     *
     * @param History the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<History> partialUpdate(History History) {
        log.debug("Request to partially update History : {}", History);

        return historyRepository
            .findById(History.getId())
            .map(existingHistory -> {
                if (History.getHistoryName() != null) {
                    existingHistory.setHistoryName(History.getHistoryName());
                }
                if (History.getHistoryTime() != null) {
                    existingHistory.setHistoryTime(History.getHistoryTime());
                }

                return existingHistory;
            })
            .map(historyRepository::save);
    }

    /**
     * Get all the activityHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<History> findAll(Pageable pageable) {
        log.debug("Request to get all ActivityHistories");
        return historyRepository.findAll(pageable);
    }

    /**
     * Get one History by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<History> findOne(Long id) {
        log.debug("Request to get History : {}", id);
        return historyRepository.findById(id);
    }

    /**
     * Delete the History by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete History : {}", id);
        historyRepository.deleteById(id);
    }

    /**
     * Search for the History corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<History> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ActivityHistories for query {}", query);
        return HistorySearchRepository.search(query, pageable);
    }

//    @Cacheable(value = "findAllHistoryByDateAndCurrentUserLogin")
    public List<History> findAllByDateAndCurrentUserLogin(Pageable pageable){
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login= (String) ((JwtAuthenticationToken) authentication).getToken().getClaims().get("preferred_username");
        return historyRepository.findAllByDateAndLogin(login,  offset, limit);
    }

//    @Cacheable(value = "totalHistoryByDateAndLogin")
    public Long totalHistoryByDateAndLogin(){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login= (String) ((JwtAuthenticationToken) authentication).getToken().getClaims().get("preferred_username");
        log.debug("Request to totalHistoryByDateAndLogin", login);
        return historyRepository.totalHistoryByDateAndLogin(login);
    }

//    @Cacheable(value = "totalHistoryByCurrentMonthAndUserLogin")
    public Long totalHistoryByCurrentMonthAndUserLogin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login= (String) ((JwtAuthenticationToken) authentication).getToken().getClaims().get("preferred_username");
        log.debug("Request to totalHistoryByCurrentMonthAndUserLogin", login);
        return historyRepository.totalHistoryByCurrentMonthAndUserLogin(login);
    }

//    @Cacheable(value = "findAllHistoryByCurrentMonthAndUserLogin")
    public List<History> findAllByCurrentMonthAndUserLogin(Pageable pageable){
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login= (String) ((JwtAuthenticationToken) authentication).getToken().getClaims().get("preferred_username");
        return historyRepository.findAllByCurrentMonthAndUserLogin(login, offset, limit);
    }
//
//    @Caching(evict = {
//        @CacheEvict(value = "findAllHistoryByCurrentMonthAndUserLogin", allEntries = true),
//        @CacheEvict(value = "totalHistoryByCurrentMonthAndUserLogin", allEntries = true),
//        @CacheEvict(value = "totalHistoryByDateAndLogin", allEntries = true),
//        @CacheEvict(value = "findAllHistoryByDateAndCurrentUserLogin", allEntries = true),
//    })
    public void deleteAllByIds(List<Long> ids){
        historyRepository.deleteAllByIds(ids);
    }

    public void processContent(String method, StringBuilder sb){
        switch (method){
            case "POST":{
                sb.append("Thêm mới: ");
                break;
            }
            case  "PUT": {
                sb.append("Cập nhật: ");
                break;
            }
            case  "GET": {
                sb.append("Truy cập: ");
                break;
            }
            case "DELETE": {
                sb.append("Xoá: ");
                break;
            }
        }
    }


}
