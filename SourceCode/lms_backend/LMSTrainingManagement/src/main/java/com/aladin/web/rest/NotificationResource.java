package com.aladin.web.rest;

import com.aladin.domain.Notification;
import com.aladin.domain.User;
import com.aladin.notification.SseSendNotification;
import com.aladin.repository.NotiReceiverRepository;
import com.aladin.repository.NotificationRepository;
import com.aladin.repository.search.NotificationSearchRepository;
import com.aladin.service.NotificationService;
import com.aladin.service.UserService;
import com.aladin.service.dto.NotificationDto;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.aladin.domain.Notification}.
 */
@RestController
@RequestMapping("/api")
public class NotificationResource {

    private final Logger log = LoggerFactory.getLogger(NotificationResource.class);

    private static final String ENTITY_NAME = "lmsTrainingManagementNotification";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotificationService notificationService;

    private final NotificationRepository notificationRepository;

    private final SseSendNotification sseSendNotification;

    private final NotiReceiverRepository notiReceiverRepository;

    private final UserService userService;

    private final NotificationSearchRepository notificationSearchRepository;


    public NotificationResource(SseSendNotification sseSendNotification,
                                NotificationService notificationService,
                                UserService userService,
                                NotiReceiverRepository notiReceiverRepository,
                                NotificationRepository notificationRepository, NotificationSearchRepository notificationSearchRepository) {
        this.sseSendNotification = sseSendNotification;
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.notiReceiverRepository = notiReceiverRepository;
        this.notificationSearchRepository = notificationSearchRepository;
    }

