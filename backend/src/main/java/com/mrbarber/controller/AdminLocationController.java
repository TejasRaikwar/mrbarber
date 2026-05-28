package com.mrbarber.controller;

import com.mrbarber.entity.ContactLocation;
import com.mrbarber.entity.LocationContact;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.ContactLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/locations")
@RequiredArgsConstructor
public class AdminLocationController {

    private final ContactLocationRepository repo;

    @GetMapping
    public List<ContactLocation> all() { return repo.findAllByOrderByDisplayOrderAsc(); }

    @PostMapping
    @Transactional
    public ContactLocation create(@RequestBody ContactLocation body) {
        body.setId(null);
        attachContacts(body);
        return repo.save(body);
    }

    @PutMapping("/{id}")
    @Transactional
    public ContactLocation update(@PathVariable Long id, @RequestBody ContactLocation body) {
        ContactLocation existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Location " + id + " not found"));
        existing.setCity(body.getCity());
        existing.setImageUrl(body.getImageUrl());
        existing.setAddress(body.getAddress());
        existing.setWhatsapp(body.getWhatsapp());
        existing.setDisplayOrder(body.getDisplayOrder());

        // Replace contacts entirely (orphanRemoval handles deletes)
        existing.getContacts().clear();
        if (body.getContacts() != null) {
            for (LocationContact c : body.getContacts()) {
                c.setId(null);
                c.setLocation(existing);
                existing.getContacts().add(c);
            }
        }
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void attachContacts(ContactLocation loc) {
        if (loc.getContacts() == null) {
            loc.setContacts(new ArrayList<>());
            return;
        }
        for (LocationContact c : loc.getContacts()) {
            c.setId(null);
            c.setLocation(loc);
        }
    }
}
