package com.aladin.service;

import com.aladin.domain.*;
import com.aladin.notification.KafkaSendNotification;
import com.aladin.repository.ExamsHistoryRepository;

import java.security.Principal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;

import com.aladin.repository.ExamsRepository;
import com.aladin.repository.HistoryRepository;
import com.aladin.repository.StudentRepository;
import com.aladin.repository.search.ExamsHistorySearchRepository;
import com.aladin.service.dto.ExamsHistoryOfStudentOfCourse;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.web.rest.dto.StudentExamsDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ExamsHistory}.
 */
@Service
@Transactional
public class ExamsHistoryService {

    private final Logger log = LoggerFactory.getLogger(ExamsHistoryService.class);

    private final ExamsHistoryRepository examsHistoryRepository;

    private final ExamsHistorySearchRepository examsHistorySearchRepository;

    private final ExamsService examsService;

    private final StudentRepository studentRepository;

    private final UserService userService;

    private final StudentService studentService;

    private final QuestionsService questionsService;

    private final ExamsRepository examsRepository;

    private final HistoryService historyService;

    private final KafkaSendNotification kafkaSendNotification;

    private final HistoryRepository historyRepository;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;


    public ExamsHistoryService(ExamsHistoryRepository examsHistoryRepository,
                               ExamsHistorySearchRepository examsHistorySearchRepository,
                               ExamsService examsService,
                               StudentService studentService,
                               QuestionsService questionsService,
                               StudentRepository studentRepository,
                               KafkaSendNotification kafkaSendNotification,
                               HistoryService historyService,
                               ExamsRepository examsRepository,
                               HistoryRepository historyRepository,
                               UserService userService) {
        this.examsHistoryRepository = examsHistoryRepository;
        this.examsHistorySearchRepository = examsHistorySearchRepository;
        this.examsService = examsService;
        this.studentRepository = studentRepository;
        this.userService = userService;
        this.questionsService = questionsService;
        this.studentService = studentService;
        this.examsRepository = examsRepository;
        this.historyService = historyService;
        this.kafkaSendNotification = kafkaSendNotification;
        this.historyRepository = historyRepository;
    }



