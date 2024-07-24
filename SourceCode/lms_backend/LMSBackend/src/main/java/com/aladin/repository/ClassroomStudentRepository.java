package com.aladin.repository;

import com.aladin.domain.Classroom;
import com.aladin.domain.ClassroomStudent;
import com.aladin.domain.Student;
import com.aladin.service.dto.ClassRoomDto;
import com.aladin.service.dto.StudentClassroomDTO;
import liquibase.pro.packaged.Q;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the ClassroomStudent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClassroomStudentRepository extends JpaRepository<ClassroomStudent, Long> {

    @Query(value = "select new com.aladin.service.dto.StudentClassroomDTO(s.id, s.student_code, s.student_fullname, s.student_email, s.student_phone, s.student_birthday, cs.classroom.id, cs.classroom.classroomName, cs.classroom.classroomCode, cs.classroom.classroomTotalStudent) " +
        " from ClassroomStudent cs inner join Student s on cs.student.id=s.id where cs.classroom.id=?1")
    Page<StudentClassroomDTO> getAllStudentByClass(Long classroom_id, Pageable pageable);

    @Query(value = "select cs.* from classroom_student cs inner join student s on cs.student_id=s.id where cs.student_id=?1", nativeQuery = true)
    Page<Classroom> getAllClassByUserLogin(Long student_id, Pageable pageable);


    @Modifying
    @Transactional
    @Query(value = "delete from classroom_student where classroom_id=?1 and student_id=?2  ", nativeQuery = true)
    void deleteStudentFromClass(Long courseID, Long studentID);

    @Modifying
    @Transactional
    @Query(value = "delete from classroom_student where classroom_id=?1", nativeQuery = true)
    void deleteClassrooms(Long class_id);

    @Query(value = "select new com.aladin.service.dto.StudentClassroomDTO(s.id, s.student_code, s.student_fullname, s.student_email, s.student_phone, s.student_birthday, cs.classroom.id, cs.classroom.classroomName, cs.classroom.classroomCode, cs.classroom.classroomTotalStudent) " +
        " from ClassroomStudent cs inner join Student s on cs.student.id=s.id where cs.classroom.id=?1 and s.student_fullname like %?2%")
    Page<StudentClassroomDTO> searchAllStudentByClassAndName(Long classroom_id, String name, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.StudentClassroomDTO(s.id, s.student_code, s.student_fullname, s.student_email, s.student_phone, s.student_birthday, cs.classroom.id, cs.classroom.classroomName, cs.classroom.classroomCode, cs.classroom.classroomTotalStudent) " +
        " from ClassroomStudent cs inner join Student s on cs.student.id=s.id where cs.classroom.classroomCode like %?1%")
    Page<StudentClassroomDTO> getAllStudentByClassCode(String classCode, Pageable pageable);

    ClassroomStudent findOneById(Long id);

    @Procedure
    void PROC_UPDATE_TOTAL_STUDENT(Long classRoomId);


    @Query(value = "select count (*) from classroom_student where student_id=?1 and classroom_id=?2", nativeQuery = true)
    Integer checkExistStudentInClassroom(Long student_id, Long classroom_id);


}
