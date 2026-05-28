package com.mrbarber.controller;

import com.mrbarber.entity.Transformation;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.TransformationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/transformations")
@RequiredArgsConstructor
public class AdminTransformationController {

    private final TransformationRepository repo;

    @GetMapping
    public List<Transformation> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public Transformation create(@RequestBody Transformation body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public Transformation update(@PathVariable Long id, @RequestBody Transformation body) {
        Transformation existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Transformation " + id + " not found"));
        existing.setTitle(body.getTitle());
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
