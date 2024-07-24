package com.aladin.repository;

import com.aladin.domain.ClassroomStudent;
import com.aladin.domain.CourseStudent;
import com.aladin.domain.Student;
import com.aladin.service.dto.StudentCourseDTO;
import com.aladin.service.dto.StudentDTO;
import com.aladin.service.dto.StudentsDTO;
import com.aladin.service.dto.UserOnlyDTO;
import liquibase.pro.packaged.Q;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the Student entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query(value = "select distinct s from Student s inner join CourseStudent cs on s.id=cs.student.id where cs.course.id=?1")
    Page<Student> getStudentByCourse(Long course_id, Pageable pageable);

    @Query(value = "select count(*) from student where user_id=?1", nativeQuery = true)
    int countStudent(String user_id);

    @Query(value = "select count(*) from jhi_user_authority where authority_name='ROLE_STUDENT' and user_id=?1", nativeQuery = true)
    int countStudentByRole(String user_id);

    @Query(value = "select * from Student where user_id=?1", nativeQuery = true)
    Student getStudentByUser(String user_id);

    @Query(value = "select new com.aladin.service.dto.StudentsDTO(c.courseName, s.student_fullname, cs.course_percent) from Course c inner join CourseStudent cs on c.id = cs.course.id inner  join Student s on cs.student.id=s.id where c.id=?1")
    Page<StudentsDTO> getStudentsByCoursesId(Long id, Pageable pageable);


    @Query(value = "SELECT tbn.id, tbn.fullname, a.authority_name as role  FROM  (select distinct NVL(l.user_id,s.user_id) as id," +
        " NVL(l.lecturer_fullname, s.student_fullname) as fullname\n" +
        "from USER u inner join Lecturer l on u.id=l.user_id full join student s on u.id=s.user_id ) tbn " +
        "inner join JHI_USER_AUTHORITY a on a.user_id =tbn.id where a.authority_name !='ROLE_USER'\n", nativeQuery = true)
    Page<UserOnlyDTO> getAllUserWithRole(Pageable pageable);

    @Query(value = "select * from student l inner join jhi_user u on l.user_id=u.id inner join jhi_user_authority ja on ja.user_id=u.id where ja.authority_name != 'ROLE_USER'", nativeQuery = true)
    Page<Student> getStudentNotUser(Pageable pageable);

    @Query("select new com.aladin.service.dto.StudentDTO(cr.student.id,cr.student.student_code, cr.student.student_birthday,cr.student.student_email,cr.student.student_fullname, cr.student.student_gender,cr.student.student_phone,cr.student.student_avatar,cr.classroom) from ClassroomStudent cr where cr.student.id=?1")
    Page<StudentDTO> getStudentAndClass(Long id, Pageable pageable);

    @Query(value = "select * from Student where user_id=?1", nativeQuery = true)
    Student getStudentById(String id);

    @Query(value = "select new com.aladin.service.dto.StudentsDTO(c.courseName, s.student_fullname, cs.course_percent) from Course c inner join CourseStudent cs on c.id = cs.course.id inner  join Student s on cs.student.id=s.id where c.id=?1 and s.student_fullname like %?2%")
    Page<StudentsDTO> getStudentsByCoursesAndName(Long course_id, String name, Pageable pageable);

    @Query(value = "select * from student l inner join jhi_user u on l.user_id=u.id inner join jhi_user_authority ja on ja.user_id=u.id where ja.authority_name != 'ROLE_USER' and(l.student_fullname like ?1 or u.login like ?1 or ja.authority_name like ?1) ", nativeQuery = true)
    Page<Student> getStudentNotUserByAll(Pageable pageable, String param);

    @Transactional
    @Modifying
    @Query(value = "delete from student where user_id=?1", nativeQuery = true)
    void deleteStudentByUser(String user_id);

    @Query(value = "SELECT * FROM student where id =?1", nativeQuery = true)
    Student findOneById(Long id);

    @Query(value = "select distinct s.* from classroom_student cs inner join classroom c on c.id=cs.classroom_id inner join student s on s.id= cs.student_id where s.student_fullname like ?1 or s.student_code like ?1 or c.classroom_code like ?1", nativeQuery = true)
    Page<Student> getListStudentOnClass(String param, Pageable pageable);

    @Query(value = "select count(*) from classroom_student cs inner join classroom c on c.id=cs.classroom_id inner join student s on s.id= cs.student_id where s.student_fullname like ?1 or s.student_code like ?1 or c.classroom_code like ?1", nativeQuery = true)
    int countStudentOnClass(String param);

    @Query(value = "select distinct s.* from student s inner join course_student cs on s.id=cs.student_id \n" +
        "inner join classroom_student c on s.id=c.student_id inner join classroom d on c.classroom_id=d.id where s.student_code like ?1 or s.student_fullname like ?1 or d.classroom_code like ?1", nativeQuery = true)
    Page<Student> getStudentByNameCodeAndClass(String query, Pageable pageable);

    @Query(value = "select s.* from student s inner join course_student cs on s.id= cs.student_id where cs.course_id=?1", nativeQuery = true)
    List<Student> getAllStudentIDByCourse(Long course_id);

    @Query(value = "select * from student where student.student_code=?1", nativeQuery = true)
    Student getStudentsByStudentCode(String studentCode);

    @Query(value = "select  distinct s from Student s where s.id not in (select cs.student.id from CourseStudent cs where cs.course.id=?1 ) ")
    Page<Student> getAllStudentNotInCourse(Long course_id, Pageable pageable);

    @Query(value = "select  distinct s from Student s where s.id not in (select cs.student.id from CourseStudent cs where cs.course.id=?1 )  and lower(s.student_fullname) like ?2 ")
    Page<Student> getStudentNotInCourse(Long course_id, String student_name, Pageable pageable);

    @Query(value = "select  distinct s from Student s where s.id not in (select cs.student.id from ClassroomStudent cs where cs.classroom.id=?1 )  ")
    Page<Student> getAllStudentNotInClassroom(Long classroom_id, Pageable pageable);

    @Query(value = "select  distinct s from Student s where s.id not in (select cs.student.id from ClassroomStudent cs where cs.classroom.id=?1 )  and lower(s.student_fullname) like ?2 ")
    Page<Student> getStudentNotInClassroom(Long classroom_id, String student_name, Pageable pageable);


}
