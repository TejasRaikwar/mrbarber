package com.mrbarber.controller;

import com.mrbarber.entity.Enquiry;
import com.mrbarber.repository.EnquiryRepository;
import com.mrbarber.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/public/enquiry")
@RequiredArgsConstructor
public class PublicEnquiryController {

    private final EnquiryRepository repo;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Void> submit(@RequestBody Enquiry body) {
        body.setId(null);
        body.setSubmittedAt(LocalDateTime.now());
        Enquiry saved = repo.save(body);

        // Asynchronously send confirmation email to the customer
        emailService.sendEnquiryConfirmationToCustomer(saved);

        // Asynchronously send full details notification email to the owner/admin
        emailService.sendEnquiryNotificationToAdmin(saved);

        return ResponseEntity.status(201).build();
    }
}
