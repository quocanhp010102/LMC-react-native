package com.aladin.notification;

import com.aladin.domain.Notification;
import com.aladin.domain.User;
import com.aladin.notification.dto.MessageDto;
import com.aladin.notification.dto.ReceiverDto;
import com.aladin.repository.UserRepository;
import com.aladin.service.ultil.AuthenticateUltil;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseSendNotification {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private  Map<String,SseEmitter> emitterMap = new HashMap<>();
    private final UserRepository userRepository;

    public SseSendNotification(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public SseEmitter registerClient() {
        SseEmitter emitter = new SseEmitter();
        String login = AuthenticateUltil.getLoginByCurrentLogin();
        User user = userRepository.findOneUserByLogin(login);
        emitterMap.put(user.getId(),emitter);
        emitter.onCompletion(() -> emitterMap.remove(user.getId()));
        emitter.onTimeout(() -> {
            emitter.complete();
            emitterMap.remove(user.getId());
        });
        return emitter;
    }

    public void process(List<ReceiverDto> lstRecriverDto, Notification notification)  {

       for(ReceiverDto dto : lstRecriverDto){
           SseEmitter emitter = emitterMap.get(dto.getId());
           try
           {
               emitter.send(notification.getNotificationContent());
           }catch(Exception e){
               emitterMap.remove(dto.getId());
           }
       }
    }

}
