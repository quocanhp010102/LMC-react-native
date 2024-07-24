package com.aladin.repository;

import com.aladin.domain.Exams;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

/**
 * Spring Data SQL repository for the Exams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExamsRepository extends JpaRepository<Exams, Long> {

//    @Query(value = "SELECT * FROM exams WHERE id=:id", nativeQuery = true)
    Exams findOneById(@Param("id") Long id);

    @Query(value = "SELECT * FROM exams WHERE course_id = :id order by id desc offset :start rows fetch next :limit rows only", nativeQuery = true)
    List<Exams> findAllByCourseId(@Param("id") Long id,
                                  @Param("start") Long start,
                                  @Param("limit") Integer limit);

    @Query(value = "SELECT * FROM exams WHERE course_id = :id and UPPER (exam_name) like UPPER( '%'||:query||'%')", nativeQuery = true)
    List<Exams> searchAllByCourseIdAndExamsName(@Param("id") Long id,
                                  @Param("query") String query);

    @Query(value = "SELECT count(*) FROM exams WHERE course_id = :id", nativeQuery = true)
    Long getTotalByCourseId(@Param("id") Long id);

    @Query(value = "SELECT exam_total_student_submitted FROM exams e WHERE e.id=:id", nativeQuery = true)
    Long getTotalStudentSubmittedById(@Param("id") Long id);

    @Query(value = "UPDATE exams SET exam_total_student_submitted = :totalStudent WHERE id= :id", nativeQuery = true)
    @Transactional
    @Modifying
    void upDateTotalStudentSubmitedById(@Param("totalStudent") Long totalStudent ,@Param("id") Long id);

    @Procedure("UPDATE_EXAMS")
    void updateTotalSubmitAndPercentSubmit(Long examsId);

    @Procedure("SP_EXAMS_GRADED")
    void updateTotalGradedWhenLecturerGraded(Long examsId);


    @Query(value = "UPDATE exams SET EXAM_STATUS = :status WHERE id= :id", nativeQuery = true)
    @Transactional
    @Modifying
    void updateStatusById(@Param("status") Long status ,@Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM exams WHERE id IN(\n" +
        "(SELECT to_number(column_value) AS IDs FROM xmltable(:ids))\n" +
        ")", nativeQuery = true)
    void deleteMultiByIds(@Param("ids") String ids);

    @Query(value = "select NVL(count(*),0)  from exams_history eh where exams_id =:examsId and student_id =(select s.id from student s where s.user_id =:userId)", nativeQuery = true)
    Long checkStudentPassExams(@Param("examsId") Long examsId,@Param("userId") String userId);

    @Query(value = "   select NVL(count(*),0) from exams e where e.id = :examsId and to_date(SYSDATE,'YYYY-MM-DD HH24:MI:SS')  between to_date(e.EXAM_OPEN_TIME,'YYYY-MM-DD HH24:MI:SS')  \n" +
        "                and to_date(e.EXAM_CLOSE_TIME,'YYYY-MM-DD HH24:MI:SS') ", nativeQuery = true)
    Long checkTimePassExams(@Param("examsId") Long examsId);

    @Query(value = "SELECT * FROM EXAMS WHERE id =(select exams_id from exams_history eh where eh.exams_id =:id )", nativeQuery = true)
    Exams getOneByExamsHistoryId(@Param("id") Long id);



}
