package com.mrbarber.controller;

import com.mrbarber.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/files")
@RequiredArgsConstructor
public class AdminFileController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(consumes = "multipart/form-data")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        Map uploadResult = cloudinaryService.uploadImage(file);
        return Map.of("url", uploadResult.get("secure_url").toString());
    }
}
