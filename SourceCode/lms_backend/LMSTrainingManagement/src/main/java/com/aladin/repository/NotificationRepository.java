package com.aladin.repository;

import com.aladin.domain.History;
import com.aladin.domain.Notification;
import com.aladin.domain.User;
import com.aladin.web.rest.dto.NotificationDto;
import liquibase.pro.packaged.P;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the Notification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO notification \n" +
        "(notification_content , notification_time, notification_status, receiver_id) \n" +
        "SELECT\n" +
        ":content notification_content, SYSDATE notification_time, '0' notification_status, jhi.id user_id \n" +
        "FROM jhi_user jhi \n" +
        "WHERE jhi.id \n" +
        "IN (\n" +
        "SELECT s.user_id\n" +
        "FROM student s \n" +
        "WHERE s.id in\n" +
        "(SELECT cs.student_id\n" +
        "FROM course_student cs \n" +
        "WHERE cs.course_id = \n" +
        "(SELECT e.course_id FROM exams e WHERE e.id =:examsId) )\n" +
        ")", nativeQuery = true)
    void insertWhenaddExams(@Param("examsId") Long examsId, @Param("content") String content);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO notification \n" +
        "(notification_content , notification_time, notification_status, receiver_id) \n" +
        "SELECT\n" +
        ":content notification_content, SYSDATE notification_time, '0' notification_status, jhi.id user_id \n" +
        "FROM jhi_user jhi \n" +
        "WHERE jhi.id \n" +
        "IN (\n" +
        "SELECT s.user_id\n" +
        "FROM student s \n" +
        "WHERE s.id in\n" +
        "(SELECT cs.student_id\n" +
        "FROM course_student cs \n" +
        "WHERE cs.course_id = :courseId )\n" +
        ")",nativeQuery = true)
    void insertWhenAddCourse(@Param("courseId") Long courseId, @Param("content") String content) ;

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO notification \n" +
        "(notification_content , notification_time, notification_status, receiver_id) \n" +
        "SELECT\n" +
        ":content notification_content, SYSDATE notification_time, '0' notification_status, jhi.id user_id \n" +
        "FROM jhi_user jhi \n" +
        "WHERE jhi.id \n" +
        "IN (\n" +
        "SELECT s.user_id\n" +
        "FROM student s \n" +
        "WHERE s.id in\n" +
        "(SELECT cs.student_id\n" +
        "FROM course_student cs \n" +
        "WHERE cs.course_id = \n" +
        "(SELECT l.course_id FROM lesson l WHERE l.id =:lessonId) )\n" +
        ")",nativeQuery = true)
    void insertWhenAddlesson(@Param("lessonId") Long lessonId, @Param("content") String content);




//    @Query(value = "SELECT * FROM notification n \n" +
//        "WHERE n.user_id =\n" +
//        "(SELECT id FROM jhi_user jhi WHERE jhi.login=:login) \n" +
//        "ORDER BY n.notification_status desc, n.NOTIFICATION_TIME desc", nativeQuery = true)

    @Query(value = "select * from notification n where n.user_id = (select id from jhi_user where login =:login) or n.id in\n" +
        "(select na.notification_id from notification_authorities na where na.authority_name in (:authName))\n" +
        "ORDER BY n.notification_status desc, n.NOTIFICATION_TIME desc offset :start rows fetch next :limit rows only", nativeQuery = true)
    List<Notification> getAllByUerLogin(@Param("login") String login,
                                        @Param("authName") List<String> authName,
                                        @Param("start") Long start,
                                        @Param("limit") Integer limit);



    @Query(value = "select count(*) from notification n where n.user_id = (select id from jhi_user where login =:login) or n.id in\n" +
        "(select na.notification_id from notification_authorities na where na.authority_name in (:authName))\n"
        , nativeQuery = true)
    Long totalByUserLogin(@Param("login") String login,
                          @Param("authName") List<String> authName);

