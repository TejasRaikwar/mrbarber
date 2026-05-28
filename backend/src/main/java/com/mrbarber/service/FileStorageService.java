package com.mrbarber.service;

import com.mrbarber.config.AppProperties;
import com.mrbarber.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTS =
            Set.of("png", "jpg", "jpeg", "webp", "gif", "svg", "ico");

    private final AppProperties props;
    private Path uploadRoot;

    @PostConstruct
    void init() throws IOException {
        uploadRoot = Paths.get(props.getUploads().getDir()).toAbsolutePath().normalize();
        Files.createDirectories(uploadRoot);
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot + 1).toLowerCase();

        if (!ALLOWED_EXTS.contains(ext)) {
            throw new BadRequestException("Unsupported file type: " + ext);
        }

        String filename = UUID.randomUUID() + "." + ext;
        Path target = uploadRoot.resolve(filename).normalize();
        if (!target.startsWith(uploadRoot)) {
            throw new BadRequestException("Invalid file path");
        }

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        return props.getUploads().getPublicBaseUrl() + "/" + filename;
    }
}
