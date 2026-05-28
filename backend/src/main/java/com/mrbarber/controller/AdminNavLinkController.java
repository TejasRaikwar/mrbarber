package com.mrbarber.controller;

import com.mrbarber.entity.NavLink;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.NavLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/nav-links")
@RequiredArgsConstructor
public class AdminNavLinkController {

    private final NavLinkRepository repo;

    @GetMapping
    public List<NavLink> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public NavLink create(@RequestBody NavLink body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public NavLink update(@PathVariable Long id, @RequestBody NavLink body) {
        NavLink existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Nav link " + id + " not found"));
        existing.setLabel(body.getLabel());
        existing.setHash(body.getHash());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
