package com.aladin.repository;

import com.aladin.domain.CourseStudent;
import com.aladin.service.dto.CourseLectureDTO;
import com.aladin.service.dto.CourseManagerDTO;
import com.aladin.service.dto.CoursePercentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the CourseStudent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseStudentRepository extends JpaRepository<CourseStudent, Long> {

    //update number student in course
    @Procedure("sp_updateTotalStudent")
    void updateTotalStudent(Long course_id);

    //find course by student id
    @Query(value = "select * from course_student where student_id=?1", nativeQuery = true)
    Page<CourseStudent> findCourseByStudent(String student_id, Pageable pageable);

    //find student by course_id
    @Query(value = "select * from course_student cs inner join student s on  cs.student_id=s.id  where course_id=?1 order by s.student_fullname asc  ", nativeQuery = true)
    Page<CourseStudent> findtudentsByCourse(Long course_id, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "delete course_student where course_id=?1", nativeQuery = true)
    void deleteCourseStudentByCourse(Long course_id);

    @Modifying
    @Transactional
    @Query(value = "delete from course_student where course_id=?1 and student_id=?2  ", nativeQuery = true)
    void deleteStudentFromCourse( Long courseID, Long studentID);

    @Query(value = "SELECT u.id FROM User u WHERE u.login=?1")
    String getIdUser(String login);

    @Query(value = "SELECT c FROM CourseStudent c where c.course.id=?1")
    Page<CourseStudent> findByCourseId(Long id,Pageable pageable);

    @Query(value = "SELECT percent FROM course_student where course_id=?1 and student_id=?2",nativeQuery = true)
    float percentComplete(Long courseId,Long studentId);

    @Query(value = "select distinct new com.aladin.service.dto.CoursePercentDTO(c.id,c.courseName,c.courseImage,cs.course_percent,max(cs.id)) " +
        "FROM CourseStudent cs inner join Course c on cs.course.id=c.id " +
        "inner join Student st on cs.student.id=st.id  " +
        "WHERE st.user.id=?1 " +
        "group by c.id,c.courseName,c.courseImage,cs.course_percent " +
        "order by max(cs.id) desc ")
    Page<CoursePercentDTO> courseStudentPercentDTO(Pageable pageable, String studentId);

    @Query(value = "select new com.aladin.service.dto.CoursePercentDTO(c.id,c.courseName,c.courseImage,cs.course_percent) " +
        "FROM Student st inner join CourseStudent cs on cs.student.id=st.id " +
        "inner join Course c on c.id=cs.course.id inner join ActivityHistory at on st.user.id=at.user.id "+
        "WHERE at.user.id=?1 order by to_date(at.activityHistoryTime,'YYYY-MM-DD HH24:MI:SS') DESC")
    Page<CoursePercentDTO> courseStudentPercentHistoryDTO(Pageable pageable,String studentId);

    @Query(value = "select distinct new com.aladin.service.dto.CourseLectureDTO(c.id,c.courseName,c.courseImage) " +
        "from Course c inner join Lecturer lt on c.lecturer.id=lt.id " +
        "where lt.id=?1 ORDER BY c.id desc")
    Page<CourseLectureDTO> getCourseLecture(Pageable pageable, Long lectureId);

    @Query(value = "select new com.aladin.service.dto.CourseLectureDTO(c.id,c.courseName,c.courseImage) " +
        "from Course c inner join Lecturer lt on c.lecturer.id=lt.id " +
        "inner join ActivityHistory at on c.id=at.course.id " +
        "where lt.user.id=?1 order by to_date(at.activityHistoryTime,'YYYY-MM-DD HH24:MI:SS') DESC")
    Page<CourseLectureDTO> getCourseLectureHistory(Pageable pageable,String lectureId);

    @Query(value = "select new com.aladin.service.dto.CourseManagerDTO(cs.course.id,cs.course.courseName,s.student_fullname,cs.course_percent," +
        "se.percent,s.id,s.student_code) " +
        "from CourseStudent cs inner join Student s on s.id=cs.student.id " +
        "left outer join StudentExam se on se.student.id =s.id where cs.course.id=?1")
    Page<CourseManagerDTO> getCourseManager(Pageable pageable, Long courseId);

    @Query(value = "select new com.aladin.service.dto.CourseManagerDTO(cs.course.id,cs.course.courseName,s.student_fullname,cs.course_percent," +
        "se.percent,s.id,s.student_code) " +
        "from CourseStudent cs inner join Student s on s.id=cs.student.id " +
        "left outer join StudentExam se on se.student.id =s.id where cs.course.id=?1 and s.student_fullname like ?2")
    Page<CourseManagerDTO> searchCourseManagerByName(Pageable pageable, Long courseId, String student_name);

    @Query(value = "SELECT l.id FROM Lecturer l WHERE l.user.id=?1")
    String getLectureId(String lecturer);

    @Procedure
    void SP_UPDATE_COURSE_TOTAL_STUDENT(Long courseId);

    @Query(value = "select new com.aladin.service.dto.CoursePercentDTO(c.id,c.courseName,c.courseImage,cs.course_percent) " +
        "FROM CourseStudent cs inner join Course c on cs.course.id=c.id " +
        "inner join Student st on cs.student.id=st.id " +
        "WHERE st.user.id=?1 and c.courseName like ?2")
    Page<CoursePercentDTO> searchCourseStudentPercentDTO(String user_id, String studentId, Pageable pageable);

    @Query(value = "select h.course_id,c.course_name,cs.percent,c.course_image,Max(to_date(h.history_time,'YYYY-MM-DD HH24:MI:SS')) as max_time from history h \n" +
        "inner join course c on c.id=h.course_id inner join course_student cs on cs.course_id =c.id\n" +
        "where cs.student_id=?1 \n" +
        "group by h.course_id,c.course_name,cs.percent,c.course_image\n" +
        "ORDER BY max_time desc fetch first 6 rows only", nativeQuery = true)
    List<Object[]> getCourseStudentPercentHistory(Long student_id);

    @Query(value = "select c.id,c.course_name,c.COURSE_IMAGE,Max(to_date(h.history_time,'YYYY-MM-DD HH24:MI:SS')) as max_time  from history h inner join course c \n" +
        "            on h.course_id=c.id where c.lecturer_id=?1\n" +
        "            group by c.id,c.course_name,c.COURSE_IMAGE\n" +
        "            order by max_time desc fetch first 6 rows only",nativeQuery = true)
    List<Object[]> getCourseLectureHistory(String lectureId);

    @Query(value = "select count(*) from course_student cs where cs.course_id=?1 and cs.student_id=?2", nativeQuery = true)
    Integer countCourseStudentByStudent(Long course_id, Long student_id);

    @Transactional
    @Modifying
    @Query(value = "delete from student_lesson st where st.STUDENT_ID=?1 and st.LESSON_ID=?2",nativeQuery = true)
    void deleteStudentLessonByStudentIdAndCourseId( Long studentId, Long lesson_id);

}
