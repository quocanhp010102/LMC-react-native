package com.aladin.repository;

import com.aladin.domain.Lecturer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the Lecturer entity.
 */
@SuppressWarnings("unused")
@Repository
@Transactional
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
    @Query(value = "select count(*) from lecturer where user_id=?1",nativeQuery = true)
    int countLecturer(String user_id);

    @Query(value = "select count(*) from jhi_user_authority where authority_name='ROLE_LECTURER' and user_id=?1", nativeQuery = true)
    int countLecturerByRole(String user_id);

    @Query(value = "select * from Lecturer where user_id=?1", nativeQuery = true)
    Lecturer getLecturerByUser(String user_id);

    @Query(value = "select * from lecturer l inner join jhi_user u on l.user_id=u.id inner join jhi_user_authority ja on ja.user_id=u.id where ja.authority_name != 'ROLE_USER'",nativeQuery = true)
    Page<Lecturer> getLecturerNotUser(Pageable pageable);

    @Query(value = "select * from lecturer l inner join jhi_user u on l.user_id=u.id inner join jhi_user_authority ja on ja.user_id=u.id where ja.authority_name != 'ROLE_USER' and(l.lecturer_fullname like ?1 or u.login like ?1 or ja.authority_name like ?1) ",nativeQuery = true)
    Page<Lecturer> getLecturerNotUserByAll(Pageable pageable, String param);

    @Transactional
    @Modifying
    @Query(value = "delete from lecturer where user_id=?1", nativeQuery = true)
    void deleteLecturerByUser(String user_id);

    @Query(value = "select * from lecturer where lecturer.lecturer_code=?1",nativeQuery = true)
    Lecturer getLecturerByLecturerCode(String lecturerCode);
}
