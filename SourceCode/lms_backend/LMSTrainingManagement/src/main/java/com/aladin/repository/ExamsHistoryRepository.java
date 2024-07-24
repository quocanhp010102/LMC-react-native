package com.aladin.repository;

import com.aladin.domain.ExamsHistory;
import com.aladin.domain.Student;
import com.aladin.service.dto.ExamsHistoryOfStudentOfCourse;
import com.aladin.web.rest.dto.StudentExamsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the ExamsHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExamsHistoryRepository extends JpaRepository<ExamsHistory, Long> {

    @Transactional
    @Query(value = " SELECT eh.id," +
        " eh.EXAMS_HISTORY_ANSWER," +
        " eh.EXAMS_HISTORY_POINT, " +
        "eh.EXAMS_HISTORY_SUBMISSION_TIME," +
        " eh.EXAMS_HISTORY_TEACHER_COMMENT,\n" +
        "eh.EXAMS_ID," +
        " eh.STUDENT_ID, " +
        "eh.EXAMS_HISTORY_STATUS, " +
        "eh.EXAMS_HISTORY_FILE_ANSWER\n" +
        "FROM exams_history eh inner join (select s.id, s.student_fullname from student s Order by student_fullname asc) tbs on eh.student_id = tbs.id\n" +
        "    WHERE exams_history_status = :status and exams_id =:examsId  AND rownum <= 1 ",nativeQuery = true)
    ExamsHistory findOneByStatusAndExamsId(@Param("status") String status,@Param("examsId") Long examsId);

//    @Query(value = "select " +
//        "eh.id, eh.EXAMS_HISTORY_ANSWER, eh.EXAMS_HISTORY_POINT, to_date(eh.EXAMS_HISTORY_SUBMISSION_TIME,'YYYY-MM-DD HH24:MI:SS') EXAMS_HISTORY_SUBMISSION_TIME, eh.EXAMS_HISTORY_TEACHER_COMMENT, " +
//        "eh.EXAMS_ID, eh.STUDENT_ID, eh.EXAMS_HISTORY_STATUS, eh.EXAMS_HISTORY_FILE_ANSWER " +
//        " from exams_history eh where eh.exams_id in (select e.id from exams e where e.course_id = :courseId ) and student_id = :studentId", nativeQuery = true)
//    Page<ExamsHistory> findAllByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId, Pageable pageable);

    @Query(value = "SELECT new com.aladin.service.dto.ExamsHistoryOfStudentOfCourse(eh.student.student_fullname, e.examName,eh.examsHistorySubmissionTime,eh.examsHistoryPoint,e.id,e.course.id,e.typeOfExams.id)" +
        " FROM ExamsHistory eh inner  join  Exams  e  on eh.exams.id = e.id" +
        "  where eh.student.id=:studentId AND e.course.id = :courseId")
    Page<ExamsHistoryOfStudentOfCourse> findAllByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId, Pageable pageable);

    @Query(value = "select count(*) from exams_history eh where eh.exams_id in (select e.id from exams e where e.course_id = :courseId ) and student_id = :studentId", nativeQuery = true)
    Long getTotalByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId);

//    @Query(value = "      select tbn.id id,\n" +
//        "        tbn.EXAMS_HISTORY_ANSWER  EXAMS_HISTORY_ANSWER,\n" +
//        "        tbn.EXAMS_HISTORY_POINT EXAMS_HISTORY_POINT,\n" +
//        "        tbn.EXAMS_HISTORY_SUBMISSION_TIME EXAMS_HISTORY_SUBMISSION_TIME, \n" +
//        "        tbn.EXAMS_HISTORY_TEACHER_COMMENT EXAMS_HISTORY_TEACHER_COMMENT,\n" +
//        "        tbn.EXAMS_ID EXAMS_ID,\n" +
//        "        s.id STUDENT_ID, \n" +
//        "        tbn.EXAMS_HISTORY_STATUS EXAMS_HISTORY_STATUS,\n" +
//        "        tbn.EXAMS_HISTORY_FILE_ANSWER EXAMS_HISTORY_FILE_ANSWER\n" +
//        "        from student s left outer join \n" +
//        "        (select * from exams_history eh where eh.exams_id in(select id from exams e where e.course_id =:courseId) and eh.student_id=:studentId) tbn on s.id = tbn.student_id\n" +
//        "        ", nativeQuery = true)
//    Page<ExamsHistory> findAllByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId, Pageable pageable);

    @Query(value = "select eh.id, eh.EXAMS_HISTORY_ANSWER, eh.EXAMS_HISTORY_POINT, eh.EXAMS_HISTORY_SUBMISSION_TIME, eh.EXAMS_HISTORY_TEACHER_COMMENT,\n" +
        "        eh.EXAMS_ID, eh.STUDENT_ID, eh.EXAMS_HISTORY_STATUS, eh.EXAMS_HISTORY_FILE_ANSWER\n" +
        "         from exams_history eh where eh.exams_id = :examsId and student_id =:studentId", nativeQuery = true)
    ExamsHistory findOneByExamsIdAndStudentId(@Param("examsId") Long examsId, @Param("studentId") Long studentId);
//    @Query(value = "FROM ExamsHistory  eh WHERE eh.exams.id =:examsId and eh.student.id =:studentId")
//    ExamsHistory findOneByExamsIdAndStudentId(@Param("examsId") Long examsId, @Param("studentId") Long studentId);

    @Query(value = "SELECT * FROM exams_history WHERE exams_id = :examsId AND exams_history_status != 1 AND ROWNUM =1" ,nativeQuery = true)
    ExamsHistory findAllByExamsIdAndStatus(@Param("examsId") Long examsId);

    @Query(value = "select tbn.student_fullname as fullname, tbn.student_code as code, NVL(tbn.exams_history_point,'Chưa nộp bài') as point \n" +
        "from(\n" +
        "select * from student s left outer join (select * from exams_history where exams_id =8002) eh on s.id = eh.student_id\n" +
        "where s.id in (select student_id from course_student where course_id in(select course_id from exams where id =:examsId))) tbn", nativeQuery = true)
    List<ExamsHistory> getStudentAndPoitByExamsId(@Param("examsId") Long examsId);

    @Query(value = "SELECT * FROM exams_history WHERE id =:id", nativeQuery = true)
    ExamsHistory findOneById(@Param("id") Long id);
    @Query(value = "select eh.exams_id from exams_history eh where eh.id =?1 ", nativeQuery = true)
    Long getExamsIdByExamsHistoryId(Long id);

    @Query(value = "select count(*) from exams_history where exams_id = :examsId and exams_history_status =0", nativeQuery = true)
    Long checkExamsHistoryNotGraded(@Param("examsId") Long examsId);



    @Query(value = " select e.id as id, e.exam_name as name, eh.student_id as studentId from exams e inner join exams_history eh on e.id = eh.exams_id and eh.id = :ehId",nativeQuery = true)
    String findExamsAndStudentByExamsHistoryId(@Param("ehId") Long ehId);
}
