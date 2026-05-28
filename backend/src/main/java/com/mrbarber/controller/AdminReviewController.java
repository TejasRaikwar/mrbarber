package com.mrbarber.controller;

import com.mrbarber.entity.Review;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewRepository repo;

    @GetMapping
    public List<Review> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public Review create(@RequestBody Review body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public Review update(@PathVariable Long id, @RequestBody Review body) {
        Review existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Review " + id + " not found"));
        existing.setAuthorName(body.getAuthorName());
        existing.setLocation(body.getLocation());
        existing.setRating(body.getRating());
        existing.setQuote(body.getQuote());
        existing.setInitials(body.getInitials());
        existing.setAvatarUrl(body.getAvatarUrl());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