//    @Query(value = "DELETE FROM notification WHERE id in(:ids)", nativeQuery = true)
//    @Transactional
//    @Modifying
//    void deletesByIds(@Param("ids") List<Long> ids);

    @Query(value = "UPDATE  notification SET notification_status = 1 WHERE id = :id", nativeQuery = true)
    @Transactional
    @Modifying
    void updateStatusById(@Param("id") Long id);

    Page<Notification> findAllBySender(User user, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM notification WHERE sender_id =:senderId", nativeQuery = true)
    Long getTotalBySenderId(@Param("senderId") String senderId);



   @Query("SELECT new com.aladin.web.rest.dto.NotificationDto(n.id, n.notificationTitle, n.notificationContent, n.notificationTime, nr.notiReceiverStatus, nr.receiver.id, nr.receiver.imageUrl)" +
       " FROM Notification n INNER JOIN NotiReceiver nr on n.id = nr.notification.id WHERE nr.receiver.id =:receiverId ORDER BY n.notificationTime DESC ")
    Page<NotificationDto> getAllByReceiverId(@Param("receiverId") String receiverId,
                                             Pageable pageable);

    @Query("SELECT new com.aladin.web.rest.dto.NotificationDto(n.id, n.notificationTitle, n.notificationContent, n.notificationTime, nr.notiReceiverStatus, nr.receiver.id, nr.receiver.imageUrl)" +
        " FROM Notification n INNER JOIN NotiReceiver nr on n.id = nr.notification.id WHERE nr.receiver.id =:receiverId and nr.notiReceiverStatus = '0' ORDER BY n.notificationTime DESC ")
    Page<NotificationDto> getAllByReceiverIdAndUnRead(@Param("receiverId") String receiverId,
                                             Pageable pageable);

    @Query(value = "select COUNT(*) from notification n where id in " +
        "(select notification_id from noti_receiver where receiver_id =:receiverId)" , nativeQuery = true)
    Long getTotalByReceiverId(@Param("receiverId") String receiverId);

    @Query(value = "select * from notification  where sender_id =:senderId " +
        "offset :start rows fetch next :limit rows only ", nativeQuery = true)
    List<Notification> getAllBySenderId(@Param("senderId") String senderId,
                                        @Param("start") Long start,
                                        @Param("limit") Integer limit);

//    @Query(value = "select * from notification n where sender_id =:senderId", nativeQuery = true)
//    Long getTotalBySenderId(@Param("receiverId") Long receiverId);

    @Query(value = "SELECT * FROM notification WHERE id = :id", nativeQuery = true)
    Notification findOneById(@Param("id") Long id);

    @Query(value = "select * from notification where notification_title like :title and SENDER_ID =:senderId", nativeQuery = true)
    Notification findOneByTitleAndSenderId(@Param("title") String title, @Param("senderId")String senderId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM notification WHERE id in (:ids)", nativeQuery = true)
    void deletesByIds(@Param("ids") List<Long> ids);

    @Query(value = "SELECT * FROM notification n WHERE n.id in (select DISTINCT(notification_id) from notification_authorities) Order BY n.id desc ", nativeQuery = true)
    Page<Notification> findAllByAdmin(Pageable pageable);

    @Transactional
    @Query("SELECT new com.aladin.web.rest.dto.NotificationDto(n.id, n.notificationTitle, n.notificationContent, n.notificationTime, nr.notiReceiverStatus, nr.receiver.id, nr.receiver.imageUrl)" +
        " FROM Notification n INNER JOIN NotiReceiver nr on n.id = nr.notification.id WHERE nr.receiver.id in (:lstReceiverId) and n.id =:notiId ")
    List<NotificationDto> getAllByReceiverIdAndNotiId(@Param("lstReceiverId") List<String> lstReceiverId,
                                             @Param("notiId") Long notiId);

    @Query(value = "SELECT * FROM notification n WHERE n.id in (select DISTINCT(notification_id) from notification_authorities)  ", nativeQuery = true)
    List<Notification> getToSearch();
}
