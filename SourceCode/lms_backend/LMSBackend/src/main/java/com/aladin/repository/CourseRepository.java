package com.aladin.repository;

import com.aladin.domain.Course;
import com.aladin.service.dto.CourseDepartmentDTO;
import com.aladin.service.dto.CourseOnlyDTO;
import com.aladin.service.dto.CoursePercentDTO;
import com.aladin.service.dto.CoursesDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data SQL repository for the Course entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query(value = "select count(*) from Course where department_id= ?1", nativeQuery = true)
    int countCourseByDepartment(Long department);

    @Query(value = "select distinct new com.aladin.service.dto.CoursePercentDTO(c.id, c.courseName, c.courseImage, cs.course_percent) from Course c inner join CourseStudent cs on c.id=cs.course.id where cs.student.id=?1")
    Page<CoursePercentDTO> getCourseByCurrentStudent(Long student_id, Pageable pageable);

//    @Query(value = "select c.* from department d inner join course c on d.id=c.department_id where d.id=?1", nativeQuery = true)
    @Query(value = "select distinct c from Department d inner join Course c on d.id=c.department.id where d.id=?1 order by c.id  desc")
    Page<Course> getCourseByDepartment(Long department, Pageable pageable);

    @Query(value = "select distinct c from Department d inner join Course c on d.id=c.department.id where d.id=?1 and lower(c.courseName) like ?2 order by c.id  desc")
    Page<Course> getCourseByDepartmentAndName(Long department, String courseName, Pageable pageable);

    @Query(value = "select * from course where lecturer_id=?1", nativeQuery = true)
    Page<Course> getCourseByLecturer(Long lecturer, Pageable pageable);


    @Modifying
    @Transactional
    @Query(value = "delete course where department_id=?1", nativeQuery = true)
    void deleteCourseByDepartment(Long department_id);

    @Query(value = "select c.id from course c inner join department d on c.department_id=d.id where d.id=?1", nativeQuery = true)
    Page<Long> getAllCourseIDbyDepartment(Long department, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.CourseOnlyDTO(c.id, c.courseName,c.lecturer.lecturer_fullname, c.courseCreatedDate, c.courseStudents.size,c.exams.size, c.lessons.size, c.courseImage) FROM Course c where c.lecturer.id =?1")
    Page<CourseOnlyDTO> getCoursesByLectureId(Long id, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.CourseDepartmentDTO(c.id, c.courseName, c.courseSemester, l.lecturer_fullname, c.courseTotalStudent) from Course c \n" +
        "inner join Lecturer l on c.lecturer.id=l.id inner join Department d on c.department.id=d.id where d.id=?1")
    Page<CourseDepartmentDTO> getCourseDetailByDepartment(Long department, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.CourseDepartmentDTO(c.id, c.courseName, c.courseSemester, l.lecturer_fullname, c.courseTotalStudent) from Course c  " +
        "inner join Lecturer l on c.lecturer.id=l.id inner join Department d on c.department.id = d.id where d.id = ?1 and c.courseName like %?2% ")
    Page<CourseDepartmentDTO> getCourseDetailByDepartmentAndName(Long department, String courseName, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.CourseOnlyDTO(c.id, c.courseName,c.lecturer.lecturer_fullname," +
        " c.courseCreatedDate, c.courseStudents.size,c.exams.size, c.lessons.size, c.courseImage) FROM Course c where c.lecturer.id =?1")
    Page<CourseOnlyDTO> getCoursesByLectureIdAndCourseName(Long lecturer_id, String name, Pageable pageable);

    @Procedure
    void PROC_DELTE_MORE_COURSE(String id);

    @Query(value = "select new com.aladin.service.dto.CourseOnlyDTO(c.id, c.courseName,c.lecturer.lecturer_fullname, c.courseCreatedDate, c.courseStudents.size,c.exams.size, c.lessons.size, c.courseImage) FROM Course c where c.lecturer.id =?1 and (c.id = ?2 or c.courseName like ?3 or c.courseCreatedDate=?4 or c.lecturer.lecturer_fullname like ?3)")
    Page<CourseOnlyDTO> getCoursesByLectureIdAllField(Long id, Long courseId, String param, LocalDate date, Pageable pageable);

    @Query(value = "SELECT * FROM course WHERE id =:id",nativeQuery = true)
    Course findOneById(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query(value = "delete from course where id=?1", nativeQuery = true)
    void deleteCourseByID(Long id);
}
