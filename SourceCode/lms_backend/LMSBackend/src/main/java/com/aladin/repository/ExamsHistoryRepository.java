package com.aladin.repository;

import com.aladin.domain.ExamsHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ExamsHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExamsHistoryRepository extends JpaRepository<ExamsHistory, Long> {

    @Query(value = "delete exams_history where exams_id =?1", nativeQuery = true)
    void deleteExamsHistoriesByExams(Long exam_id);
}
