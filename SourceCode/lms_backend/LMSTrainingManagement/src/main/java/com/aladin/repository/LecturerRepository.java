package com.aladin.repository;

import com.aladin.domain.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Lecturer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {

    @Query(value = "SELECT * FROM lecturer WHERE user_id = :userId", nativeQuery = true)
    Lecturer getLecturerByUserId(@Param("userId") Long id);

    @Query(value = "select count(*) from lecturer where user_id=?1",nativeQuery = true)
    int countLecturer(String user_id);

    @Query(value = "select count(*) from jhi_user_authority where authority_name='ROLE_LECTURER' and user_id=?1", nativeQuery = true)
    int countLecturerByRole(String user_id);
}
