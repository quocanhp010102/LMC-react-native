package com.aladin.notification;

import com.aladin.domain.*;
import com.aladin.notification.dto.*;
import com.aladin.repository.*;
import com.aladin.service.*;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.*;

@Component
public class KafkaListen {

    private final Logger log = LoggerFactory.getLogger(KafkaListen.class);
    private final Gson gson;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final EmailSendService emailSendService;
    private final LecturerService lecturerService;
    private final UserService userService;
    private final SseSendNotification sseSendNotification;
    private final JavaMailSender emailSender;
    private final HistoryRepository historyRepository;
    private final NotiReceiverRepository notiReceiverRepository;
    private final NotificationRepository notificationRepository;
    private final ExamsService examsService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final AuthorityRepository authorityRepository;
    private final ExamsRepository examsRepository;
    private KafkaTemplate<String,String> kafkaTemplate;
    private final String groupId = "group-id5";
//private final String groupId = "group-id1";
    public KafkaListen(Gson gson,
                       NotificationService notificationService,
                       UserRepository userRepository,
                       LecturerService lecturerService,
                       UserService userService,
                       SseSendNotification sseSendNotification,
                       JavaMailSender emailSender,
                       HistoryRepository historyRepository,
                       NotiReceiverRepository notiReceiverRepository,
                       NotificationRepository notificationRepository,
                       ExamsService examsService,
                       SimpMessagingTemplate simpMessagingTemplate,
                       AuthorityRepository authorityRepository,
                       ExamsRepository examsRepository,
                       EmailSendService emailSendService) {
        this.gson = gson;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.emailSendService = emailSendService;
        this.lecturerService = lecturerService;
        this.userService = userService;
        this.sseSendNotification = sseSendNotification;
        this.emailSender = emailSender;
        this.historyRepository = historyRepository;
        this.notiReceiverRepository = notiReceiverRepository;
        this.notificationRepository = notificationRepository;
        this.examsService = examsService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.authorityRepository = authorityRepository;
        this.examsRepository = examsRepository;
    }

