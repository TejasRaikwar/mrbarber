package com.mrbarber.service;

import com.mrbarber.config.AppProperties;
import com.mrbarber.dto.AuthDtos.AuthResponse;
import com.mrbarber.dto.AuthDtos.ChangePasswordRequest;
import com.mrbarber.dto.AuthDtos.LoginChallengeResponse;
import com.mrbarber.dto.AuthDtos.LoginRequest;
import com.mrbarber.dto.AuthDtos.OtpVerifyRequest;
import com.mrbarber.entity.Role;
import com.mrbarber.entity.UserAccount;
import com.mrbarber.repository.UserAccountRepository;
import com.mrbarber.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Login is two-step: credentials first, then a one-time code emailed to the
 * account holder (or the salon's admin inbox, for the ADMIN account and for
 * staff with no email on file) before a JWT is issued.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long OTP_VALID_MINUTES = 5;
    private static final long RESEND_COOLDOWN_SECONDS = 30;

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserAccountRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppProperties props;
    private final EmailService emailService;

    public LoginChallengeResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );
        UserAccount user = userRepo.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        String targetEmail = otpDestination(user);

        // A second call within the cooldown (double-click, a slow-to-disable submit
        // button, a browser retry) reuses the code already in flight instead of
        // emailing a fresh one — the customer-visible symptom of not having this
        // was literally "it emails the code twice".
        if (wasJustIssued(user)) {
            return new LoginChallengeResponse(true, mask(targetEmail), false);
        }

        String otp = generateOtp();

        // Send first: if delivery fails, nothing is persisted and the attempt can be retried cleanly.
        emailService.sendLoginOtp(targetEmail, otp);

        user.setOtpCode(passwordEncoder.encode(otp));
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(OTP_VALID_MINUTES));
        userRepo.save(user);

        return new LoginChallengeResponse(true, mask(targetEmail), true);
    }

    private boolean wasJustIssued(UserAccount user) {
        if (user.getOtpCode() == null || user.getOtpExpiresAt() == null) return false;
        LocalDateTime now = LocalDateTime.now();
        if (user.getOtpExpiresAt().isBefore(now)) return false; // already expired, not a duplicate
        LocalDateTime issuedAt = user.getOtpExpiresAt().minusMinutes(OTP_VALID_MINUTES);
        return issuedAt.isAfter(now.minusSeconds(RESEND_COOLDOWN_SECONDS));
    }

    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest req) {
        UserAccount user = userRepo.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("Invalid verification code"));

        if (user.getOtpCode() == null || user.getOtpExpiresAt() == null
                || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadCredentialsException("Code expired — please sign in again");
        }
        if (!passwordEncoder.matches(req.otp().trim(), user.getOtpCode())) {
            // Most common cause: a newer code was requested since (e.g. Resend) and
            // silently superseded this one, so point the user at that instead of
            // leaving them re-typing the same wrong code from an older email.
            throw new BadCredentialsException("That code doesn't match — if you requested a new one, use the latest email instead");
        }

        user.setOtpCode(null);
        user.setOtpExpiresAt(null);
        userRepo.save(user);

        UserDetails details = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(details);
        String role = details.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("ADMIN");
        return new AuthResponse(token, details.getUsername(), role, props.getJwt().getExpirationMs());
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest req) {
        UserAccount user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        if (!passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepo.save(user);
    }

    /** ADMIN always gets the code on the salon's admin inbox; staff get their own email, falling back to admin. */
    private String otpDestination(UserAccount user) {
        if (user.getRole() == Role.ADMIN) {
            return props.getMail().getAdminEmail();
        }
        return isBlank(user.getEmail()) ? props.getMail().getAdminEmail() : user.getEmail();
    }

    private static String generateOtp() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    private static String mask(String email) {
        if (email == null || !email.contains("@")) return "your registered email";
        int at = email.indexOf('@');
        String name = email.substring(0, at);
        String visible = name.length() <= 2 ? name.substring(0, 1) : name.substring(0, 2);
        return visible + "***@" + email.substring(at + 1);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
