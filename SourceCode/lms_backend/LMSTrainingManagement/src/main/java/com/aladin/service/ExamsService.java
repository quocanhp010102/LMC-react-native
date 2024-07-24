package com.aladin.service;

import com.aladin.domain.*;
import com.aladin.repository.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import com.aladin.repository.search.ExamsSearchRepository;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.service.ultil.Constant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Exams}.
 */

@Transactional
@Service
public class ExamsService {

    private final Logger log = LoggerFactory.getLogger(ExamsService.class);

    private final ExamsRepository examsRepository;

    private final ExamsSearchRepository examsSearchRepository;

    private final QuestionsRepository questionsRepository;

    private final AnswersRepository answersRepository;

    private final QuestionsService questionsService;

    private final CourseRepository courseRepository;

    private final  HistoryService historyService;

    private final UserService userService;

    private final NoteService noteService;

    private final NoteContentRepository noteContentRepository;

    private final HistoryRepository historyRepository;

    public ExamsService(ExamsRepository examsRepository,
                        ExamsSearchRepository examsSearchRepository,
                        QuestionsRepository questionsRepository,
                        AnswersRepository answersRepository,
                        QuestionsService questionsService,
                        CourseRepository courseRepository,
                        UserService userService,
                        HistoryService historyService,
                        NoteContentRepository noteContentRepository,
                        HistoryRepository historyRepository,
                        NoteService noteService) {
        this.examsRepository = examsRepository;
        this.examsSearchRepository = examsSearchRepository;
        this.questionsRepository = questionsRepository;
        this.answersRepository = answersRepository;
        this.questionsService = questionsService;
        this.courseRepository = courseRepository;
        this.userService = userService;
        this.noteService = noteService;
        this.noteContentRepository = noteContentRepository;
        this.historyService = historyService;
        this.historyRepository = historyRepository;
    }

    /**
     * Save a exams.
     *
     * @param exams the entity to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true),
//        @CacheEvict(value = "findOneExamsById", allEntries = true),
//
//        @CacheEvict(value = "findOneNotes",allEntries = true),
//        @CacheEvict(value = "getAllNotesByUserAndMonth",allEntries = true),
//        @CacheEvict(value = "getAllNotesByCurrentuserLogin",allEntries = true),
//        @CacheEvict(value = "findAllNotes",allEntries = true),
//
//        @CacheEvict(value = "findAllHistoryByCurrentMonthAndUserLogin", allEntries = true),
//        @CacheEvict(value = "totalHistoryByCurrentMonthAndUserLogin", allEntries = true),
//        @CacheEvict(value = "totalHistoryByDateAndLogin", allEntries = true),
//        @CacheEvict(value = "findAllHistoryByDateAndCurrentUserLogin", allEntries = true),
//    })

    public Exams save(Exams exams) {
        log.debug("Request to save Exams : {}", exams);
        Exams result = new Exams();
        if(exams.getId() == null){
            exams.setExamPercentageSubmitted("0");
            Course course = courseRepository.findOneById(exams.getCourse().getId());
            exams.setCourse(course);
            exams.setExamTotalStudent(course.getCourseTotalStudent());
            exams.setExamTotalStudentSubmitted("0");
            exams.setExamStatus("0");
            result= examsRepository.save(exams);
            courseRepository.updateWhenAddExams(course.getId());
//            saveHistory(exams, Constant.METHOD_POST);
            noteService.insertOrUpdateWhenInsertExams(result.getId());
        }else{
            Exams examsOld = examsRepository.findOneById(exams.getId());
            questionsService.deleteByExamsId(exams.getId());
//            saveHistory(exams, Constant.METHOD_PUT);
            result= examsRepository.save(exams);
            if(result.getExamOpenTime() != examsOld.getExamOpenTime() && result.getExamCloseTime() != examsOld.getExamCloseTime()){
                noteContentRepository.deleteByExamsId(result.getId());
                noteService.deleteWhenNoteInNoteContent();
                noteService.insertOrUpdateWhenInsertExams(result.getId());
            }
        }
        for(Questions itemQuestion: exams.getQuestions()){
             questionsRepository.save(itemQuestion);
            for(Answers itemAnswer:itemQuestion.getAnswers()){
                answersRepository.save(itemAnswer);
            }
        }
        return result;
    }

    /**
     * Partially update a exams.
     *
     * @param exams the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Exams> partialUpdate(Exams exams) {
        log.debug("Request to partially update Exams : {}", exams);
        AtomicBoolean updateNote = new AtomicBoolean(false);
        return examsRepository
            .findById(exams.getId())
            .map(existingExams -> {
                if (exams.getExamName() != null) {
                    existingExams.setExamName(exams.getExamName());
                }if (exams.getExamStatus() != null) {
                    existingExams.setExamStatus(exams.getExamStatus());
                }if (exams.getExamCloseTime() != null) {
                    existingExams.setExamCloseTime(exams.getExamCloseTime());
                }if (exams.getExamLimittedWorkingTime()!= null) {
                    existingExams.setExamLimittedWorkingTime(exams.getExamLimittedWorkingTime());
                }if (exams.getExamOpenTime()!=null) {
                    existingExams.setExamOpenTime(exams.getExamOpenTime());
                    if(exams.getExamOpenTime() !=  existingExams.getExamOpenTime() ||
                        exams.getExamCloseTime() != existingExams.getExamCloseTime()){
                        updateNote.set(true) ;
                    }
                }
                return existingExams;
            })
            .map(examsRepository::save)
            .map(savedNews -> {
                examsRepository.save(savedNews);
                if(updateNote.get()){
                    noteContentRepository.deleteByExamsId(savedNews.getId());
                    noteService.insertOrUpdateWhenInsertExams(savedNews.getId());
                }
                saveHistory(savedNews, Constant.METHOD_PUT);
                return savedNews;
            });
    }

    /**
     * Get all the exams.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Exams> findAll(Pageable pageable) {
        log.debug("Request to get all Exams");
        return examsRepository.findAll(pageable);
    }

    /**
     * Get one exams by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Exams> findOne(Long id) {
        log.debug("Request to get Exams : {}", id);
        Exams exams = examsRepository.findOneById(id);
//        saveHistory(exams,Constant.METHOD_GET);
        return examsRepository.findById(id);
    }

    /**
     * Delete the exams by id.
     *
     * @param id the id of the entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true),
//        @CacheEvict(value = "findOneExamsById", allEntries = true)
//    })
    public void delete(Long id) {
        log.debug("Request to delete Exams : {}", id);
        questionsService.deleteByExamsId(id);
        noteContentRepository.deleteByExamsId(id);
        examsRepository.deleteById(id);
    }

    /**
     * Search for the exams corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Exams> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Exams for query {}", query);
        return examsSearchRepository.search(query, pageable);
    }


    /**
     * Find One the exams corresponding to the query.
     *
     * @param id the query of the search.
     */
//    @Cacheable(value = "findOneExamsById", key = "#id")
    public Exams findOneById(Long id){
        log.debug("Request to find one by Id", id);
        Exams exam = examsRepository.findOneById(id);
        Set<Questions> setQuestions = questionsRepository.findAllByExamsId(exam.getId());
        for(Questions questions : setQuestions){
            Set<Answers> setAnswers= answersRepository.findAnswersByQuestions(questions);
            questions.setAnswers( setAnswers);
        }
        exam.setQuestions(setQuestions);
//        Course course = courseRepository.findOneByExamsId(exam.getId());
//        exam.setCourse(course);
//        saveHistory(exam,Constant.METHOD_GET);
        return exam;
    }

//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true)
//    })
    public void updateTotalStudentSubmit(Long id){
        log.debug("Request to update total student submit by Id", id);
        Long totalStudentSubmitted = examsRepository.getTotalStudentSubmittedById(id);
        totalStudentSubmitted ++;
        examsRepository.upDateTotalStudentSubmitedById(totalStudentSubmitted,id);
    }

