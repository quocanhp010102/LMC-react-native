package com.aladin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ComponentScan
public class UploadFileConfig implements WebMvcConfigurer {
    @Value("${upload.dir}")
    String uploadDir;

    @Value("${upload.prefix}")
    String uploadPrefix;

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/"+uploadPrefix+"/**").addResourceLocations("file:"+uploadDir+"/");
    }
}
