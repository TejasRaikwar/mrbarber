package com.mrbarber.controller;

import com.mrbarber.entity.Reel;
import com.mrbarber.entity.SiteSettings;
import com.mrbarber.exception.BadRequestException;
import com.mrbarber.repository.ReelRepository;
import com.mrbarber.repository.SiteSettingsRepository;
import com.mrbarber.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/reels")
@RequiredArgsConstructor
public class AdminReelController {

    private final ReelRepository reelRepo;
    private final CloudinaryService cloudinaryService;
    private final SiteSettingsRepository settingsRepo;

    @GetMapping
    public List<Reel> getAllReels() {
        return reelRepo.findAllByOrderByOrderIndexAsc();
    }

    @PostMapping
    public Reel uploadReel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) throws IOException {

        SiteSettings settings = settingsRepo.findAll().stream().findFirst().orElse(new SiteSettings());
        int maxReels = settings.getMaxReels() != null ? settings.getMaxReels() : 10;

        if (reelRepo.count() >= maxReels) {
            throw new BadRequestException("Maximum number of reels (" + maxReels + ") reached. Please delete an existing reel before uploading a new one.");
        }

        Map uploadResult = cloudinaryService.uploadVideo(file);
        
        long count = reelRepo.count();

        Reel reel = Reel.builder()
                .title(title)
                .videoUrl(uploadResult.get("secure_url").toString())
                .publicId(uploadResult.get("public_id").toString())
                .orderIndex((int) count)
                .build();

        return reelRepo.save(reel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReel(@PathVariable Long id) throws IOException {
        Reel reel = reelRepo.findById(id).orElseThrow(() -> new BadRequestException("Reel not found"));
        
        cloudinaryService.deleteVideo(reel.getPublicId());
        reelRepo.delete(reel);
        
        return ResponseEntity.noContent().build();
    }
}
