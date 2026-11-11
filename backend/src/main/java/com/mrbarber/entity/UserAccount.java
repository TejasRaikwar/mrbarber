package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    /** Human-readable full name shown in the UI (optional, falls back to username). */
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private Role role;

    // ─── Staff profile fields (nullable; only populated for STAFF) ────────
    private String phone;
    private String alternatePhone;
    private String email;
    private LocalDate dob;
    private String identityProofUrl;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(precision = 10, scale = 2)
    private BigDecimal salary;

    // ─── Login OTP (short-lived, cleared after use or expiry) ─────────────
    /** BCrypt hash of the current one-time login code; null when none pending. */
    private String otpCode;
    private LocalDateTime otpExpiresAt;
}
