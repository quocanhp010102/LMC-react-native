package com.aladin.repository;

import com.aladin.domain.User;

import java.util.List;
import java.util.Optional;

import com.aladin.service.dto.UserOnlyDTO;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE)
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    @Query(value = "select count(*) from jhi_user_authority where authority_name='ROLE_ADMIN' and user_id=?1", nativeQuery = true)
    int countAdminByRole(String user_id);

    @Query(value = "select count(*) from jhi_admin where user_id=?1", nativeQuery = true)
    int countAdmin(String user_id);


    @Transactional
    @Modifying
    @Query(value = "delete from jhi_user_authority where user_id=?1 and authority_name=?2 ", nativeQuery = true)
    void deleteUserWithRole(String user_id, String role);

    @Transactional
    @Modifying
    @Query(value = "insert into jhi_user_authority(user_id, authority_name) values(?1, ?2)", nativeQuery = true)
    void insertUserWithRole(String user_id, String role);

    @Query(value = "SELECT * FROM jhi_user WHERE login = :login", nativeQuery = true)
    User findOneUserByLogin(@Param("login") String login);

    @Query(value = "select * from jhi_user where id=?1",nativeQuery = true)
    User getUserByID(String id);

    @Query(value = "SELECT count(*) FROM   (select distinct NVL(l.user_id,s.user_id) as id,\n" +
        "                    NVL(l.lecturer_fullname, s.student_fullname) as fullname\n" +
        "                from jhi_user u inner join lecturer l on u.id=l.user_id full join student s on u.id=s.user_id ) tbn \n" +
        "            inner join JHI_USER_AUTHORITY a on a.user_id =tbn.id where a.authority_name !='ROLE_USER' ", nativeQuery = true)
    int countUserNotRoleUser();

    @Query(value = "SELECT count(*) FROM   (select distinct NVL(l.user_id,s.user_id) as id,\n" +
        "                    NVL(l.lecturer_fullname, s.student_fullname) as fullname,u.login as login\n" +
        "                from jhi_user u inner join lecturer l on u.id=l.user_id full join student s on u.id=s.user_id ) tbn \n" +
        "            inner join JHI_USER_AUTHORITY a on a.user_id =tbn.id where a.authority_name !='ROLE_USER' and(tbn.id like ?1 or tbn.fullname like ?1 or a.authority_name like ?1 or tbn.login like ?1)", nativeQuery = true)
    int countUserNotRoleUser(String param);

    @Query(value = "select * from jhi_user where id =?1",nativeQuery = true)
    User getUserByIdAndRole(String id);
}
