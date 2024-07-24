package com.aladin.notification;

import com.aladin.domain.User;
import com.aladin.notification.dto.MessageDto;
import com.aladin.notification.dto.ReceiverDto;
import com.aladin.repository.UserRepository;
import com.aladin.service.LecturerService;
import com.aladin.service.UserService;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.List;

@Component
public class KafkaListen {

//    private final Logger log = LoggerFactory.getLogger(KafkaListen.class);
//    private final Gson gson;
//    private final NotificationService notificationService;
//    private final UserRepository userRepository;
//    private final EmailSendService emailSendService;
//    private final LecturerService lecturerService;
//    private final UserService userService;
//    private final SseSendNotification sseSendNotification;
//    private final JavaMailSender emailSender;
//
//    public KafkaListen(Gson gson,
//                       NotificationService notificationService,
//                       UserRepository userRepository,
//                       LecturerService lecturerService,
//                       UserService userService,
//                       SseSendNotification sseSendNotification,
//                       JavaMailSender emailSender,
//                       EmailSendService emailSendService) {
//        this.gson = gson;
//        this.notificationService = notificationService;
//        this.userRepository = userRepository;
//        this.emailSendService = emailSendService;
//        this.lecturerService = lecturerService;
//        this.userService = userService;
//        this.sseSendNotification = sseSendNotification;
//        this.emailSender = emailSender;
//    }
//
//    @KafkaListener(topics = "test",groupId = "group-id")
//    public void start(String message) {
//        try {
//            log.info("Kafka consumer starting...");
//            log.info("Message: {}",message);
//            System.out.println(message);
//            String[] mails = {"nguyenbaowwe@gmail.com","hieutran2102000@gmail.com","dungtq@aladinteach.co"};
////            emailSendService.sendSimpleMessage(message);
//            MimeMessage message1 = emailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message1);
//            helper.setSubject("Học viện LMS");
//            List<String> lstEmails = new ArrayList<>();
//
//            helper.setTo(mails);
//            helper.setText("test mail");
//            emailSender.send(message1);
//        }
//        catch (Exception e)
//        {
//            log.error(e.getMessage());
//        }
//    }
//
//    @KafkaListener(topics = "course",groupId = "group-id")
//    public void startCourse(String message) {
//        try {
//            log.info("Message: {}",message);
//            MessageDto messageDto = gson.fromJson(message, MessageDto.class);
//            Notification notification = new Notification();
//            User sender = userService.findOneById(messageDto.getSenderId());
//            StringBuilder alert = new StringBuilder();
//            alert.append("Giáo viên: ");
//            alert.append(sender.getFirstName());
//            alert.append(" ");
//            alert.append(sender.getLastName());
//            alert.append(" vừa thêm bạn vào khoá học:\n");
//            alert.append(messageDto.getName());
//            messageDto.setName(alert.toString());
//            notificationService.insertWhenAddCourse(messageDto);
//            notification.setNotificationContent(alert.toString());
//            notification.setSender(sender);
//            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdByCourseId(messageDto.getId());
//            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
//            sseSendNotification.process(lstReceiverDto, notification);
//        }
//        catch (Exception e)
//        {
//            log.error(e.getMessage());
//        }
//    }
//
//    @KafkaListener(topics = "lesson",groupId = "group-id")
//    public void startLesson(String message) {
//        try {
//            log.info("Message: {}",message);
//            MessageDto messageDto = gson.fromJson(message, MessageDto.class);
//            Notification notification = new Notification();
//            User sender = userService.findOneById(messageDto.getSenderId());
//            StringBuilder alert = new StringBuilder();
//            alert.append("Giáo viên: ");
//            alert.append(sender.getFirstName());
//            alert.append(" ");
//            alert.append(sender.getLastName());
//            alert.append(" vừa thêm một bài giảng:\n");
//            alert.append(messageDto.getName());
//            messageDto.setName(alert.toString());
//            notificationService.insertWhenAddCourse(messageDto);
//            notification.setNotificationContent(alert.toString());
//            notification.setSender(sender);
//            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdByLessonId(messageDto.getId());
//            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
//            sseSendNotification.process(lstReceiverDto, notification);
//        }
//        catch (Exception e)
//        {
//            log.error(e.getMessage());
//        }
//    }
//
//    @KafkaListener(topics = "exams",groupId = "group-id")
//    public void startExams(String message) {
//        try {
//            log.info("Message: {}",message);
//            MessageDto messageDto = gson.fromJson(message, MessageDto.class);
//            Notification notification = new Notification();
//            User sender = userService.findOneById(messageDto.getSenderId());
//            StringBuilder alert = new StringBuilder();
//            alert.append("Giáo viên: ");
//            alert.append(sender.getFirstName());
//            alert.append(" ");
//            alert.append(sender.getLastName());
//            alert.append(" vừa thêm một bài kiểm tra:\n");
//            alert.append(messageDto.getName());
//            messageDto.setName(alert.toString());
//            notificationService.insertWhenAddCourse(messageDto);
//            notification.setNotificationContent(alert.toString());
//            notification.setSender(sender);
//            List<ReceiverDto> lstReceiverDto = userRepository.findAllEmailAndIdByExamsId(messageDto.getId());
//            emailSendService.sendSimpleMessage(notification, lstReceiverDto);
//            sseSendNotification.process(lstReceiverDto, notification);
//
//        }
//        catch (Exception e)
//        {
//            log.error(e.getMessage());
//        }
//    }
//
////    public static void main(String[] args) throws JsonProcessingException {
////        MessageDto dto = new ObjectMapper().readValue("{\"id\":8002,\"name\":\"International Web Specialist\"}",MessageDto.class);
////        System.out.println(dto.toString());
////    }
}