    /**
     * Save a examsHistory.
     *
     * @param examsHistory the entity to save.
     * @return the persisted entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsHistory", allEntries = true),
//        @CacheEvict(value = "findOneExamsHistory", allEntries = true),
//        @CacheEvict(value = "findAllByCourseIdAndStudentId", allEntries = true),
//    }
//    )
    public ExamsHistory save(ExamsHistory examsHistory, Principal principal) {
        log.debug("Request to save ExamsHistory : {}", examsHistory);
        boolean check = false;
        //teacher comment or mark poit exams
        if (examsHistory.getId() != null) {
            Object[] ob = findExamsAndStudentByExamsHistoryId(examsHistory.getId());

            Exams exams = new Exams();
            exams.setId(Long.valueOf(ob[0].toString()));

            Student student = new Student();
            student.setId(Long.valueOf(ob[2].toString()));

            examsHistory.setExams(exams);
            examsHistory.setStudent(student);
            check = true;
            ExamsHistory examsHistoryOld = examsHistoryRepository.findOneById(examsHistory.getId());
            if (examsHistoryOld.getExamsHistoryPoint() == null || examsHistoryOld.getExamsHistoryPoint().equals("")) {
                String userId = userService.getUserID(principal);

                if (examsHistory.getExamsHistoryPoint() != null) {
                    examsHistory.setExamsHistoryStatus("1");
                    examsHistory.setExams(exams);
                    examsHistory = examsHistoryRepository.save(examsHistory);
                    //trong truong hop cham bai thi tu luan
                    Long examsId = Long.valueOf(ob[0].toString());
                    examsService.updateTotalExamsGradedWhenLecturerGraded(examsId);
                    saveHistoryLecturerMarkPoint(examsHistory,ob);
                    kafkaSendNotification.alertExamsHistory(examsHistory, userId, ob);
                } else {

                    examsHistory = examsHistoryRepository.save(examsHistory);
                    saveHistoryLecturerComment(examsHistory, userId, ob);
                }
            } else {
                examsHistory = examsHistoryRepository.save(examsHistory);

                String userId = userService.getUserID(principal);
                saveHistoryLecturerComment(examsHistory, userId, ob);
            }
        } else {
            examsHistory.setExamsHistorySubmissionTime(new Timestamp(System.currentTimeMillis()));
            String login = AuthenticateUltil.getLoginByCurrentLogin();
            User user = userService.findOneByLogin(login);
            Student student = studentRepository.findOneByUser(user);
            examsHistory.setStudent(student);
            examsHistory = examsHistoryRepository.save(examsHistory);
            Object[] ob = findExamsAndStudentByExamsHistoryId(examsHistory.getId());
//            Long examsId = Long.valueOf(ob[0].toString());
            Long examsId = examsHistory.getExams().getId();
            if (examsHistory.getExams().getTypeOfExams().getId() == 1) {
                // trong truong hop nop bai va la bai trac nghiem
                examsService.updateTotalSubmitAndPercentSubmit(examsId);
            } else {
                //trong truong hop nop bai thi tu luan
                examsService.updateTotalSubmitAndPercentSubmit(examsId);
//                examsService.updateTotalSubmitAndPercentSubmit(examsHistory.getExams().getId());
            }
            saveHistoryStudentPassExams(examsHistory,ob);
        }

        return examsHistory;
    }

    /**
     * Partially update a examsHistory.
     *
     * @param examsHistory the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ExamsHistory> partialUpdate(ExamsHistory examsHistory) {
        log.debug("Request to partially update ExamsHistory : {}", examsHistory);

        return examsHistoryRepository
            .findById(examsHistory.getId())
            .map(existingExamsHistory -> {
                if (examsHistory.getExamsHistoryTeacherComment() != null) {
                    existingExamsHistory.setExamsHistoryTeacherComment(examsHistory.getExamsHistoryTeacherComment());
                }
                if (examsHistory.getExamsHistoryAnswer() != null) {
                    existingExamsHistory.setExamsHistoryAnswer(examsHistory.getExamsHistoryAnswer());
                }
                if (examsHistory.getExamsHistoryPoint() != null) {
                    existingExamsHistory.setExamsHistoryStatus("1");
                    existingExamsHistory.setExamsHistoryPoint(examsHistory.getExamsHistoryPoint());
                    examsService.updateStatusByid(1L, existingExamsHistory.getExams().getId());
                }
                if (examsHistory.getExamsHistorySubmissionTime() != null) {
                    existingExamsHistory.setExamsHistorySubmissionTime(examsHistory.getExamsHistorySubmissionTime());
                }

                return existingExamsHistory;
            })
            .map(examsHistoryRepository::save);
    }

    /**
     * Get all the examsHistories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
//    @Cacheable(value = "findAllExamsHistory")
    public Page<ExamsHistory> findAll(Pageable pageable) {
        log.debug("Request to get all ExamsHistories");
        return examsHistoryRepository.findAll(pageable);
    }

    /**
     * Get one examsHistory by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
//    @Cacheable(value = "findOneExamsHistory", key = "#id")
    public ExamsHistory findOne(Long id) {
        log.debug("Request to get ExamsHistory : {}", id);
        ExamsHistory examsHistory = examsHistoryRepository.findOneById(id);
        Student student = studentService.findOneByExamsHistoryId(examsHistory.getId());
        examsHistory.setStudent(student);
        return examsHistory;
    }

    /**
     * Delete the examsHistory by id.
     *
     * @param id the id of the entity.
     */
//    @Caching(evict = {
//        @CacheEvict(value = "findAllExamsHistory", allEntries = true),
//        @CacheEvict(value = "findOneExamsHistory", allEntries = true),
//        @CacheEvict(value = "findAllByCourseIdAndStudentId", allEntries = true),
//        @CacheEvict(value = "findOneExamsHistoryByExamsIdAndStudentId", allEntries = true),
//    }
//    )
    public void delete(Long id) {
        log.debug("Request to delete ExamsHistory : {}", id);
        examsHistoryRepository.deleteById(id);
//        examsHistorySearchRepository.deleteById(id);
    }


    @Transactional(readOnly = true)
    public Page<ExamsHistory> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of ExamsHistories for query {}", query);
        return examsHistorySearchRepository.search(query, pageable);
    }

    public ExamsHistory findOneByStatusAndExamsId(String status, Long examsId) {
        log.debug("Request to get one exams by status and examsId", status);
        ExamsHistory examsHistory = examsHistoryRepository.findOneByStatusAndExamsId(status, examsId);
        Student student = studentService.findOneByExamsHistoryId(examsHistory.getId());
        Exams exams = examsRepository.findOneById(examsId);
        examsHistory.setExams(exams);

//        Set<Questions> questions = questionsService.findAllbyExamId(examsHistory.getExams().getId());
        examsHistory.setStudent(student);
//        examsHistory.getExams().setQuestions(questions);
        return examsHistory;
    }

//    @Cacheable(value = "findAllByCourseIdAndStudentId")
    public Page<ExamsHistoryOfStudentOfCourse> findAllByCourseIdAndStudentId(Long courseId, Long studentId, Pageable pageable) {

        return examsHistoryRepository.findAllByCourseIdAndStudentId(courseId, studentId, pageable);
    }

