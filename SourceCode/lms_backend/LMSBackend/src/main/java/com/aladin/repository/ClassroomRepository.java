package com.aladin.repository;

import com.aladin.domain.Classroom;
import com.aladin.service.dto.ClassroomDepartmentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the Classroom entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
        "from Classroom c inner join Department d on c.department.id=d.id  where d.id=?1")
    Page<ClassroomDepartmentDTO> getAllClassroomByDepartment(Long department, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
        "from Classroom c inner join Department d on c.department.id=d.id  where d.id=?1 and c.classroomName like %?2%")
    Page<ClassroomDepartmentDTO> searchClassroomByDepartmentAndClassName(Long department, String className, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
        "from Classroom c inner join Department d on c.department.id=d.id  where d.id=?1 and c.classroomCode like %?2%")
    Page<ClassroomDepartmentDTO> searchClassroomByDepartmentAndClassCode(Long department, String classCode, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "delete from classroom where id= ?1", nativeQuery = true)
    void deleteMultiClassroom(Long id);


    @Query(value = "SELECT * FROM classroom where id= ?1", nativeQuery = true)
    Classroom findOneById(Long id);


    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
        "from Classroom c inner join Department d on c.department.id=d.id  where d.department_name like %?1%")
    Page<ClassroomDepartmentDTO> searchClassroomByDepartmentName(String department_name, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
        "from Classroom c inner join Department d on c.department.id=d.id  where c.classroomName like %?1%")
    Page<ClassroomDepartmentDTO> searchClassroomByClassName(String className, Pageable pageable);

    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
        "from Classroom c inner join Department d on c.department.id=d.id  where c.classroomCode like %?1%")
    Page<ClassroomDepartmentDTO> searchClassroomByClassCode(String classCode, Pageable pageable);

//    @Query(value = "select new com.aladin.service.dto.ClassroomDepartmentDTO(d.id, d.department_name, c.id, c.classroomName, c.classroomCode, c.classroomTotalStudent) " +
//        "from Classroom c inner join Department d on c.department.id=d.id  where c.classroomCode like ?1 or c.classroomName like ?1 or d.department_name like ?1 ")
//    Page<ClassroomDepartmentDTO> searchClassroomByCodeNameAndDepartment(String param, Pageable pageable);


    @Query(value = "select * from classroom c inner join department d on c.department_id=d.id where c.classroom_code like ?1 or c.classroom_name like ?1 or d.department_name like ?1 ", nativeQuery = true)
    Page<Classroom> searchClassroomByCodeNameAndDepartment(String param, Pageable pageable);

    @Query(value = "select count(*) from classroom where classroom_code =?1", nativeQuery = true)
    Integer countExistClassroom(String classroomCode);

    @Modifying
    @Transactional
    @Query(value = "delete from classroom where id=?1", nativeQuery = true)
    void deleteClassroomByID(Long id);

    @Query(value = "select * from Classroom ", nativeQuery = true)
    Page<Classroom> findAllClassroom(Pageable pageable);
}
