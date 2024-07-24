package com.aladin.repository;

import com.aladin.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
@Repository
@Transactional
public interface AuthorityRepository extends JpaRepository<Authority, String> {

    @Query(value = "SELECT *  FROM JHI_AUTHORITY WHERE name IN (:lstAuthority)",nativeQuery = true)
    List<Authority> getAllByLstNameIn(@Param("lstAuthority") List<String> lstName);


}
