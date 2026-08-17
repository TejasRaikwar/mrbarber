package com.mrbarber.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map uploadVideo(MultipartFile file) throws IOException {
        log.info("Uploading video to Cloudinary...");
        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", "video",
                "folder", "mrbarber/reels"
        ));
    }

    public Map deleteVideo(String publicId) throws IOException {
        log.info("Deleting video from Cloudinary: {}", publicId);
        return cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                "resource_type", "video"
        ));
    }
}
