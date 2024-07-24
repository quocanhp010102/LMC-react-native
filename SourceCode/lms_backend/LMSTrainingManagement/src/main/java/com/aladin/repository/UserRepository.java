package com.aladin.repository;

import com.aladin.domain.Authority;
import com.aladin.domain.User;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.aladin.notification.dto.ReceiverDto;
import liquibase.pro.packaged.Q;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
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

    @Query(value = "SELECT * FROM jhi_user WHERE login = :login", nativeQuery = true)
    User findOneUserByLogin(@Param("login") String login);

    @Query(value = "SELECT new com.aladin.notification.dto.ReceiverDto(s.user.id, s.student_email)" +
        "FROM Student s " +
        "WHERE s.id in" +
        "(SELECT cs.student.id FROM CourseStudent cs WHERE cs.course.id = :courseId )")
    List<ReceiverDto> findAllEmailAndIdByCourseId(@Param("courseId") Long courseId);


    @Query(value = "SELECT new com.aladin.notification.dto.ReceiverDto(s.user.id, s.student_email)" +
        "        FROM Student s " +
        "        WHERE s.id in " +
        "        (SELECT cs.student.id FROM CourseStudent cs WHERE cs.course.id = " +
        "        (SELECT e.course.id FROM Exams e WHERE e.id =:examsId) )")
    List<ReceiverDto> findAllEmailAndIdByExamsId(@Param("examsId") Long id);


    @Query(value = "SELECT new com.aladin.notification.dto.ReceiverDto(s.user.id, s.student_email)" +
        "FROM Student s " +
        "WHERE s.id in" +
        "(SELECT cs.student.id FROM CourseStudent cs WHERE cs.course.id = \n" +
        "(SELECT l.course.id FROM Lesson l WHERE l.id =:lessonId) )")
    List<ReceiverDto> findAllEmailAndIdByLessonId(@Param("lessonId") Long id);

    @Query(value = "SELECT u FROM User u WHERE u.id = ?1")
    User findOneById( String userId);

    @Query(value = "SELECT * FROM jhi_user WHERE id = (select user_id from lecturer where id =:id)", nativeQuery = true)
    User findOneByLecturerId(@Param("id") Long id);

    @Query(value = "select * from jhi_user where id = (select user_id from student where id =:id)", nativeQuery = true)
    User findOneByStudentId(@Param("id") Long id);

    @Query(value = "select count(*) from jhi_user_authority where authority_name='ROLE_ADMIN' and user_id=?1", nativeQuery = true)
    int countAdmin(String user_id);

    @Query(value = "SELECT new com.aladin.notification.dto.ReceiverDto(u.id, u.email)" +
        "        FROM User u  join u.authorities as au " +
        "        WHERE  au in (" +
        "       :lstAuthor ) ")
    List<ReceiverDto> findAllEmailAndIdBylstAuthor(@Param("lstAuthor") List<Authority> lstAuthor);

    @Query(value = "select sender_id from notification where id = :notiId", nativeQuery = true)
    String getIdByNotificationId(@Param("notiId") Long id);

}
