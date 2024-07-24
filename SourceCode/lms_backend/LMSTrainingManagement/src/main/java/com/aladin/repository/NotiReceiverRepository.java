package com.aladin.repository;

import com.aladin.domain.NotiReceiver;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the NotiReceiver entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotiReceiverRepository extends JpaRepository<NotiReceiver, Long> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO noti_receiver " +
        "        (NOTI_RECEIVER_STATUS , NOTIFICATION_ID, RECEIVER_ID) " +
        "         SELECT " +
        "         '0' NOTI_RECEIVER_STATUS, :notiId NOTIFICATION_ID, jhi.user_id  RECEIVER_ID " +
        "        FROM jhi_user_authority jhi " +
        "        WHERE jhi.AUTHORITY_NAME " +
        "        IN ( " +
        "        :lstRole " +
        "        )", nativeQuery = true)
    void insertWhenInsertNoti(@Param("notiId") Long notiId, @Param("lstRole")List<String> lstRole);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO noti_receiver\n" +
        "        (NOTI_RECEIVER_STATUS , NOTIFICATION_ID, RECEIVER_ID) \n" +
        "         SELECT\n" +
        "         '0' NOTI_RECEIVER_STATUS, :notiId NOTIFICATION_ID, jhi.id  RECEIVER_ID\n" +
        "        FROM jhi_user jhi \n" +
        "        WHERE jhi.id\n" +
        "        IN (\n" +
        "        SELECT s.user_id\n" +
        "        FROM student s \n" +
        "        WHERE s.id in\n" +
        "        (SELECT cs.student_id\n" +
        "        FROM course_student cs \n" +
        "        WHERE cs.course_id =\n" +
        "        (SELECT e.course_id FROM exams e WHERE e.id =:examsId) )\n" +
        "        )", nativeQuery = true)
    void insertWhenInsertExams(@Param("notiId") Long notiId, @Param("examsId") Long examsId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO noti_receiver\n" +
        "        (NOTI_RECEIVER_STATUS , NOTIFICATION_ID, RECEIVER_ID) \n" +
        "         SELECT\n" +
        "         '0' NOTI_RECEIVER_STATUS, :notiId NOTIFICATION_ID, jhi.id  RECEIVER_ID\n" +
        "        FROM jhi_user jhi \n" +
        "WHERE jhi.id \n" +
        "IN (\n" +
        "SELECT s.user_id\n" +
        "FROM student s \n" +
        "WHERE s.id in\n" +
        "(SELECT cs.student_id\n" +
        "FROM course_student cs \n" +
        "WHERE cs.course_id = :courseId )\n" +
        ")",nativeQuery = true)
    void insertWhenInsertCourse(@Param("notiId") Long notiId, @Param("courseId") Long courseId);


    @Modifying
    @Transactional
    @Query(value = "INSERT INTO noti_receiver\n" +
        "        (NOTI_RECEIVER_STATUS , NOTIFICATION_ID, RECEIVER_ID) \n" +
        "         SELECT\n" +
        "         '0' NOTI_RECEIVER_STATUS, :notiId NOTIFICATION_ID, jhi.id  RECEIVER_ID\n" +
        "        FROM jhi_user jhi \n" +
        "        WHERE jhi.id\n" +
        "        IN (\n" +
        "        SELECT s.user_id\n" +
        "        FROM student s \n" +
        "WHERE s.id in\n" +
        "(SELECT cs.student_id\n" +
        "FROM course_student cs \n" +
        "WHERE cs.course_id = \n" +
        "(SELECT l.course_id FROM lesson l WHERE l.id =:lessonId) )\n" +
        ")",nativeQuery = true)
    void insertWhenInsertLesson(@Param("notiId") Long notiId, @Param("lessonId") Long lessonId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM noti_receiver WHERE NOTIFICATION_ID = :notiId", nativeQuery = true)
    void deletesByNotiId(@Param("notiId") Long notiId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM noti_receiver WHERE notification_id =:id", nativeQuery = true)
    void deletesByNotificationId(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE  noti_receiver SET NOTI_RECEIVER_STATUS = '1' WHERE notification_id =:notiId AND RECEIVER_ID =:receiverId", nativeQuery = true)
    void updateByNotificationIdAndReceiverId(@Param("notiId") Long notiId, @Param("receiverId") String receiverId);

    @Modifying
    @Transactional
    @Query(value = "insert into noti_receiver (NOTI_RECEIVER_STATUS,NOTIFICATION_ID,RECEIVER_ID)\n" +
        "values ('0',:notiId,:userId)", nativeQuery = true)
    void insertByUserId(@Param("notiId") Long notiId, @Param("userId") String userId );

    @Query(value = "select NVL(count(*),0) from noti_receiver where receiver_id = :receiverId and noti_receiver_status = 0", nativeQuery = true)
    Long getToTalUnreadNotification(@Param("receiverId") String userId);

    @Modifying
    @Transactional
    @Query(value = "insert into noti_receiver(NOTI_RECEIVER_STATUS , NOTIFICATION_ID, RECEIVER_ID)\n" +
        "select '0' NOTI_RECEIVER_STATUS,\n" +
        "        :notiId NOTIFICATION_ID,\n" +
        "        ju.id  RECEIVER_ID \n" +
        "        from jhi_user ju inner join jhi_user_authority ja \n" +
        "        on ju.id = ja.user_id \n" +
        "        and ja.AUTHORITY_NAME ='ROLE_ADMIN' ", nativeQuery = true)
    void inserWhenAddQuestionsAnswer(@Param("notiId") Long notiId);
}
