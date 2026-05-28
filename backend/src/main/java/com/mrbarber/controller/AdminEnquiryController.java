package com.mrbarber.controller;

import com.mrbarber.entity.Enquiry;
import com.mrbarber.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/enquiries")
@RequiredArgsConstructor
public class AdminEnquiryController {

    private final EnquiryRepository repo;

    @GetMapping
    public List<Enquiry> all() {
        return repo.findAllByOrderBySubmittedAtDesc();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
