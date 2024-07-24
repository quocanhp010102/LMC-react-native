package com.aladin.repository;

import com.aladin.domain.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * Spring Data SQL repository for the Note entity.
 */
@SuppressWarnings("unused")
@Repository

public interface NoteRepository extends JpaRepository<Note, Long> {

    @Transactional
    @Query(value = "SELECT * FROM note WHERE user_id = (SELECT id FROM jhi_user WHERE login =:login)", nativeQuery = true)
    List<Note> getAllByCurrentUserLogin(@Param("login") String login);

//    @Transactional
//    @Query(value = "SELECT * FROM note WHERE user_id = (SELECT id FROM jhi_user WHERE login =:login) " +
//                    " AND note_date in (SELECT * " +
//                    "FROM (" +
//                    "SELECT TRUNC(TO_DATE(:date, 'dd/mm/yyyy'), 'MM') + LEVEL - 1 AS day " +
//                    "    FROM dual " +
//                    "    CONNECT BY LEVEL <= 32 )" +
//                    "WHERE EXTRACT(MONTH FROM day) = EXTRACT(MONTH FROM TO_DATE(:date, 'dd/mm/yyyy'))) ", nativeQuery = true)


    @Query(value = "SELECT id, \n" +
        "to_date(TO_CHAR(TO_DATE(CAST(n.note_date AS DATE),'DD-MON-YY', 'NLS_DATE_LANGUAGE = English'),\n" +
        "           'yyyy-MM-dd'),'yyyy-mm-dd')  note_date,\n" +
        "\n" +
        "n.user_id\n" +
        "FROM note n WHERE user_id = \n" +
        "(SELECT id FROM jhi_user WHERE login =:login) \n" +
        "AND  extract(month from n.note_date)= EXTRACT( month FROM TO_DATE( :date,  'DD-Mon-YY ' ) ) ",
    nativeQuery = true)
    List<Note> getAllByCurrentUserLoginAndMonth(@Param("login") String login, @Param("date") String date);

    @Query(value = "select * from note where user_id = \n" +
        "(select id from jhi_user where login=:login) \n" +
        "and to_date(to_char(note_date,'dd-mm-yyyy'),'dd-mm-yyyy') =to_date(:date,'dd-mm-yyyy') ", nativeQuery = true)
    Note findOneByDateAndUserId(@Param("date") String date, @Param("login") String login);

    @Procedure("NOTE_INSERT_OR_UPDATE")
    void insertWhenInsertExams(Long examsId);

    @Query(value = "SELECT id, \n" +
        "to_date(TO_CHAR(TO_DATE(CAST(n.note_date AS DATE),'DD-MON-YY', 'NLS_DATE_LANGUAGE = English'),\n" +
        "           'yyyy-MM-dd'),'yyyy-mm-dd')  note_date,\n" +
        "n.user_id  FROM note n,dual WHERE id = :id" , nativeQuery = true)
    Note getOneById(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "delete from note n where n.id not in (select nc.note_id from note_content nc)", nativeQuery = true)
    void deleteWhenNoteInNoteContent();

    @Procedure("SP_NOTE_NOTIFICATION")
    void insertWhenInsertNotification(Long notificationId);
}
