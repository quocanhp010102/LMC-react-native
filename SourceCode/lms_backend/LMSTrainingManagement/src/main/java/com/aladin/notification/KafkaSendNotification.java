package com.aladin.notification;

import com.aladin.domain.*;
import com.aladin.notification.dto.MessageDto;
import com.aladin.notification.dto.NotificationDto;
import com.aladin.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
public class KafkaSendNotification {
    private final String topicCourse = "course";
    private final String topicLesson = "lesson";
    private final String topicExams = "exams";
    private final String topicNotificaion = "notificaion";
    private final String topicExamsHistory = "exams-history";
    private final Logger log = LoggerFactory.getLogger(KafkaSendNotification.class);
    private final static Logger logger = LoggerFactory.getLogger(KafkaSendNotification.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private KafkaTemplate<String,String> kafkaTemplate;
    private final  Gson gson;
    private final UserService userService;

    public KafkaSendNotification(KafkaTemplate<String, String> kafkaTemplate,
                                 Gson gson,
                                 UserService userService) {
        this.kafkaTemplate = kafkaTemplate;
        this.gson = gson;
        this.userService = userService;
    }

    public void alertCourse(Course course, Principal principal) {
        log.info("Alert Contacts", course);
        JSONObject obj = new JSONObject();
        obj.put("id",course.getId());
        obj.put("name",course.getCourseName());
        obj.put("senderId",userService.getUserID(principal));
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicCourse, alert);
    }

    public void alertLesson(Lesson lesson, Principal principal) {
        log.info("Alert Lesson", lesson);
        JSONObject obj = new JSONObject();
        obj.put("id",lesson.getId());
        obj.put("name",lesson.getLesson_name());
        obj.put("senderId",userService.getUserID(principal));
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicLesson, alert);
    }

    public void alertExams(Exams exams, Principal principal) {
        log.info("Alert Exams", exams);
        MessageDto examsDto = new MessageDto();
        JSONObject obj = new JSONObject();
        obj.put("id",exams.getId());
        obj.put("name",exams.getExamName());
        obj.put("senderId",userService.getUserID(principal));
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicExams, alert);
    }

    public void alertNotification(Notification notification) {
        log.info("Alert Notificaiton", notification);
        NotificationDto dto = new NotificationDto();
        dto.setNotificationContent(notification.getNotificationContent());
        dto.setNotificationTitle(notification.getNotificationTitle());
        dto.setId(notification.getId());
        List<String> authorities = new ArrayList<>() ;
        for(Authority authority : notification.getAuthorities()){
            authorities.add(authority.getName());
        }
        dto.setAuthorities(authorities);
        kafkaTemplate.send(topicNotificaion, gson.toJson(dto));
    }

    public void alertExamsHistory(ExamsHistory examsHistory, String userId ,Object[] ob){
        log.info("Alert ExamsHistory when teacher mark exams", examsHistory, userId);
        JSONObject obj = new JSONObject();
        obj.put("senderId",userId);
        obj.put("receiverId",Long.valueOf(ob[2].toString()));
        obj.put("examsId",Long.valueOf(ob[0].toString()));
        String alert = obj.toJSONString();
        kafkaTemplate.send(topicExamsHistory, alert);

    }

}
