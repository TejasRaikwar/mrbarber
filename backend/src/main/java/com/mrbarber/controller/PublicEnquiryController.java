package com.mrbarber.controller;

import com.mrbarber.entity.Enquiry;
import com.mrbarber.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/public/enquiry")
@RequiredArgsConstructor
public class PublicEnquiryController {

    private final EnquiryRepository repo;

    @PostMapping
    public ResponseEntity<Void> submit(@RequestBody Enquiry body) {
        body.setId(null);
        body.setSubmittedAt(LocalDateTime.now());
        repo.save(body);
        return ResponseEntity.status(201).build();
    }
}
