package com.aladin.repository;

import com.aladin.domain.Admin;
import com.aladin.domain.Student;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data SQL repository for the Admin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    @Transactional
    @Modifying
    @Query(value = "delete from jhi_admin where user_id=?1", nativeQuery = true)
    void deleteAdminByUser(String user_id);

    @Query(value = "select * from jhi_admin where user_id=?1", nativeQuery = true)
    Admin getAdminByUser(String user_id);

}
