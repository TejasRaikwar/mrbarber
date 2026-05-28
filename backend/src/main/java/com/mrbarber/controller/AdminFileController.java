package com.mrbarber.controller;

import com.mrbarber.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/files")
@RequiredArgsConstructor
public class AdminFileController {

    private final FileStorageService storage;

    @PostMapping(consumes = "multipart/form-data")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        String url = storage.store(file);
        return Map.of("url", url);
    }
}