//    @Cacheable(value = "findOneExamsHistoryByExamsIdAndStudentId")
    public ExamsHistory findOneByExamsIdAndStudentId(Long examsId, Long studentId) {
        return examsHistoryRepository.findOneByExamsIdAndStudentId(examsId, studentId);
    }

    public Long getTotalByCourseIdAndStudentId(Long courseId, Long studentId) {
        return examsHistoryRepository.getTotalByCourseIdAndStudentId(courseId, studentId);
    }

    public Page<StudentExamsDto> getStudentAndPointByExamId(Long id,Pageable pageable) {
        List<StudentExamsDto> listfull = new ArrayList<>();
        List<StudentExamsDto> listPassed = new ArrayList<>();

        listfull = studentRepository.getAllStudentOfExams(id);
        listPassed = studentRepository.getAllStudentInExamsHistory(id);
        Integer total = listfull.size();
        boolean check = false;
        for (StudentExamsDto std : listfull) {
            for (StudentExamsDto std1 : listPassed) {
                if (std.getCode().equalsIgnoreCase(std1.getCode())) {
                    if (std1.getPoint() == null) {
                        std.setPoint("Chưa chấm bài");
                    } else {
                        std.setPoint(std1.getPoint());
                    }
                    check = true;
                }
            }
            if (check == false) {
                std.setPoint("Chưa thi");
            }
            check = false;
        }

        Integer start = Math.toIntExact(pageable.getOffset() * pageable.getPageSize());
        Integer limit = Math.min(start + pageable.getPageSize(), listfull.size());
        Page<StudentExamsDto> page = new PageImpl<>(listfull.subList(start, limit), pageable, listfull.size());
        return page;
    }

    public boolean checkExamsHistoryNotGraded(Long examsId){
        if(examsHistoryRepository.checkExamsHistoryNotGraded(examsId) == 0){
            return false;
        }else{
            return true;
        }
    }

    //student pass exams
    public void saveHistoryStudentPassExams(ExamsHistory examsHistory, Object[] ob) {
        StringBuilder sb = new StringBuilder();
        sb.append("Bạn đã hoàn thành bài thi ");
        sb.append(examsHistory.getExams().getExamName());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sb.toString());
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        activityHistory.setUser(user);
        historyRepository.save(activityHistory);
    }

    //lecturer comment exams
    public void saveHistoryLecturerComment(ExamsHistory examsHistory, String userId, Object[] ob) {
        StringBuilder sb = new StringBuilder();
        sb.append("Bạn nhận xét bài thi ");
        sb.append(ob[1]);
        User student = userService.findOneByStudentId(Long.valueOf(ob[2].toString()));
        sb.append(" của ");
        sb.append(student.getFirstName() + " " + student.getLastName());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sb.toString());
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        activityHistory.setUser(user);
        historyRepository.save(activityHistory);
    }

    //lecturer mark point exams
    public void saveHistoryLecturerMarkPoint(ExamsHistory examsHistory, Object[] ob) {
        StringBuilder sb = new StringBuilder();
        sb.append("Bạn đã chấm bài thi ");
        Exams exams = examsRepository.getOneByExamsHistoryId(examsHistory.getId());
        sb.append(ob[1]);
        User student = userService.findOneByStudentId(Long.valueOf(ob[2].toString()));
        sb.append(" của ");
        sb.append(student.getFirstName() + " " + student.getLastName());
        History activityHistory = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        activityHistory.setHistoryTime(sdf.format(new Date()));
        activityHistory.setHistoryName(sb.toString());
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        activityHistory.setUser(user);
        historyRepository.save(activityHistory);
    }

//    public  Object[] getIdExam(Long id) {
//        Connection conn = null;
//        Object[] obj = new Object[3];
//        try {
//            conn = DriverManager.getConnection(url, username, password);
//            String sql = "select e.id as id, e.exam_name as name, eh.student_id as studentId from exams e inner join exams_history eh on e.id = eh.exams_id and eh.id = ?";
//
//            PreparedStatement pre = conn.prepareStatement(sql);
//            pre.setLong(1, id);
//            ResultSet resultSet = pre.executeQuery();
//
//            while (resultSet.next()) {
//                obj[0] = resultSet.getLong("id");
//                obj[1] = resultSet.getString("name");
//                obj[2] = resultSet.getString("studentId");
//            }
//            pre.close();
//            resultSet.close();
//            conn.close();
//        } catch (SQLException e) {
//            e.printStackTrace();
//            try {
//                conn.close();
//            }catch ( SQLException exception){
//                log.warn(exception.getMessage());
//            }
//
//        }
//        return obj;
//    }
    public Object[] findExamsAndStudentByExamsHistoryId(Long ehId){
        String ob = examsHistoryRepository.findExamsAndStudentByExamsHistoryId(ehId);
        String[] parts = ob.split(",");
        Object[] obj = new Object[3];
        obj[0] = parts[0];
        obj[1] =  parts[1];
        obj[2] =  parts[2];
        return  obj;
    }

//    public static void main(String[] args) {
//        Connection conn = null;
//        try {
//            conn = DriverManager.getConnection("jdbc:oracle:thin:@101.99.6.31:15211:orcl", "dungtq1", "Aladin123");
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//
//        String sql = "select e.id as id, e.exam_name as name from exams e inner join exams_history eh on e.id = eh.exams_id and eh.id = ?";
//        Object[] obj = new Object[2];
//        try {
//            PreparedStatement pre = conn.prepareStatement(sql);
//            pre.setLong(1,49951L);
//            ResultSet resultSet = pre.executeQuery();
//
//            while (resultSet.next()) {
//                obj[0] = resultSet.getLong("id");
//                obj[1] = resultSet.getString("name");
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        System.out.printf("===========>"+obj[1]);
//    }
}
