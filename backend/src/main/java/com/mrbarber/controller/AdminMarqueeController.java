package com.mrbarber.controller;

import com.mrbarber.entity.MarqueeItem;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.MarqueeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/marquee")
@RequiredArgsConstructor
public class AdminMarqueeController {

    private final MarqueeItemRepository repo;

    @GetMapping
    public List<MarqueeItem> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public MarqueeItem create(@RequestBody MarqueeItem body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public MarqueeItem update(@PathVariable Long id, @RequestBody MarqueeItem body) {
        MarqueeItem existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Marquee item " + id + " not found"));
        existing.setText(body.getText());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
