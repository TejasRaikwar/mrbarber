package com.mrbarber.controller;

import com.mrbarber.entity.HairProfile;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.HairProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hair-profiles")
@RequiredArgsConstructor
public class AdminHairProfileController {

    private final HairProfileRepository repo;

    @GetMapping
    public List<HairProfile> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public HairProfile create(@RequestBody HairProfile body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public HairProfile update(@PathVariable Long id, @RequestBody HairProfile body) {
        HairProfile existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("HairProfile " + id + " not found"));
        existing.setTitle(body.getTitle());
        existing.setDescription(body.getDescription());
        existing.setBeforeImageUrl(body.getBeforeImageUrl());
        existing.setAfterImageUrl(body.getAfterImageUrl());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
