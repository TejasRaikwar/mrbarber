package com.mrbarber.controller;

import com.mrbarber.entity.HeroSlide;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.HeroSlideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hero-slides")
@RequiredArgsConstructor
public class AdminHeroSlideController {

    private final HeroSlideRepository repo;

    @GetMapping
    public List<HeroSlide> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public HeroSlide create(@RequestBody HeroSlide body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public HeroSlide update(@PathVariable Long id, @RequestBody HeroSlide body) {
        HeroSlide existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("HeroSlide " + id + " not found"));
        existing.setSubtitle(body.getSubtitle());
        existing.setTitle(body.getTitle());
        existing.setDescription(body.getDescription());
        existing.setImageUrl(body.getImageUrl());
        existing.setPrimaryCtaLabel(body.getPrimaryCtaLabel());
        existing.setPrimaryCtaHref(body.getPrimaryCtaHref());
        existing.setSecondaryCtaLabel(body.getSecondaryCtaLabel());
        existing.setSecondaryCtaHref(body.getSecondaryCtaHref());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
