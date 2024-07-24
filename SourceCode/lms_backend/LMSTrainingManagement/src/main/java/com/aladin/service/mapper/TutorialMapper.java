package com.aladin.service.mapper;

import com.aladin.domain.Authority;
import com.aladin.domain.Tutorial;
import com.aladin.repository.AuthorityRepository;
import com.aladin.service.AuthorityService;
import com.aladin.web.rest.dto.TutorialDto;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Component
public class TutorialMapper {

//    @Autowired
//    private static AuthorityRepository authorityRepository;
//
//    public static Tutorial convertToEntity(TutorialDto form, AuthorityService authorityService){
//        Tutorial entity = new Tutorial();
//        if(form.getId()!=null&&!form.getId().equals("")){
//            entity.setId(form.getId());
//        }
//        entity.setTutorial_video(form.getTutorial_video());
//        entity.setTutorial_createdDate(form.getTutorial_createdDate());
//        entity.setTutorial_title(form.getTutorial_title());
//        entity.setTutorial_isDisplay(form.getTutorial_isDisplay());
////        List<Authority> lstAuthority = authorityRepository.getAllByLstNameIn(form.getAuthorities());
////        Set<Authority> lstSetAuthority = new HashSet<>(lstAuthority);
////        entity.setAuthorities(lstSetAuthority);
//        return entity;
//    }
}
