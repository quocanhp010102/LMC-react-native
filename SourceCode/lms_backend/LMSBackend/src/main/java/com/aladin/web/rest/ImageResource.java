package com.aladin.web.rest;

import com.aladin.service.ImageService;
import com.aladin.service.LecturerService;
import com.aladin.service.StudentService;
import com.aladin.service.UserService;
import com.aladin.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static org.hibernate.id.IdentifierGenerator.ENTITY_NAME;

@RestController
@RequestMapping("/api")
public class ImageResource {
    private final ImageService imageService;

    private final Logger log = LoggerFactory.getLogger(ImageResource.class);

    private final UserService userService;

    private final StudentService studentService;

    private final LecturerService lecturerService;

    public ImageResource(ImageService imageService, UserService userService, StudentService studentService, LecturerService lecturerService) {
        this.imageService = imageService;
        this.userService = userService;
        this.studentService = studentService;
        this.lecturerService = lecturerService;
    }

    @PostMapping("/uploadImage")
    public ResponseEntity create(@RequestParam MultipartFile file, Principal principal) throws Exception {
        String name;
        log.info(file.getOriginalFilename());
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        long time = System.currentTimeMillis();
        if (file.getContentType().equals("image/png")) {
            name = time + ".png";
        } else if (file.getContentType().equals("image/jpeg")) {
            name = time + ".jpg";
        } else if (file.getContentType().equals("application/msword")) {
            name = time + ".doc";
        } else if (file.getContentType().equals("application/pdf")) {
            name = time + ".pdf";
        } else if (file.getContentType().equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            name = time + ".docx";
        } else if (file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            name = time + ".xlsx";
        } else if (file.getContentType().equals("application/vnd.openxmlformats-officedocument.presentationml.presentation")) {
            name = time + ".pptx";
        } else if (file.getContentType().equals("application/vnd.ms-powerpoint")) {
            name = time + ".ppt";
        }else if (file.getContentType().equals("video/quicktime")) {
            name = time + ".mov";
        } else if (file.getContentType().contains("mp4")) {
            name = time + ".mp4";
        }else if (file.getContentType().toLowerCase().contains("mov")) {
            name = time + ".mov";
        } else {
            return new ResponseEntity<Object>("Please choose other file!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        String linkImage = imageService.uploadFile(file, name);
        if (linkImage.equals("ErrorFTP"))
            return new ResponseEntity<Object>("Error FTP", HttpStatus.INTERNAL_SERVER_ERROR);
        else
            return new ResponseEntity<Object>(linkImage, HttpStatus.OK);
    }

    //chua check dieu kien
    @PostMapping("/uploadMultipleFile")
    public List<String> uploads(@RequestBody MultipartFile[] files, Principal principal) throws Exception {
        String userid = userService.getUserID(principal);
        if (!userService.checkIsAdmin(userid) && !studentService.checkIsStudent(userid) && !lecturerService.checkIsLecturer(userid)) {
            throw new BadRequestAlertException("OnlyLMSUser", ENTITY_NAME, "OnlyLMSUser");
        }
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(imageService.uploadFile(file, file.getOriginalFilename()));
        }
        return urls;
    }

}
