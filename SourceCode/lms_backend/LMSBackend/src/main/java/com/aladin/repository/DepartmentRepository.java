package com.aladin.repository;

import com.aladin.domain.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the Department entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    @Query(value = "select * from department where department_type=?1", nativeQuery = true)
    Page<Department> getDepartmentByType(String type, Pageable pageable);


    @Query(value = "select d.* from department d inner join\n" +
        "(select count(student_id) department_number_student, department_id from course c inner join course_student cs on c.id= cs.course_id group by department_id) tbn\n" +
        "on d.id= tbn.department_id WHERE ROWNUM <= 7 order by tbn.department_number_student desc", nativeQuery = true)
    Page<Department> getHightlightDepartment(Pageable pageable);


    @Procedure("PROC_DELETE_DEPARTMENT")
    void PROC_DELETE_DEPARTMENT(Long id);


    @Modifying
    @Transactional
    @Query(value = "delete from department where id=?1", nativeQuery = true)
    void deleteDepartmentByID(Long id);


    @Query(value = "select * from department d inner join course c on d.id=c.department_id  inner join classroom cl on d.id=cl.department_id", nativeQuery = true)
    Page<Department> findAllDepartment(Pageable pageable);

    @Query(value = " select * from department where lower(department_name) like ?1 ", nativeQuery = true)
    Page<Department> searchDepartmentByName(String department_name, Pageable pageable);
}