    /**
     * Delete multi exams.
     *
     * @param ids the query of the search.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true),
//        @CacheEvict(value = "findOneExamsById", allEntries = true),
//    })
    public void deleteMultiByIds( String ids){
        examsRepository.deleteMultiByIds(ids);
    }



//    @Cacheable(value = "findAllExamsByCourseId",key ="#id")
    public List<Exams> findAllByCourseId(Long id, Pageable pageable){
        Long offset = pageable.getOffset();
        Integer limit = pageable.getPageSize();
        return examsRepository.findAllByCourseId(id, offset, limit);
    }



    public List<Exams> searchAllByCourseIdAndExamsName(Long courseId, String query){
        log.info("Request to findAllByCourseId", courseId, query);
        return examsRepository.searchAllByCourseIdAndExamsName(courseId, query);
    }

//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true)
//    })
    public void updateTotalSubmitAndPercentSubmit(Long examsId){
        log.debug("Request to update total submit and percent by Id", examsId);
        examsRepository.updateTotalSubmitAndPercentSubmit(examsId);
    }

//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true)
//    })
    public void updateTotalExamsGradedWhenLecturerGraded(Long examsId){
        log.debug("Request to update total graded by Id", examsId);
        examsRepository.updateTotalGradedWhenLecturerGraded(examsId);
    }

    public boolean checkTimePassExams(Long examsId){
        boolean check = true;
        if(examsRepository.checkTimePassExams(examsId) == 0){
            // khong trong thoi gian thi
            check = false;
        }else{
            // duoc phep thi
            check = true;
        }
        return  check;
    }

    public boolean checkStudentPassedExams(Long examsId, String userId){
        boolean check = true;
        if(examsRepository.checkStudentPassExams(examsId, userId) == 0){
            // chua lam bai thi, duoc phep thi tiep
            check = true;
        }else{
            // da hoan thanh bai thi, khong duoc thi tiep
            check = false;
        }
        return  check;
    }

//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true)
//    })
    public Long  getTotalByCourseId(Long id){
        return examsRepository.getTotalByCourseId(id);
    }



//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsByCourseId", allEntries = true)
//    })
    public void updateStatusByid(Long status, Long examsId){
        examsRepository.updateStatusById(status, examsId);
    }

    public void saveHistory(Exams exams,String method){
        log.debug("Request to save to History", exams, method);
        StringBuilder sbActivityHistoryName= new StringBuilder();
        switch (method){
            case "POST":{
                sbActivityHistoryName.append("Thêm mới: ");
                break;
            }
            case  "PUT": {
                sbActivityHistoryName.append("Cập nhập: ");
                break;
            }
            case  "GET": {
                break;
            }
            case "DELETE": {
                sbActivityHistoryName.append("Xoá: ");
                break;
            }
        }
        sbActivityHistoryName.append(exams.getTypeOfExams().getTypeOfExamsName()+": ");
        sbActivityHistoryName.append(exams.getExamName());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sbActivityHistoryName.toString());
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
//        User user = userService.findOneByLogin("maitinhtiep");
        activityHistory.setUser(user);
        historyRepository.save(activityHistory);
    }
}
