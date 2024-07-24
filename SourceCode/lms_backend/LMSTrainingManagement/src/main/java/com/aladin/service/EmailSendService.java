package com.aladin.service;

import com.aladin.domain.Notification;
import com.aladin.notification.dto.MessageDto;
import com.aladin.notification.dto.ReceiverDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmailSendService {
    private final Logger log = LoggerFactory.getLogger(EmailSendService.class);
    private final JavaMailSender emailSender;

    public EmailSendService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }
    public void sendSimpleMessage(Notification notification, List<ReceiverDto> lstReceiverDto) {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        try{
            helper.setSubject("Học viện LMS");
            List<String> lstEmails = new ArrayList<>();
            for(ReceiverDto dto : lstReceiverDto){
                lstEmails.add(dto.getEmail());
            }
            String[] arrayEmail =   lstEmails.toArray(new String[lstEmails.size()]);
            helper.setTo(arrayEmail);
            helper.setText(notification.getNotificationContent());

            // file
//            FileSystemResource file1 = new FileSystemResource(new File(path1));
//            helper.addAttachment("Txt file", file1);

            //send html
//            message.setContent(htmlMsg, "text/html");
        }catch (Exception e){
            log.warn(e.getMessage());
        }
        emailSender.send(message);
    }
}
