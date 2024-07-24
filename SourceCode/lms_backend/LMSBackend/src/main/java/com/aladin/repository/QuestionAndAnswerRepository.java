package com.aladin.repository;

import com.aladin.domain.QuestionAndAnswer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the QuestionAndAnswer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionAndAnswerRepository extends JpaRepository<QuestionAndAnswer, Long> {
    @Query(value = "select qa from QuestionAndAnswer qa where qa.user.id=?1 " +
        "ORDER BY TO_NUMBER(qa.status, '9999.99') asc")
    Page<QuestionAndAnswer> findQuestionAndAnswerByUserId(Pageable pageable, String userId);

    @Query(value = "SELECT qa from QuestionAndAnswer qa order by TO_NUMBER(qa.status, '9999.99') asc")
    Page<QuestionAndAnswer> findAllQuestionAndAnswers(Pageable pageable);
}

