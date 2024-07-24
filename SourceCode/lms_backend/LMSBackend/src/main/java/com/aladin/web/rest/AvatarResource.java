package com.aladin.web.rest;

import com.aladin.domain.Admin;
import com.aladin.domain.Lecturer;
import com.aladin.domain.Student;
import com.aladin.service.AdminService;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;

import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;

@RestController
@RequestMapping("/api")
public class AvatarResource {


    private final Logger log = LoggerFactory.getLogger(AvatarResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final StudentService studentService;
    private final LecturerService lecturerService;
    private final AdminService adminService;

    public AvatarResource(UserService userService, StudentService studentService, LecturerService lecturerService, AdminService adminService) {
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
        this.adminService = adminService;
    }

    @PutMapping("/updateAvatar")
    public void updateAvatar(@RequestBody String[] lsAvatar, Principal principal){
        log.debug("REST request to update avatar");
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        String avatar=null;
        for (int i = 0; i < lsAvatar.length; i++) {
            if(lsAvatar.length==1){
                avatar=lsAvatar[0];
            }else {
                throw new BadRequestAlertException("Only one avatar", ENTITY_NAME, "OnlyOneAvatar");
            }
        }
        if(studentService.checkIsStudent(userid)){
            Student student=studentService.getStudentById(userid);
            student.setStudent_avatar(avatar);
            studentService.save(student);
        }
        if(lecturerService.checkIsLecturer(userid)){
            Lecturer lecturer=lecturerService.getLecturerByUser(userid);
            lecturer.setLecturer_avatar(avatar);
            lecturerService.save(lecturer);
        }
        if(userService.checkIsAdmin(userid)){
            Admin admin=adminService.getAdminByUser(userid);
            admin.setAdmin_avatar(avatar);
            adminService.save(admin);
        }

    }
}
