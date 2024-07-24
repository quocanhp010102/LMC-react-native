package com.aladin.service;

import com.aladin.domain.Note;
import com.aladin.domain.NoteContent;
import com.aladin.domain.Student;
import com.aladin.domain.User;
import com.aladin.repository.NoteContentRepository;
import com.aladin.repository.NoteRepository;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.aladin.repository.UserRepository;
import com.aladin.repository.search.NoteSearchRepository;
import com.aladin.service.dto.NoteDto;
import com.aladin.service.ultil.AuthenticateUltil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

/**
 * Service Implementation for managing {@link Note}.
 */
@Service
@Transactional
public class NoteService {

    private final Logger log = LoggerFactory.getLogger(NoteService.class);

    private final NoteRepository noteRepository;

    private  final NoteSearchRepository noteSearchRepository;

    private final NoteContentRepository noteContentRepository;

    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, NoteSearchRepository noteSearchRepository, NoteContentRepository noteContentRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.noteSearchRepository = noteSearchRepository;
        this.noteContentRepository = noteContentRepository;
        this.userRepository = userRepository;
    }

    /**
     * Save a note.
     *
     * @param noteDto the dto to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findOneNotes",allEntries = true),
//        @CacheEvict(value = "getAllNotesByUserAndMonth",allEntries = true),
//        @CacheEvict(value = "getAllNotesByCurrentuserLogin",allEntries = true),
//        @CacheEvict(value = "findAllNotes",allEntries = true),
//    })
    public NoteContent save(NoteDto noteDto) {
        log.debug("Request to save Note : {}", noteDto);
        String login = AuthenticateUltil.getLoginByCurrentLogin();
        SimpleDateFormat sdf=new SimpleDateFormat("dd-MMM-yyyy");
        String strDate = sdf.format(noteDto.getNoteDate());

        Note note =  noteRepository.findOneByDateAndUserId(strDate,login);
        if(note==null || ObjectUtils.isEmpty(note)) {
            note= new Note();
            note.setNoteDate(noteDto.getNoteDate());
            User user = userRepository.findOneUserByLogin(login);
            note.setUser(user);
            note = noteRepository.save(note);
        }
        NoteContent noteContent = new NoteContent();
        noteContent.setNote(note);
        noteContent.setNoteContentContent(noteDto.getNoteContent());
        noteContent.setNoteContentTitle(noteDto.getNoteTitle());
        noteContent.setNoteContentDate(noteDto.getNoteDate());
        noteContent = noteContentRepository.save(noteContent);
        return noteContent;
    }

    /**
     * Partially update a note.
     *
     * @param note the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Note> partialUpdate(Note note) {
        log.debug("Request to partially update Note : {}", note);
        return noteRepository
            .findById(note.getId())
            .map(existingNote -> {
                if (note.getNoteDate() != null) {
                    existingNote.setNoteDate(note.getNoteDate());
                }

                return existingNote;
            })
            .map(noteRepository::save);
    }

    /**
     * Get all the notes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
//    @Cacheable(value = "findAllNotes")
    public Page<Note> findAll(Pageable pageable) {
        log.debug("Request to get all Notes");
        return noteRepository.findAll(pageable);
    }

    /**
     * Get one note by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Note> findOne(Long id) {
        log.debug("Request to get Note : {}", id);
        return noteRepository.findById(id);
    }

    /**
     * Delete the note by id.
     *
     * @param id the id of the entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findOneNotes",allEntries = true),
//        @CacheEvict(value = "getAllNotesByUserAndMonth",allEntries = true),
//        @CacheEvict(value = "getAllNotesByCurrentuserLogin",allEntries = true),
//        @CacheEvict(value = "findAllNotes",allEntries = true),
//    })
    public void delete(Long id) {
        log.debug("Request to delete Note : {}", id);
        noteRepository.deleteById(id);
    }

    /**
     * Search for the note corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Note> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Notes for query {}", query);
        return noteSearchRepository.search(query, pageable);
    }

//    @Cacheable(value = "getAllNotesByCurrentuserLogin")
    public List<Note> getAllByCurrentuserLogin(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String login= (String) ((JwtAuthenticationToken) authentication)
                                                                    .getToken()
                                                                    .getClaims()
                                                                    .get("preferred_username");
//        String login= "maitinhtiep";
//        Student student = studentRepository.findOneByUsername(username);

        return noteRepository.getAllByCurrentUserLogin(login);
    }

//    @Cacheable(value = "getAllNotesByUserAndMonth")
    public  List<Note> getAllByUserAndMonth(String date){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String login= (String) ((JwtAuthenticationToken) authentication)
                                                                    .getToken()
                                                                    .getClaims()
                                                                    .get("preferred_username");
        return noteRepository.getAllByCurrentUserLoginAndMonth(login,date);
    }


    public void insertOrUpdateWhenInsertExams(Long examsId){
        noteRepository.insertWhenInsertExams(examsId);
    }

    public void insertOrUpdateWhenInsertNotification(Long notificationId){
        noteRepository.insertWhenInsertNotification(notificationId);
    }

    public Note findOneById(Long id){
        Note note = noteRepository.getOneById(id);
        Set<NoteContent> noteContentSet = noteContentRepository.findAllByNoteId(id);
        note.setNoteContents(noteContentSet);
        return  note;
    }


    public void deleteWhenNoteInNoteContent(){
        noteRepository.deleteWhenNoteInNoteContent();
    }


}
