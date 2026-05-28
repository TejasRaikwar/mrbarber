package com.mrbarber.controller;

import com.mrbarber.entity.Appointment;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/appointments")
@RequiredArgsConstructor
public class AdminAppointmentController {

    private final AppointmentRepository repo;

    @GetMapping
    public List<Appointment> all() {
        return repo.findAllByOrderByAppointmentDateDescAppointmentTimeDesc();
    }

    @PostMapping
    public Appointment create(@RequestBody Appointment body) {
        body.setId(null);
        body.setCreatedAt(LocalDateTime.now());
        return repo.save(body);
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @RequestBody Appointment body) {
        Appointment existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Appointment " + id + " not found"));
        existing.setClientName(body.getClientName());
        existing.setPhone(body.getPhone());
        existing.setService(body.getService());
        existing.setAppointmentDate(body.getAppointmentDate());
        existing.setAppointmentTime(body.getAppointmentTime());
        existing.setAmount(body.getAmount());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
