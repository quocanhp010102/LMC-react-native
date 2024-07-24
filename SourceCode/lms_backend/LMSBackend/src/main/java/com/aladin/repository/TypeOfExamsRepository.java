package com.aladin.repository;

import com.aladin.domain.TypeOfExams;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypeOfExams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeOfExamsRepository extends JpaRepository<TypeOfExams, Long> {}
