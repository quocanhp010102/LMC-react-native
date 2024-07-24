package com.aladin.service;

import com.aladin.domain.Authority;
import com.aladin.domain.NotiReceiver;
import com.aladin.domain.Notification;
import com.aladin.domain.User;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.notification.dto.MessageDto;
import com.aladin.repository.NotiReceiverRepository;
import com.aladin.repository.NotificationRepository;

import java.util.*;

import com.aladin.repository.search.NotificationSearchRepository;
import com.aladin.service.dto.NotificationDto;
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
 * Service Implementation for managing {@link Notification}.
 */
@Service
@Transactional
public class NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    private final NotificationSearchRepository  notificationSearchRepository;

    private final NotiReceiverRepository notiReceiverRepository;

    private final UserService userService;

    private final KafkaSendNotification kafkaSendNotification;

    private final NoteService noteService;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationSearchRepository notificationSearchRepository,
                               KafkaSendNotification kafkaSendNotification,
                               NotiReceiverRepository notiReceiverRepository,
                               NoteService noteService,
                               UserService userService) {
        this.notificationRepository = notificationRepository;
        this.notificationSearchRepository = notificationSearchRepository;
        this.notiReceiverRepository = notiReceiverRepository;
        this.userService = userService;
        this.noteService = noteService;
        this.kafkaSendNotification = kafkaSendNotification;
    }

    /**
     * Save a notification.
     *
     * @param notification the entity to save.
     * @return the persisted entity.
     */
    @Transactional
    public Notification save(Notification notification) {
        log.debug("Request to save Notification : {}", notification);
        if(notification.getNotificationTime() == null){
            notification.setNotificationTime(new Date());
        }
        List<String> lstAuthor = new ArrayList<>();
        if(notification.getAuthorities() != null && notification.getAuthorities().size() >0){
            for(Authority au : notification.getAuthorities()){
                lstAuthor.add(au.getName());
            }
        }

        boolean check = true;
        if(notification.getId() != null){
            check = false;
        }
        Notification notificationOld = new Notification();
        Notification resultf = new Notification();

        if(notification.getId() != null){
            notificationOld = notificationRepository.findOneById(notification.getId());

            User sender = new User();
            sender.setId(userService.getIdByNotificationId(notificationOld.getId()));
            notification.setSender(sender);

            resultf = notificationRepository.save(notification);

                notiReceiverRepository.deletesByNotificationId(notification.getId());
                if(lstAuthor.size() > 0){
                    notiReceiverRepository.insertWhenInsertNoti(resultf.getId(), lstAuthor);
                }
                noteService.deleteWhenNoteInNoteContent();
                noteService.insertOrUpdateWhenInsertNotification(resultf.getId());

        }else{
            resultf = notificationRepository.save(notification);
            notiReceiverRepository.insertWhenInsertNoti(resultf.getId(), lstAuthor);
            noteService.insertOrUpdateWhenInsertNotification(resultf.getId());
        }
        NotificationDto notificationDto = new NotificationDto(resultf);
        notificationSearchRepository.save(notificationDto);
        if(check){
            kafkaSendNotification.alertNotification(notification);
        }
        return resultf;
    }

    /**
     * Partially update a notification.
     *
     * @param notification the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Notification> partialUpdate(Notification notification) {
        log.debug("Request to partially update Notification : {}", notification);

        return notificationRepository
            .findById(notification.getId())
            .map(existingNotification -> {
                if (notification.getNotificationContent() != null) {
                    existingNotification.setNotificationContent(notification.getNotificationContent());
                }
                if (notification.getNotificationTime() != null) {
                    existingNotification.setNotificationTime(notification.getNotificationTime());
                }

                return existingNotification;
            })
            .map(notificationRepository::save);
    }

    /**
     * Get all the notifications.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
//    @Cacheable(value = "findAllNotification")
    public Page<Notification> findAll(Pageable pageable) {
        log.debug("Request to get all Notifications");
        return notificationRepository.findAllByAdmin(pageable);
    }

    /**
     * Get one notification by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
//    @Cacheable(value = "findOneNotification", key = "#id")
    public Optional<Notification> findOne(Long id) {
        log.debug("Request to get Notification : {}", id);
        return notificationRepository.findById(id);
    }

    /**
     * Delete the notification by id.
     *
     * @param id the id of the entity.
     */

    public void delete(Long id) {
        log.debug("Request to delete Notification : {}", id);
        notificationRepository.deleteById(id);
        notificationSearchRepository.deleteById(id);
    }

    /**
     * Search for the notification corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NotificationDto> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Notifications for query {}", query);
        return notificationSearchRepository.search(query, pageable);
    }


    public Notification insertWhenAddExams(Notification notification, MessageDto messageDto){
        log.debug("Request to insert for Notifications where add Exams");
//        notificationRepository.insertWhenaddExams(messageDto.getId(),messageDto.getName());
        notification = notificationRepository.save(notification);
        notiReceiverRepository.insertWhenInsertExams(notification.getId(), messageDto.getId());
        return  notification;
    }


    public Notification insertWhenAddCourse(Notification notification,User user){
//        log.debug("Request to insert for Notifications where add Course",messageDto.getId(),messageDto.getName());
        notification = notificationRepository.save(notification);
        NotiReceiver notiReceiver = new NotiReceiver();
        notiReceiver.setNotiReceiverStatus("0");
        notiReceiver.setNotification(notification);
        notiReceiver.setReceiver(user);
        notiReceiverRepository.save(notiReceiver);
        return  notification;
    }


    public Notification insertWhenAddLesson(Notification notification,MessageDto messageDto){
        log.debug("Request to insert for Notifications where add Exams");
        notification = notificationRepository.save(notification);
        notiReceiverRepository.insertWhenInsertLesson(notification.getId(), messageDto.getId());
        return notification;
    }


    public void insertWhenAddQuestionAnswer(Notification notification){
        log.debug("Request to insert for Notifications where add Exams");
        notiReceiverRepository.inserWhenAddQuestionsAnswer(notification.getId());
    }


    public List<Notification> getAllByUserLogin(String login, List<String> authName, Pageable pageable){
        log.debug("Request to get all  Notifications by User Login");
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        List<Notification> lst = notificationRepository.getAllByUerLogin(login, authName, offset, limit);
        return lst;
    }

    public Page<com.aladin.web.rest.dto.NotificationDto> getAllByReceiverId(String receiverId, Pageable pageable){
        log.debug("Request to get all  Notifications by User Login");
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        Page<com.aladin.web.rest.dto.NotificationDto> page = notificationRepository.getAllByReceiverId(receiverId, pageable);
        return page;
    }

    public Page<com.aladin.web.rest.dto.NotificationDto> getAllByReceiverIdAndUnRead(String receiverId, Pageable pageable){
        log.debug("Request to get all  Notifications by User Login");
        Page<com.aladin.web.rest.dto.NotificationDto> page = notificationRepository.getAllByReceiverIdAndUnRead(receiverId, pageable);
        return page;
    }

    public List<Notification> getAllBySenderId(String senderId, Pageable pageable){
        log.debug("Request to get all  Notifications by User Login");
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        List<Notification> lst = notificationRepository.getAllBySenderId(senderId, offset, limit);
        return lst;
    }


    public Long getTotalByReceiverId(String receiverId){
        return notificationRepository.getTotalByReceiverId(receiverId);
    }

    public Long getTotalBySenderId(String senderId){
        return notificationRepository.getTotalBySenderId(senderId);
    }

    @Transactional
    public void deletesByIds(List<Long> ids){
        log.debug("Request to deletesByIds  Notifications by ids", ids);
        notificationRepository.deletesByIds(ids);
        notificationSearchRepository.deleteAllById(ids);
    }

    public void updateStatusById(Long id){
        log.debug("Request to updateById  Notifications by id", id);
        notiReceiverRepository.deletesByNotiId(id);
        notificationRepository.updateStatusById(id);
    }

    public Page<Notification> findAllBySender(User sender, Pageable pageable){
        log.debug("Request to findAllBySender ");
        return  notificationRepository.findAllBySender(sender, pageable);
    }

    public Notification findOneByTitleAndSenderId(String title, String senderId){
        log.debug("Request to findOneByTitleAndSenderId ", senderId);
       return notificationRepository.findOneByTitleAndSenderId(title, senderId);
    }


}