    @KafkaListener(topics = "test",groupId = groupId)
    public void start(String message) {
        try {
            log.info("Kafka consumer starting...");
            log.info("Message: {}",message);
//            System.out.println(message);
//            String[] mails = {"nguyenbaowwe@gmail.com","hieutran2102000@gmail.com","dungtq@aladinteach.co"};
////            emailSendService.sendSimpleMessage(message);
////            MimeMessage message1 = emailSender.createMimeMessage();
////            MimeMessageHelper helper = new MimeMessageHelper(message1);
////            helper.setSubject("Học viện LMS");
////            List<String> lstEmails = new ArrayList<>();
////            helper.setTo(mails);
////            helper.setText("test mail");
////            emailSender.send(message1);
//            Notification notification = new Notification();
//            notification.setNotificationTime(new Date());
//            notification.setNotificationContent(message);
//            ReceiverDto receiverDto = new ReceiverDto();
//            receiverDto.setId("6277942147064924260");
//            List<ReceiverDto> lstReceiverDto = new ArrayList<>();
//            lstReceiverDto.add(receiverDto);
//            sseSendNotification.process(lstReceiverDto, notification);
//            sendNotification(lstReceiverDto, notification);
        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "course",groupId = groupId)
    public void startCourse(String message) {
        try {
            log.info("Message: {}",message);
            MessageDto messageDto = gson.fromJson(message, MessageDto.class);
            Notification notification = new Notification();
            User sender = userService.findOneById(messageDto.getSenderId());
            StringBuilder alert = new StringBuilder();
            alert.append("Giáo viên: ");
            alert.append(sender.getFirstName());
            alert.append(" ");
            alert.append(sender.getLastName());
            alert.append(" vừa thêm bạn vào khoá học:\n");
            alert.append(messageDto.getName());
            messageDto.setName(alert.toString());
            notification.setNotificationContent(alert.toString());
            notification.setSender(sender);
            notification = notificationService.insertWhenAddCourse(notification, sender);
            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdByCourseId(messageDto.getId());
            List<String> ids = new ArrayList<>();
            for(ReceiverDto receiverDto : lstReceiverDto){
                ids.add(receiverDto.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(ids, notification.getId());
            sendNotification(dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);

        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "lesson",groupId = groupId)
    public void startLesson(String message) {
        try {
            log.info("Message: {}",message);
            MessageDto messageDto = gson.fromJson(message, MessageDto.class);
            Notification notification = new Notification();
            User sender = userService.findOneById(messageDto.getSenderId());
            StringBuilder alert = new StringBuilder();
            alert.append("Giáo viên: ");
            alert.append(sender.getFirstName());
            alert.append(" ");
            alert.append(sender.getLastName());
            alert.append(" vừa thêm một bài giảng:\n");
            alert.append(messageDto.getName());
            messageDto.setName(alert.toString());
            notification.setNotificationContent(alert.toString());
            notification.setSender(sender);
            notification.setNotificationTitle(messageDto.getName());
            notification.setNotificationTime(new Date());
            notification = notificationService.insertWhenAddLesson(notification, messageDto);
            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdByLessonId(messageDto.getId());
            List<String> ids = new ArrayList<>();
            for(ReceiverDto receiverDto : lstReceiverDto){
                ids.add(receiverDto.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(ids, notification.getId());
            sendNotification(dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);

        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "notificaion",groupId = groupId)
    public void alertNotification(String message){
        try{
            log.info("Message: {}",message);
            NotificationDto notificationDto = gson.fromJson(message, NotificationDto.class);
            StringBuilder sp = new StringBuilder();
            sp.append("Phòng đào tạo vừa thêm một thông báo: ");
            sp.append(notificationDto.getNotificationContent());
            List<Authority> lstAuthor = authorityRepository.getAllByLstNameIn(notificationDto.getAuthorities());
            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdBylstAuthor(lstAuthor);
            Notification notification = new Notification();
            notification.setNotificationTitle(notificationDto.getNotificationTitle());
            notification.setNotificationContent(notificationDto.getNotificationContent());
            List<String> ids = new ArrayList<>();
            for(ReceiverDto receiverDto : lstReceiverDto){
                ids.add(receiverDto.getId());
            }
            log.error("Size of ids ==================",ids.size());
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(ids, notificationDto.getId());

            sendNotification(dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }


    @KafkaListener(topics = "exams",groupId = groupId)
    public void startExams(String message) {
        try {
            log.info("Message: {}",message);
            MessageDto messageDto = gson.fromJson(message, MessageDto.class);
            User lecturer = userRepository.findOneById(messageDto.getSenderId());
            Notification notification = new Notification();
            StringBuilder alert = new StringBuilder();
            alert.append("Giáo viên ");
            alert.append(lecturer.getFirstName()+ " " + lecturer.getLastName());
            alert.append("vừa thêm 1 bài kiểm tra: ");
            alert.append(messageDto.getName());
            notification.setNotificationContent(alert.toString());
            notification.setSender(lecturer);
            notification.setNotificationTime(new Date());
            notification.setNotificationTitle(messageDto.getName());
            notification = notificationService.insertWhenAddExams(notification,messageDto);
            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdByExamsId(messageDto.getId());
            List<String> lstReceiverId = new ArrayList<>();
            for(ReceiverDto receiverDto : lstReceiverDto){
                lstReceiverId.add(receiverDto.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(lstReceiverId, notification.getId());
            sendNotification( dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "exams-history",groupId = groupId)
    public void startExamsHistory(String message) {
        try {
            log.info("Message: {}",message);
            ExamsHistoryDto examsHistoryDto = gson.fromJson(message, ExamsHistoryDto.class);
            Notification notification = new Notification();
            User teacher = userService.findOneById(examsHistoryDto.getSenderId());
            User student = userService.findOneByStudentId(examsHistoryDto.getReceiverId());
            Exams exams = examsRepository.findOneById(examsHistoryDto.getExamsId());
            StringBuilder alert = new StringBuilder();
            alert.append("Bài thi ");
            alert.append(exams.getExamName());
            alert.append(" của bạn ");
            alert.append("vừa được chấm bởi ");
            alert.append(teacher.getFirstName());
            alert.append(" ");
            alert.append(teacher.getLastName());
            notification.setNotificationContent(alert.toString());
            notification.setSender(teacher);
            notification.setNotificationTime(new Date());
            notification.setNotificationTitle(exams.getExamName());
            notification = notificationRepository.save(notification);
            NotiReceiver notiReceiver = new NotiReceiver();
            notiReceiver.setReceiver(student);
            notiReceiver.setNotiReceiverStatus("0");
            notiReceiver.setNotification(notification);
            notiReceiverRepository.save(notiReceiver);
            ReceiverDto receiverDto = new ReceiverDto();
            receiverDto.setId(student.getId());
            receiverDto.setEmail(student.getEmail());
            List<ReceiverDto> lstReceiverDto = new ArrayList<>();
            lstReceiverDto.add(receiverDto);
            List<String> lstReceiverId = new ArrayList<>();
            for(ReceiverDto item : lstReceiverDto){
                lstReceiverId.add(item.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(lstReceiverId, notification.getId());
            sendNotification( dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "lecturer-course",groupId = groupId)
    public void alertLecturerCourse(String message)  {
        try {
            log.info("Message: {}",message);
            LecturerCourseDto lecturerCourseDto = gson.fromJson(message, LecturerCourseDto.class);
            Notification notification = new Notification();
            StringBuilder alert = new StringBuilder();
            alert.append("Phòng đào tạo: ");
            alert.append("vừa thêm bạn vào khoá học: ");
            alert.append(lecturerCourseDto.getCourseName());
            notification.setNotificationContent(alert.toString());
            String senderId = lecturerCourseDto.getSenderId();
            User sender = userService.findOneById(senderId);
            User receiver = userRepository.findOneByLecturerId(lecturerCourseDto.getLecturerId());
            notification.setSender(sender);
            notification.setNotificationTime(new Date());
            notification.setNotificationTitle(lecturerCourseDto.getCourseName());
            Notification notificationOld = new Notification();
            if(notificationService.findOneByTitleAndSenderId(notification.getNotificationTitle(), sender.getId()) != null){
                notificationOld = notificationService.findOneByTitleAndSenderId(notification.getNotificationTitle(), sender.getId());
                notification = notificationOld;
                notiReceiverRepository.insertByUserId(notificationOld.getId(), receiver.getId());
            }
            else{
                notification = notificationRepository.save(notification);
                notiReceiverRepository.insertByUserId(notification.getId(), receiver.getId());
            }
            ReceiverDto receiverDto = new ReceiverDto();
            receiverDto.setId(receiver.getId());
            receiverDto.setEmail(receiver.getEmail());
            List<ReceiverDto> lstReceiverDto = new ArrayList<>();
            lstReceiverDto.add(receiverDto);
            List<String> lstReceiverId = new ArrayList<>();
            for(ReceiverDto item : lstReceiverDto){
                lstReceiverId.add(item.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(lstReceiverId, notification.getId());
            sendNotification( dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
        }catch (Exception e){
            log.error(e.getMessage());
        }

    }

    @KafkaListener(topics = "course-student",groupId = groupId)
    public void alertStudentByCourse(String message)  {
        try {
            log.info("Message: {}",message);
            CourseStudentDto courseStudentDto = gson.fromJson(message, CourseStudentDto.class);
            Notification notification = new Notification();
            User sender = userService.findOneById(courseStudentDto.getSenderId());
            StringBuilder alert = new StringBuilder();
            alert.append("Phòng đào tạo: ");
            alert.append("vừa thêm bạn vào khoá học: ");
            alert.append(courseStudentDto.getCourseName());
            notification.setNotificationContent(alert.toString());
            notification.setSender(sender);
            notification.setNotificationTime(new Date());
            notification.setNotificationTitle(courseStudentDto.getCourseName());
            Notification notificationOld = new Notification();
//            if(notificationService.findOneByTitleAndSenderId(notification.getNotificationTitle(), sender.getId()) != null){
//                notificationOld = notificationService.findOneByTitleAndSenderId(notification.getNotificationTitle(), sender.getId());
//                notification = notificationOld;
//                notiReceiverRepository.insertByUserId(notificationOld.getId(), courseStudentDto.getReceiverId());
//            }
//            else{
                notification = notificationRepository.save(notification);
                notiReceiverRepository.insertByUserId(notification.getId(), courseStudentDto.getReceiverId());
//            }
            ReceiverDto receiverDto = new ReceiverDto();
            receiverDto.setId(courseStudentDto.getReceiverId());
            receiverDto.setEmail(courseStudentDto.getReceiverEmail());
            List<ReceiverDto> lstReceiverDto = new ArrayList<>();
            lstReceiverDto.add(receiverDto);
            List<String> lstReceiverId = new ArrayList<>();
            for(ReceiverDto item : lstReceiverDto){
                lstReceiverId.add(item.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(lstReceiverId, notification.getId());
            sendNotification( dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);

        }catch (Exception e){
            log.error(e.getMessage());
        }
    }

    @KafkaListener(topics = "classroom-student",groupId = groupId)
    public void alertStudentByClass(String message) {
        try {
            log.info("Message: {}",message);
            ClassroomStudentDto classroomStudentDto = gson.fromJson(message, ClassroomStudentDto.class);
            Notification notification = new Notification();
            User sender = userService.findOneById(classroomStudentDto.getSenderId());
            StringBuilder alert = new StringBuilder();
            alert.append("Phòng đào tạo ");
            alert.append("vừa thêm Bạn vào lớp học: ");
            alert.append(classroomStudentDto.getClassroomName());
            notification.setNotificationContent(alert.toString());
            notification.setSender(sender);
            notification.setNotificationTime(new Date());
            notification.setNotificationTitle(classroomStudentDto.getClassroomName());
            Notification notificationOld = new Notification();
//            if(notificationService.findOneByTitleAndSenderId(notification.getNotificationTitle(), sender.getId()) != null) {
//                notificationOld = notificationService.findOneByTitleAndSenderId(notification.getNotificationTitle(), sender.getId());
//                notification = notificationOld;
//                notiReceiverRepository.insertByUserId(notificationOld.getId(), classroomStudentDto.getReceiverId());
//            }
//           else{
                notification = notificationRepository.save(notification);
                notiReceiverRepository.insertByUserId(notification.getId(), classroomStudentDto.getReceiverId());
//            }
            ReceiverDto receiverDto = new ReceiverDto();
            receiverDto.setId(classroomStudentDto.getReceiverId());
            receiverDto.setEmail(classroomStudentDto.getReceiverEmail());
            List<ReceiverDto> lstReceiverDto = new ArrayList<>();
            lstReceiverDto.add(receiverDto);
            List<String> lstReceiverId = new ArrayList<>();
            for(ReceiverDto item : lstReceiverDto){
                lstReceiverId.add(item.getId());
            }
            List<com.aladin.web.rest.dto.NotificationDto> dtos = notificationRepository.getAllByReceiverIdAndNotiId(lstReceiverId, notification.getId());
            sendNotification( dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);

        }catch (Exception e){
           log.error(e.getMessage());
        }

    }

    @KafkaListener(topics = "history-lesson",groupId = groupId)
    public void saveHistoryLesson(String message){
        log.info("Message: {}",message);
//        HistoryDto historyDto = gson.fromJson(message, HistoryDto.class);
//        History history = new History();
//        history.setHistoryName(historyDto.getHistoryName());
//        history.setHistoryTime(historyDto.getHistoryTime());
//
//        Lesson lesson = new Lesson();
//        lesson.setId(historyDto.getLessonId());
//
//        Course course = new Course();
//        course.setId(historyDto.getCourseId());
//
//        User user = new User();
//        user.setId(historyDto.getUserId());
//
//        history.setUser(user);
//        history.setLesson(lesson);
//        history.setCourse(course);
//        historyRepository.save(history);

    }

    @KafkaListener(topics = "history-course",groupId = groupId)
    public void saveHistoryCourse(String message){
        log.info("Message: {}",message);
//        HistoryDto historyDto = gson.fromJson(message, HistoryDto.class);
//        History history = new History();
//        history.setHistoryName(historyDto.getHistoryName());
//        history.setHistoryTime(historyDto.getHistoryTime());
//
//        Course course = new Course();
//        course.setId(historyDto.getCourseId());
//
//        User user = new User();
//        user.setId(historyDto.getUserId());
//
//        history.setCourse(course);
//        history.setUser(user);
//        historyRepository.save(history);

    }

    @KafkaListener(topics = "question-answer",groupId = groupId)
    public void startQuestionAnswer(String message) {
        try {
            log.info("Message: {}",message);
            QuestionAnswerDto messageDto = gson.fromJson(message, QuestionAnswerDto.class);
            Notification notification = new Notification();
            User sender = userService.findOneById(messageDto.getSenderId());

            notification.setSender(sender);
            notification.setNotificationContent(messageDto.getName());
            notification.setNotificationTitle("Giải đáp thắc mắc");
            notification.setNotificationTime(new Date());
            notification = notificationRepository.save(notification);

            List<com.aladin.web.rest.dto.NotificationDto> dtos = new ArrayList<>();
            List<ReceiverDto> lstReceiverDto = new ArrayList<>();
            List<String> lstReceiverId = new ArrayList<>();

            if(userService.checkIsAdmin(sender.getId())){
                User receiver = userService.findOneById(messageDto.getReceiverId());

                NotiReceiver notiReceiver = new NotiReceiver();
                notiReceiver.setNotification(notification);
                notiReceiver.setNotiReceiverStatus("0");
                notiReceiver.setReceiver(receiver);
                notiReceiverRepository.save(notiReceiver);

                ReceiverDto receiverDto = new ReceiverDto();
                receiverDto.setId(receiver.getId());
                receiverDto.setEmail(receiver.getEmail());

                lstReceiverDto.add(receiverDto);
                lstReceiverId.add(receiverDto.getId());
            }else{
                notiReceiverRepository.inserWhenAddQuestionsAnswer(notification.getId());
                List<String> lstNameAuthor = new ArrayList<>();
                lstNameAuthor.add("ROLE_ADMIN");
                List<Authority> lstAuthor = authorityRepository.getAllByLstNameIn(lstNameAuthor);
                lstReceiverDto = userRepository.findAllEmailAndIdBylstAuthor(lstAuthor);
                for(ReceiverDto item : lstReceiverDto){
                    lstReceiverId.add(item.getId());
                }
            }
          dtos = notificationRepository.getAllByReceiverIdAndNotiId(lstReceiverId, notification.getId());
            sendNotification(dtos);
            emailSendService.sendSimpleMessage(notification, lstReceiverDto);

        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }

    public void sendNotification ( List<com.aladin.web.rest.dto.NotificationDto> dtos){
        for(com.aladin.web.rest.dto.NotificationDto dto : dtos){
            StringBuilder topic = new StringBuilder("/topic/notificaiton/");
            topic.append(dto.getReceiverId());
            simpMessagingTemplate.convertAndSend(topic.toString(),dto);
        }
    }

}
