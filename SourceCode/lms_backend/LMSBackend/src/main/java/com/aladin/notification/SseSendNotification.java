package com.aladin.notification;


import org.springframework.stereotype.Service;


@Service
public class SseSendNotification {

//    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();
//
//    private final Map<String,SseEmitter> emitterMap = new HashMap<>();
//    private final UserRepository userRepository;
//
//    public SseSendNotification(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    public SseEmitter registerClient() {
//        SseEmitter emitter = new SseEmitter();
//        String login = AuthenticateUltil.getLoginByCurrentLogin();
//        User user = userRepository.findOneUserByLogin(login);
//        emitterMap.put(user.getId(),emitter);
//        emitter.onCompletion(() -> emitterMap.remove(user.getId()));
//        emitter.onTimeout(() -> {
//            emitter.complete();
//            emitterMap.remove(user.getId());
//        });
//        return emitter;
//    }
//
//    public void process(List<ReceiverDto> lstRecriverDto, Notification notification) throws IOException {
//
//       for(ReceiverDto dto : lstRecriverDto){
//           SseEmitter emitter = emitterMap.get(dto.getId());
//           try
//           {
//               emitter.send(notification.getNotificationContent());
//           }catch(Exception e){
//               emitterMap.remove(dto.getId());
//           }
//       }
//    }

}