    /**
     * {@code POST  /notifications} : Create a new notification.
     *
     * @param notification the notification to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new notification, or with status {@code 400 (Bad Request)} if the notification has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/notifications")
    public ResponseEntity<Notification> createNotification(@Valid @RequestBody Notification notification,
                                                           Principal principal) throws URISyntaxException {
        log.debug("REST request to save Notification : {}", notification);
        if (notification.getId() != null) {
            throw new BadRequestAlertException("A new notification cannot already have an ID", ENTITY_NAME, "idexists");
        }
        String userId = userService.getUserID(principal);
        log.info("user_id: "+userId);
        if(!userService.checkIsAdmin(userId)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        String login = AuthenticateUltil.getLoginByCurrentLogin();
        User user = userService.findOneByLogin(login);
        notification.setSender(user);
        Notification result = notificationService.save(notification);
        return ResponseEntity
            .created(new URI("/api/notifications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /notifications/:id} : Updates an existing notification.
     *
     * @param id the id of the notification to save.
     * @param notification the notification to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notification,
     * or with status {@code 400 (Bad Request)} if the notification is not valid,
     * or with status {@code 500 (Internal Server Error)} if the notification couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/notifications/{id}")
    public ResponseEntity<Notification> updateNotification(
        @PathVariable(value = "id", required = false) final Long id, Principal principal,
        @Valid @RequestBody Notification notification
    ) throws URISyntaxException {
        log.debug("REST request to update Notification : {}, {}", id, notification);
        if (notification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        String userId = userService.getUserID(principal);
        log.info("user_id: "+userId);
        if(!userService.checkIsAdmin(userId)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }

        Notification result = notificationService.save(notification);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notification.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /notifications/:id} : Partial updates given fields of an existing notification, field will ignore if it is null
     *
     * @param id the id of the notification to save.
     * @param notification the notification to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notification,
     * or with status {@code 400 (Bad Request)} if the notification is not valid,
     * or with status {@code 404 (Not Found)} if the notification is not found,
     * or with status {@code 500 (Internal Server Error)} if the notification couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/notifications/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Notification> partialUpdateNotification(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Notification notification
    ) throws URISyntaxException {
        log.debug("REST request to partial update Notification partially : {}, {}", id, notification);
        if (notification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notification.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notificationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Notification> result = notificationService.partialUpdate(notification);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notification.getId().toString())
        );
    }

    /**
     * {@code GET  /notifications} : get all the notifications.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notifications in body.
     */
    @GetMapping("/notifications")
    public ResponseEntity<Page<Notification>> getAllNotifications(@org.springdoc.api.annotations.ParameterObject Pageable pageable,
                                                                  Principal principal) {
        log.debug("REST request to get a page of Notifications");
        String userId = userService.getUserID(principal);
        log.info("user_id: "+userId);
        if(!userService.checkIsAdmin(userId)){
            throw new BadRequestAlertException("OnlyAdmin", ENTITY_NAME,"onlyAdmin");
        }
        Page<Notification> page = notificationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    /**
     * {@code GET  /notifications/:id} : get the "id" notification.
     *
     * @param id the id of the notification to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the notification, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/notifications/{id}")
    public ResponseEntity<Notification> getNotification(@PathVariable Long id) {
        log.debug("REST request to get Notification : {}", id);
        Optional<Notification> notification = notificationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(notification);
    }

    /**
     * {@code DELETE  /notifications/:id} : delete the "id" notification.
     *
     * @param id the id of the notification to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        log.debug("REST request to delete Notification : {}", id);
        notificationService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/notifications?query=:query} : search for the notification corresponding
     * to the query.
     *
     * @param query the query of the notification search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/notifications")
    public ResponseEntity<Page<NotificationDto>> searchNotifications(
        @RequestParam String query,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to search for a page of Notifications for query {}", query);
        Page<NotificationDto> page = notificationService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    @CrossOrigin
    @GetMapping(value = "/notifications/registerNotification", consumes = MediaType.ALL_VALUE)
    public SseEmitter registerClient(Principal principal) {
        String login = AuthenticateUltil.getLoginByCurrentLogin();
        log.debug("REST request to register Notification by", login);
        SseEmitter sseEmitter = sseSendNotification.registerClient();
        return sseEmitter;


    }

    /**
     * {@code SEARCH  /notifications/getByuserLogin : get all notification by User Login
     *
     */
    @GetMapping("/notifications/getByReceiverId")
    public ResponseEntity<Page<com.aladin.web.rest.dto.NotificationDto>> getAllByReceiver(Principal principal,
                                                                                          @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        String id = userService.getUserID(principal);
        Page<com.aladin.web.rest.dto.NotificationDto> page = notificationService.getAllByReceiverId(id,pageable);

        return ResponseEntity.ok(page);
    }

    @GetMapping("/notifications/getBySenderId")
    public ResponseEntity<Page<Notification>> getAllBySender(Principal principal,
                                                                       @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        String id = userService.getUserID(principal);

        List<Notification> list = notificationService.getAllBySenderId(id,pageable);
        Long total = notificationService.getTotalBySenderId(id);
//        Map<String, Object> result = new HashMap<>();
//        result.put("total", Long.valueOf(total)) ;
//        result.put("data", list);
        Page page = new PageImpl<Notification>(list,pageable, total);
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/notifications/deletes")
    public ResponseEntity<?> deletesByIds(@RequestBody List<Long> ids){
        log.debug("REST request to deletesByIds Notification ids", ids);
        notificationService.deletesByIds(ids);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PutMapping("/notifications/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, Principal principal){
        log.debug("REST request to deletesByIds Notification id", id);
        String userId = userService.getUserID(principal);
        notiReceiverRepository.updateByNotificationIdAndReceiverId(id, userId);
        return  ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/notifications/sender")
    public ResponseEntity<Page<Notification>> getAllByCurrentUser(Principal principal,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable){
        log.debug("REST request to deletesByIds Notification id");
        String userId = userService.getUserID(principal);
        User user = userService.findOneById(userId);
        Page<Notification> page = notificationService.findAllBySender(user, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/notifications/total-unread-notifications")
    public Long getToTalUnreadNotification(Principal principal) {
        log.debug("REST request to get getToTalUnreadNotification : {}");
        String userId = userService.getUserID(principal);
        Long total = notiReceiverRepository.getToTalUnreadNotification(userId);
        return total;
    }

    @GetMapping("/notifications/receiver-unread")
    public ResponseEntity<Page<com.aladin.web.rest.dto.NotificationDto>> getLstNotificationUnRead(Principal principal,
                                                                                                  @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ){
        String id = userService.getUserID(principal);
        Long total = notiReceiverRepository.getToTalUnreadNotification(id);

        if (total == 0){
            Page<com.aladin.web.rest.dto.NotificationDto> page = new PageImpl<>(new ArrayList<com.aladin.web.rest.dto.NotificationDto>(), pageable , 0);
            return ResponseEntity.ok(page);
        } else {
            Page<com.aladin.web.rest.dto.NotificationDto> page = notificationService.getAllByReceiverIdAndUnRead(id,pageable);
            return ResponseEntity.ok(page);
        }

    }
}
