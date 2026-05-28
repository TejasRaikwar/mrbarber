package com.mrbarber.controller;

import com.mrbarber.entity.Role;
import com.mrbarber.entity.UserAccount;
import com.mrbarber.exception.BadRequestException;
import com.mrbarber.exception.NotFoundException;
import com.mrbarber.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class AdminStaffController {

    private final UserAccountRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbc;

    @GetMapping
    public List<Map<String, Object>> all() {
        return repo.findAllByRole(Role.STAFF).stream().map(this::toView).toList();
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody StaffRequest body) {
        ensureRoleColumnAcceptsAllRoles();

        if (body.username() == null || body.username().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (body.password() == null || body.password().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }
        if (repo.existsByUsername(body.username())) {
            throw new BadRequestException("Username already taken");
        }

        UserAccount staff = UserAccount.builder()
                .username(body.username())
                .password(passwordEncoder.encode(body.password()))
                .role(Role.STAFF)
                .build();
        applyProfile(staff, body);
        return toView(repo.save(staff));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody StaffRequest body) {
        UserAccount staff = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Staff " + id + " not found"));
        if (staff.getRole() != Role.STAFF) {
            throw new BadRequestException("Only staff accounts can be edited here");
        }
        // username & password are optional on edit; only update if provided
        if (body.username() != null && !body.username().isBlank()
                && !body.username().equals(staff.getUsername())) {
            if (repo.existsByUsername(body.username())) {
                throw new BadRequestException("Username already taken");
            }
            staff.setUsername(body.username());
        }
        if (body.password() != null && !body.password().isBlank()) {
            if (body.password().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters");
            }
            staff.setPassword(passwordEncoder.encode(body.password()));
        }
        applyProfile(staff, body);
        return toView(repo.save(staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ─── helpers ────────────────────────────────────────────────────────── */

    private void applyProfile(UserAccount u, StaffRequest body) {
        u.setDisplayName(blankToNull(body.displayName()));
        u.setPhone(blankToNull(body.phone()));
        u.setAlternatePhone(blankToNull(body.alternatePhone()));
        u.setEmail(blankToNull(body.email()));
        u.setDob(body.dob());
        u.setIdentityProofUrl(blankToNull(body.identityProofUrl()));
        u.setAddress(blankToNull(body.address()));
        u.setSalary(body.salary());
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    private Map<String, Object> toView(UserAccount u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("displayName", u.getDisplayName() != null ? u.getDisplayName() : u.getUsername());
        m.put("phone", u.getPhone());
        m.put("alternatePhone", u.getAlternatePhone());
        m.put("email", u.getEmail());
        m.put("dob", u.getDob());
        m.put("identityProofUrl", u.getIdentityProofUrl());
        m.put("address", u.getAddress());
        m.put("salary", u.getSalary());
        return m;
    }

    private void ensureRoleColumnAcceptsAllRoles() {
        try {
            String type = jdbc.queryForObject(
                "SELECT COLUMN_TYPE FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
                String.class
            );
            if (type == null || type.toLowerCase().startsWith("varchar")) return;
            log.warn("users.role column is '{}' — converting to VARCHAR(20).", type);
            jdbc.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL");
            log.warn("users.role column converted to VARCHAR(20).");
        } catch (Exception e) {
            log.error("Failed to normalize users.role column", e);
            throw new IllegalStateException("Could not patch users.role column: " + e.getMessage(), e);
        }
    }

    public record StaffRequest(
            String username,
            String password,
            String displayName,
            String phone,
            String alternatePhone,
            String email,
            LocalDate dob,
            String identityProofUrl,
            String address,
            BigDecimal salary
    ) {}
}
