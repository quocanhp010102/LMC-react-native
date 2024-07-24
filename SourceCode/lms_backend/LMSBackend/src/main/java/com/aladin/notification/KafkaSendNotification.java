package com.aladin.notification;

import com.aladin.domain.*;
import com.aladin.notification.dto.HistoryDto;
import com.aladin.notification.dto.MessageDto;
import com.aladin.notification.dto.QuestionAnswerDto;
import com.aladin.repository.ClassroomRepository;
import com.aladin.repository.CourseRepository;
import com.aladin.repository.StudentRepository;
import com.aladin.service.ClassroomStudentService;
import com.aladin.service.UserService;
import com.aladin.service.util.AuthenticateUltil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
public class KafkaSendNotification {
    private final String topicCourse = "course";
    private final String topicLesson = "lesson";
    private final String topicHistotyCourse = "history-course";
    private final String topicLecturerCourse = "lecturer-course";
    private final String topicHistoryLesson = "history-lesson";
    private final String topicCourseStudent = "course-student";
    private final String topicClassStudent = "classroom-student";

    private final String topicQuestionAndAnswer = "question-answer";

    private final CourseRepository courseRepository;

    private  final ClassroomStudentService classroomStudentService;

    private final ClassroomRepository classroomRepository;

    private  final StudentRepository studentRepository;

    private final Logger log = LoggerFactory.getLogger(KafkaSendNotification.class);
    private final static Logger logger = LoggerFactory.getLogger(KafkaSendNotification.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final KafkaTemplate<String,String> kafkaTemplate;
    private final  Gson gson;
    private final UserService userService;

    public KafkaSendNotification(KafkaTemplate<String, String> kafkaTemplate,
                                 Gson gson,
                                 CourseRepository courseRepository,
                                 StudentRepository studentRepository,
                                 ClassroomRepository classroomRepository,
                                 ClassroomStudentService classroomStudentService,
                                 UserService userService) {
        this.kafkaTemplate = kafkaTemplate;
        this.gson = gson;
        this.classroomStudentService = classroomStudentService;
        this.userService = userService;
        this.classroomRepository = classroomRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

//    public void alertCourse(Course course, Principal principal) {
//        log.info("Alert Contacts", course);
//        JSONObject obj = new JSONObject();
//        obj.put("id",course.getId());
//        obj.put("name",course.getCourseName());
//        obj.put("senderId",userService.getUserID(principal));
//        String alert = obj.toJSONString();
//        kafkaTemplate.send(topicCourse, alert);
//    }

    public void alertLesson(Lesson lesson, Principal principal) {
        log.info("Alert Lesson", lesson);
        JSONObject obj = new JSONObject();
        obj.put("id",lesson.getId());
        obj.put("name",lesson.getLesson_name());
        obj.put("senderId",userService.getUserID(principal));
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicLesson, alert);
    }

    public void historyCourse(Course course, String method, User user) {
        log.info("Hitory Course", course);
        String content = processContentHistory(course.getCourseName(), method);
        History history = new History();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        HistoryDto dto = new HistoryDto();
        dto.setCourseId(course.getId());
        dto.setUserId(user.getId());;
        dto.setHistoryName(content);
        dto.setHistoryTime(sdf.format(new Date()));
        log.error("date: "+sdf.format(new Date()));
        String alert = gson.toJson(history);
        kafkaTemplate.send(topicHistotyCourse, gson.toJson(dto));

    }



    public void alertCourse(Course course) {
        log.info("Alert lectuer Course", course);
        User user = userService.findOneByLogin(AuthenticateUltil.getLoginByCurrentLogin());
        JSONObject obj = new JSONObject();
        obj.put("courseName",course.getCourseName());
        obj.put("lecturerId",course.getLecturer().getId());
        obj.put("senderId",user.getId());
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicLecturerCourse,alert);
    }

    public void historyLesson(Lesson lesson, String method, User user) {
        log.info("Hitory Lesson", lesson);
        String content = processContentHistory(lesson.getLesson_name(), method);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        HistoryDto dto = new HistoryDto();
        dto.setLessonId(lesson.getId());
        dto.setUserId(user.getId());
        dto.setHistoryName(content);
        dto.setHistoryTime(sdf.format(new Date()));
        dto.setCourseId(lesson.getCourse().getId());
        kafkaTemplate.send(topicHistoryLesson, gson.toJson(dto));
    }

    public void courseStudentAlert(CourseStudent courseStudent, String senderId) {
        log.info("Alert CourseStudent", courseStudent, senderId);
        Course course = courseRepository.findOneById(courseStudent.getCourse().getId());
        Student student = studentRepository.findOneById(courseStudent.getStudent().getId());
        JSONObject obj = new JSONObject();
        obj.put("courseName",course.getCourseName());
        obj.put("receiverId",student.getUser().getId());
        obj.put("receiverEmail", student.getUser().getEmail());
        obj.put("senderId",senderId);
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicCourseStudent, alert);
//        kafkaTemplate.send(topicCourseStudent, gson.toJson(courseStudent));
    }

    public void classroomStudentAlert(ClassroomStudent classroomStudent, String senderId) {
        log.info("Alert CourseStudent", classroomStudent, senderId);
//        Optional<Classroom> classroomStudent1 = classroomRepository.findById(classroomStudent.getId());
        Classroom classroom = classroomRepository.findOneById(classroomStudent.getClassroom().getId());
        Student student = studentRepository.findOneById(classroomStudent.getStudent().getId());
        JSONObject obj = new JSONObject();
        obj.put("classroomName",classroom.getClassroomName());
        obj.put("receiverId",student.getUser().getId());
        obj.put("receiverEmail", student.getUser().getEmail());
        obj.put("senderId",senderId);
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicClassStudent, alert);
//        kafkaTemplate.send(topicCourseStudent, gson.toJson(courseStudent));
    }
    public void alertQuestionAnswers(QuestionAndAnswer questionAndAnswer,String userId) {
        log.info("Alert alertQuestionAnswers", questionAndAnswer);
        User user = userService.getUserByID(userId);
        StringBuilder content = new StringBuilder();
        QuestionAnswerDto dto = new QuestionAnswerDto();
        if (questionAndAnswer.getUser().getId().equals(userId)){
            // user gửi thắc mắc
            content.append(user.getFirstName());
            content.append(" ");
            content.append(user.getLastName());
            content.append(" ");
            content.append("đã gửi cho bạn một thắc mắc") ;
            dto.setReceiverId(userId);
            dto.setSenderId(userId);
        } else {
            //admin phản hồi thắc mắc
            content.append("Thắc mắc của bạn đã được phản hồi") ;
            dto.setReceiverId(questionAndAnswer.getUser().getId());
            dto.setSenderId(userId);
        }
        dto.setName(content.toString());
//
//        JSONObject obj = new JSONObject();
//
//        String alert = obj.toJSONString();
        kafkaTemplate.send(topicQuestionAndAnswer,gson.toJson(dto));
    }

    public String processContentHistory(String content, String method){
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
        sbActivityHistoryName.append(content);
        return  sbActivityHistoryName.toString();
    }

}
