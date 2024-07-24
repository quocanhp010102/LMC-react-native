package com.aladin.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {
    @Value("${upload.dir}")
    String uploadDir;
    @Value("${upload.prefix}")
    String uploadPrefix;
    @Value("${link_img}")
    String link_img;

    private final Logger log = LoggerFactory.getLogger(ImageService.class);

    public String uploadFile(MultipartFile file, String name) throws Exception{
        try {
            Path root = Paths.get(uploadDir);
            Path resolve = root.resolve(name);
            Files.createDirectories(root);
            Files.copy(file.getInputStream(), resolve);
            log.info("dang up file image");
        } catch (Exception e) {
            System.out.println("Error");
        }
        return link_img+"/"+uploadPrefix+"/"+ name;
    }



}
