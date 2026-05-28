package com.mrbarber.controller;

import com.mrbarber.entity.ServiceItem;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.ServiceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
public class AdminServiceController {

    private final ServiceItemRepository repo;

    @GetMapping
    public List<ServiceItem> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    public ServiceItem create(@RequestBody ServiceItem body) {
        body.setId(null);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public ServiceItem update(@PathVariable Long id, @RequestBody ServiceItem body) {
        ServiceItem existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Service " + id + " not found"));
        existing.setTitle(body.getTitle());
        existing.setDescription(body.getDescription());
        existing.setIconName(body.getIconName());
        existing.setDisplayOrder(body.getDisplayOrder());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
