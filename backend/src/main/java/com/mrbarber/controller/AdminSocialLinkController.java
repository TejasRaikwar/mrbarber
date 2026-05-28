package com.mrbarber.controller;

import com.mrbarber.entity.SocialLink;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.SocialLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/social-links")
@RequiredArgsConstructor
public class AdminSocialLinkController {

    private final SocialLinkRepository repo;

    @GetMapping
    public List<SocialLink> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public SocialLink create(@RequestBody SocialLink body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public SocialLink update(@PathVariable Long id, @RequestBody SocialLink body) {
        SocialLink existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Social link " + id + " not found"));
        existing.setPlatform(body.getPlatform());
        existing.setUrl(body.getUrl());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
