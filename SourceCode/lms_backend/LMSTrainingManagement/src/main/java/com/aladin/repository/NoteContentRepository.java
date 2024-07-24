package com.aladin.repository;

import com.aladin.domain.NoteContent;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Spring Data SQL repository for the NoteContent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NoteContentRepository extends JpaRepository<NoteContent, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM note_content WHERE exams_id =:examsId",nativeQuery = true)
    void deleteByExamsId(@Param("examsId") Long examsId);

    NoteContent findOneById(Long id);

    @Query(value = "SELECT nc.id, nc.NOTE_CONTENT_CONTENT, nc.NOTE_CONTENT_TITLE, null EXAMS_ID, nc.NOTE_ID, nc.NOTE_CONTENT_DATE FROM note_content nc WHERE note_id = :noteId", nativeQuery = true)
    Set<NoteContent> findAllByNoteId(@Param("noteId") Long noteId);




}
