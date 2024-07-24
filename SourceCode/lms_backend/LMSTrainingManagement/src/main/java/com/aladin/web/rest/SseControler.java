package com.aladin.web.rest;

import com.aladin.domain.User;
import com.aladin.notification.SseSendNotification;
import com.aladin.service.ultil.AuthenticateUltil;
import com.aladin.web.rest.dto.Lesson;
import com.aladin.web.rest.dto.LessonDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/sse")
public class SseControler {
    private final Logger log = LoggerFactory.getLogger(SseControler.class);
//    private final SseSendNotification sseSendNotification;
//    private SimpMessagingTemplate simpMessagingTemplate;
//
//    public SseControler(SseSendNotification sseSendNotification, SimpMessagingTemplate simpMessagingTemplate) {
//        this.sseSendNotification = sseSendNotification;
//        this.simpMessagingTemplate = simpMessagingTemplate;
//    }
//
//    private Map<String,SseEmitter> emitterMap = new HashMap<>();
//
//    @CrossOrigin(maxAge = 3600)
//    @GetMapping(value = "/registerNotification", consumes = MediaType.ALL_VALUE)
//    public SseEmitter registerClient(Principal principal) {
//        log.debug("REST request to register Notification " );
//        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
//        try {
////            String login = AuthenticateUltil.getLoginByCurrentLogin();
////            log.debug("REST request to register Notification by", login);
//            sseEmitter = registerClient();
//            return sseEmitter;
//        }catch (Exception e){
//            log.warn(e.getMessage());
//            return null;
//        }
//    }
//    public SseEmitter registerClient() {
//        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
////        String login = AuthenticateUltil.getLoginByCurrentLogin();
//        User user = new User();
//        user.setId("1");
//            emitterMap.put(user.getId(),emitter);
//
//        emitter.onCompletion(() -> emitterMap.remove(user.getId()));
//        emitter.onTimeout(() -> {
//            emitter.complete();
//            emitterMap.remove(user.getId());
//        });
//        return emitter;
//    }
//
//    @GetMapping(value = "/registerNotification/send", consumes = MediaType.ALL_VALUE)
//    public ResponseEntity<HttpStatus> registerClient(@RequestParam String test) throws IOException {
//        log.debug("REST request to register Notification " );
//        SseEmitter sseEmitter = new SseEmitter();
//
//            String login = AuthenticateUltil.getLoginByCurrentLogin();
//            log.debug("REST request to register Notification by", login);
//            if(emitterMap.get("1") != null){
//                sseEmitter = emitterMap.get("1");
//                sseEmitter.send(test);
//            }
////            simpMessagingTemplate.convertAndSend("/topic/notificaiton/6277942147064924260",test);
//        List<String> lst = new ArrayList<>();
//            lst.add("1");
//            lst.add("6277942147064924260");
//            lst.add("2");
//        LessonDto dto = new LessonDto();
//        dto.setId(1L);
//        dto.setName("test thoong baso");
//
//            for(String item : lst){
//                StringBuilder topic = new StringBuilder("/topic/notificaiton/");
//                topic.append(item);
//                simpMessagingTemplate.convertAndSend(topic.toString(),dto);
//            }
//
//
//
//
//       return ResponseEntity.ok(HttpStatus.OK);
//    }
}
