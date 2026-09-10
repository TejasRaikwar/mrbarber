package com.mrbarber.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        String uploadPath = uploadDir.toUri().toString();

        Path backendUploadDir = Paths.get("backend/uploads").toAbsolutePath().normalize();
        String backendUploadPath = backendUploadDir.toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(
                        uploadPath.endsWith("/") ? uploadPath : uploadPath + "/",
                        backendUploadPath.endsWith("/") ? backendUploadPath : backendUploadPath + "/",
                        "classpath:/static/uploads/",
                        "classpath:/public/uploads/"
                )
                .setCachePeriod(3600);
    }
}
