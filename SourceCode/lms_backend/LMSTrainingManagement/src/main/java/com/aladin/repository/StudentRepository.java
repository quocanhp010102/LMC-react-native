package com.aladin.repository;

import com.aladin.domain.Student;
import com.aladin.domain.User;
import com.aladin.web.rest.dto.StudentExamsDto;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the Student entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query(value = "SELECT * FROM student s WHERE user_id =( SELECT id FROM jhi_user WHERE login ='maitinhtiep')", nativeQuery = true)
    Student findOneByUsername();

    Student findOneByUser(User user);

    @Query(value = "select * from student s where s.id not in (select eh.student_id from exams_history eh) and s.id in\n" +
        "(\n" +
        "select student_id from course_student where course_id in \n" +
        "(\n" +
        "select c.id from course c where c.id =(select course_id from exams where id =:examsId) \n" +
        ")\n" +
        ")\n", nativeQuery = true)
    List<Student> findAllByExamsId(@Param("examsId") Long examsId);

    @Query(value = "SELECT * FROM student WHERE id =:id", nativeQuery = true)
    Student findOneByid(@Param("id") Long id);

    @Transactional
    @Query(value = "SELECT * FROM student WHERE id = (SELECT student_id from exams_history WHERE id =:examHistoryId)", nativeQuery = true)
    Student findOneByExamsHistory(@Param("examHistoryId") Long id);

    @Query(value = "select new com.aladin.web.rest.dto.StudentExamsDto(s.id, s.student_fullname, s.student_code, s.student_avatar) from Student s inner join CourseStudent sc on s.id= sc.student.id inner join Exams e on e.course.id = sc.course.id where e.id =:examsId ORDER BY s.student_fullname " )
    List<StudentExamsDto> getAllStudentOfExams(@Param("examsId") Long examsId);

    @Query(value = "select new com.aladin.web.rest.dto.StudentExamsDto(s.id, eh.student.student_fullname, eh.student.student_code,s.student_avatar, eh.examsHistoryPoint) from ExamsHistory eh inner join  Student s on s.id= eh.student.id  where eh.exams.id =:examsId")
    List<StudentExamsDto> getAllStudentInExamsHistory(@Param("examsId") Long examsId);

    @Query(value = "select count(*) from student where user_id=?1",nativeQuery = true)
    int countStudent(String user_id);

    @Query(value = "select count(*) from jhi_user_authority where authority_name='ROLE_STUDENT' and user_id=?1", nativeQuery = true)
    int countStudentByRole(String user_id);

}
