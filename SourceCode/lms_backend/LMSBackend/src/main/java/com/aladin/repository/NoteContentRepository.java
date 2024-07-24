package com.aladin.repository;

import com.aladin.domain.NoteContent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the NoteContent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NoteContentRepository extends JpaRepository<NoteContent, Long> {}
