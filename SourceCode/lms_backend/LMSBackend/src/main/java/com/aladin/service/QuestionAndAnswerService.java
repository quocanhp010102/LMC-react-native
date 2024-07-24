package com.aladin.service;

import com.aladin.domain.Lecturer;
import com.aladin.domain.QuestionAndAnswer;
import com.aladin.domain.Student;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.AnswersRepository;
import com.aladin.repository.LecturerRepository;
import com.aladin.repository.QuestionAndAnswerRepository;
import com.aladin.repository.StudentRepository;
import com.aladin.repository.search.QuestionAndAnswerSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link QuestionAndAnswer}.
 */
@Service
@Transactional
public class QuestionAndAnswerService {

    private final Logger log = LoggerFactory.getLogger(QuestionAndAnswerService.class);

    private final QuestionAndAnswerRepository questionAndAnswerRepository;

    private final QuestionAndAnswerSearchRepository questionAndAnswerSearchRepository;

    private final LecturerRepository lecturerRepository;

    private final StudentRepository studentRepository;

    private final AnswersRepository answersRepository;

    private final KafkaSendNotification kafkaSendNotification;

    public QuestionAndAnswerService(QuestionAndAnswerRepository questionAndAnswerRepository,
                                    QuestionAndAnswerSearchRepository questionAndAnswerSearchRepository,
                                    KafkaSendNotification kafkaSendNotification,
                                    LecturerRepository lecturerRepository,
                                    StudentRepository studentRepository,
                                    AnswersRepository answersRepository) {
        this.questionAndAnswerRepository = questionAndAnswerRepository;
        this.questionAndAnswerSearchRepository = questionAndAnswerSearchRepository;
        this.lecturerRepository = lecturerRepository;
        this.studentRepository = studentRepository;
        this.answersRepository = answersRepository;
        this.kafkaSendNotification = kafkaSendNotification;
    }

    /**
     * Save a questionAndAnswer.
     *
     * @param questionAndAnswer the entity to save.
     * @return the persisted entity.
     */
    public QuestionAndAnswer save(QuestionAndAnswer questionAndAnswer, String userIdLogin) {
        log.debug("Request to save QuestionAndAnswer : {}", questionAndAnswer);
        /**
         * check neu user_id nam o bang student => insert typeuser= student
         *  check neu user_id nam o bang lecturer => insert typeuser= lecturer
         *
         */
        boolean checkUpdate = true;
        if(questionAndAnswer.getId() != null){
            if(questionAndAnswer.getUser().getId().equals(userIdLogin)){
                checkUpdate = true;
            }else{
                checkUpdate = false;
            }
        }else{
            checkUpdate = false;
        }
        try {
            List<Lecturer> lecturerList=lecturerRepository.findAll();
            List<Student> studentList=studentRepository.findAll();
            boolean userType=false;
            String userId="123";
            for (Lecturer l:lecturerList) {
                if (l.getId().toString().equals(userId)){
                    userType=true;
                }
            }
            for (Student s:studentList) {
                if (s.getId().toString().equals(userId)){
                    userType=false;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        questionAndAnswer = questionAndAnswerRepository.save(questionAndAnswer);
        if(!checkUpdate){
            kafkaSendNotification.alertQuestionAnswers(questionAndAnswer,userIdLogin);
        }

        return questionAndAnswer;
    }

    /**
     * Partially update a questionAndAnswer.
     *
     * @param questionAndAnswer the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<QuestionAndAnswer> partialUpdate(QuestionAndAnswer questionAndAnswer) {
        log.debug("Request to partially update QuestionAndAnswer : {}", questionAndAnswer);

        return questionAndAnswerRepository
            .findById(questionAndAnswer.getId())
            .map(existingQuestionAndAnswer -> {
                if (questionAndAnswer.getContent() != null) {
                    existingQuestionAndAnswer.setContent(questionAndAnswer.getContent());
                }

                return existingQuestionAndAnswer;
            })
            .map(questionAndAnswerRepository::save);
    }

    /**
     * Get all the questionAndAnswers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionAndAnswer> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionAndAnswers");
        return questionAndAnswerRepository.findAllQuestionAndAnswers(pageable);
    }

    /**
     * Get one questionAndAnswer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuestionAndAnswer> findOne(Long id) {
        log.debug("Request to get QuestionAndAnswer : {}", id);
        return questionAndAnswerRepository.findById(id);
    }

    /**
     * Delete the questionAndAnswer by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete QuestionAndAnswer : {}", id);
        questionAndAnswerRepository.deleteById(id);
    }

    /**
     * Search for the questionAndAnswer corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuestionAndAnswer> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of QuestionAndAnswers for query {}", query);
        return questionAndAnswerSearchRepository.search(query, pageable);
    }

    @Transactional
    public Page<QuestionAndAnswer> findQuestionAndAnswerByUserId(Pageable pageable,String userId) {
        log.debug("Request to get all QuestionAndAnswers");
        return questionAndAnswerRepository.findQuestionAndAnswerByUserId(pageable,userId);
    }
}
