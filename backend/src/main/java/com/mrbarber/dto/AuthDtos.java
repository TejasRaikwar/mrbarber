package com.mrbarber.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {}

    /**
     * Returned after credentials check out and a one-time code must be verified next.
     * {@code emailSent} is false when a still-fresh code from a moment ago was reused
     * instead of mailing a new one (guards against double-click / duplicate submits).
     */
    public record LoginChallengeResponse(
            boolean otpRequired,
            String maskedEmail,
            boolean emailSent
    ) {}

    public record OtpVerifyRequest(
            @NotBlank String username,
            @NotBlank String otp
    ) {}

    public record AuthResponse(
            String token,
            String username,
            String role,
            long expiresInMs
    ) {}

    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String newPassword
    ) {}

    public record UserInfo(String username, String role) {}
}
