package com.mrbarber.service;

import com.mrbarber.entity.Enquiry;
import com.mrbarber.entity.SiteSettings;
import com.mrbarber.mail.ThemePalette;
import com.mrbarber.repository.SiteSettingsRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Transactional email.
 *
 * <p>Templates are branded per customer: the salon's name, tagline and contact
 * details come from {@link SiteSettings}, and the colours come from the same
 * theme the site is running ({@link ThemePalette}), so mail never looks like it
 * belongs to a different business.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SiteSettingsRepository settingsRepo;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name:Mr. Barber}")
    private String fromName;

    @Value("${app.mail.admin-email:${spring.mail.username}}")
    private String adminEmail;

    private static final DateTimeFormatter STAMP =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    // ── Public API ──────────────────────────────────────────────────────────

    /** Acknowledgement sent to the customer who submitted the enquiry. */
    @Async
    public void sendEnquiryConfirmationToCustomer(Enquiry enquiry) {
        if (enquiry == null || isBlank(enquiry.getEmail())) {
            log.warn("Skipping email notification: enquiry or email is missing");
            return;
        }

        SiteSettings settings = loadSettings();
        String brand = brandName(settings);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, brand);
            helper.setTo(enquiry.getEmail().trim());
            helper.setSubject("Thank you for contacting " + brand + "!");
            helper.setText(customerHtml(settings, enquiry), true);

            mailSender.send(message);
            log.info("Enquiry confirmation email sent successfully to customer: {}", enquiry.getEmail());
        } catch (Exception e) {
            log.error("Failed to send customer confirmation email to: {}", enquiry.getEmail(), e);
        }
    }

    /** Alert sent to the salon owner with the submitted details. */
    @Async
    public void sendEnquiryNotificationToAdmin(Enquiry enquiry) {
        if (enquiry == null) return;

        SiteSettings settings = loadSettings();
        String brand = brandName(settings);
        String customerName = valueOr(enquiry.getName(), "New Customer");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, brand);
            helper.setTo(adminEmail);
            helper.setSubject("🔔 New Customer Enquiry: " + customerName);
            helper.setText(adminHtml(settings, enquiry), true);

            mailSender.send(message);
            log.info("Enquiry notification email sent to owner ({}) for customer: {}",
                    adminEmail, customerName);
        } catch (Exception e) {
            log.error("Failed to send admin notification email to: {}", adminEmail, e);
        }
    }

    // ── Templates ───────────────────────────────────────────────────────────

    private String customerHtml(SiteSettings settings, Enquiry enquiry) {
        ThemePalette p = paletteFor(settings);
        Map<String, String> v = baseVars(settings, p);

        v.put("customerName", esc(valueOr(enquiry.getName(), "Valued Customer")));
        v.put("contactBlock", contactBlock(settings, p));

        return render("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:{{pageBg}}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:{{text}};">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:{{pageBg}}; padding:40px 15px;">
                    <tr>
                        <td align="center">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:{{surface}}; border:1px solid {{border}}; border-radius:16px; overflow:hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="padding:32px 36px; background-color:{{surfaceAlt}}; border-bottom:1px solid {{border}}; text-align:center;">
                                        {{logoBlock}}
                                        <h1 style="margin:0; font-size:26px; color:{{accent}}; letter-spacing:2px; font-weight:800; text-transform:uppercase;">{{brandName}}</h1>
                                        {{taglineBlock}}
                                    </td>
                                </tr>
                                <!-- Body -->
                                <tr>
                                    <td style="padding:36px;">
                                        <h2 style="margin:0 0 16px 0; color:{{heading}}; font-size:20px; font-weight:600;">Hello {{customerName}},</h2>
                                        <p style="margin:0 0 16px 0; color:{{text}}; font-size:15px; line-height:1.6;">
                                            Thank you for reaching out to us! We have successfully received your enquiry, and our team will get in touch with you shortly.
                                        </p>
                                        <p style="margin:0 0 16px 0; color:{{muted}}; font-size:14px; line-height:1.6;">
                                            If you have any urgent requests or would like to schedule an immediate appointment, please feel free to call our salon directly.
                                        </p>
                                        {{contactBlock}}
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding:24px 36px; background-color:{{surfaceAlt}}; border-top:1px solid {{border}}; text-align:center;">
                                        <p style="margin:0 0 4px 0; color:{{muted}}; font-size:13px;">Warm regards,</p>
                                        <p style="margin:0; color:{{accent}}; font-size:14px; font-weight:700;">The {{brandName}} Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """, v);
    }

    private String adminHtml(SiteSettings settings, Enquiry enquiry) {
        ThemePalette p = paletteFor(settings);
        Map<String, String> v = baseVars(settings, p);

        String email = valueOr(enquiry.getEmail(), "Not provided");
        String phone = valueOr(enquiry.getPhone(), "N/A");

        v.put("customerName", esc(valueOr(enquiry.getName(), "New Customer")));
        v.put("email", esc(email));
        v.put("phone", esc(phone));
        v.put("address", esc(valueOr(enquiry.getAddress(), "Not provided")));
        v.put("submittedAt", esc(enquiry.getSubmittedAt() != null
                ? enquiry.getSubmittedAt().format(STAMP)
                : "Just now"));

        return render("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:{{pageBg}}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:{{text}};">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:{{pageBg}}; padding:40px 15px;">
                    <tr>
                        <td align="center">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px; background-color:{{surface}}; border:1px solid {{border}}; border-radius:16px; overflow:hidden;">
                                <!-- Header -->
                                <tr>
                                    <td style="padding:32px 36px; background-color:{{surfaceAlt}}; border-bottom:1px solid {{border}}; text-align:center;">
                                        <h1 style="margin:0; font-size:24px; color:{{accent}}; letter-spacing:1.5px; font-weight:800; text-transform:uppercase;">New Enquiry Alert</h1>
                                        <p style="margin:6px 0 0 0; color:{{muted}}; font-size:13px;">A new customer enquiry was submitted on {{brandName}}</p>
                                    </td>
                                </tr>
                                <!-- Body -->
                                <tr>
                                    <td style="padding:36px;">
                                        <div style="background-color:{{surfaceAlt}}; border-radius:12px; padding:24px; border:1px solid {{border}};">
                                            <p style="margin:0 0 16px 0; font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:{{accent}}; font-weight:700;">Submitted details</p>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:14px; border-collapse:collapse;">
                                                <tr>
                                                    <td style="padding:8px 0; color:{{muted}}; width:30%; vertical-align:top;">Name:</td>
                                                    <td style="padding:8px 0; color:{{heading}}; font-weight:600;">{{customerName}}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:8px 0; color:{{muted}}; vertical-align:top;">Email:</td>
                                                    <td style="padding:8px 0;"><a href="mailto:{{email}}" style="color:{{accent}}; text-decoration:underline; font-weight:500;">{{email}}</a></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:8px 0; color:{{muted}}; vertical-align:top;">Mobile:</td>
                                                    <td style="padding:8px 0;"><a href="tel:{{phone}}" style="color:{{accent}}; text-decoration:none; font-weight:500;">{{phone}}</a></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:8px 0; color:{{muted}}; vertical-align:top;">Address:</td>
                                                    <td style="padding:8px 0; color:{{heading}}; font-weight:500;">{{address}}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:8px 0; color:{{muted}}; vertical-align:top;">Time:</td>
                                                    <td style="padding:8px 0; color:{{text}}; font-size:13px;">{{submittedAt}}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="padding:20px 36px; background-color:{{surfaceAlt}}; border-top:1px solid {{border}}; text-align:center;">
                                        <p style="margin:0; color:{{muted}}; font-size:12px;">{{brandName}} · automated notification</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """, v);
    }

    /** Optional "reach us at" panel, rendered only when contact details exist. */
    private String contactBlock(SiteSettings settings, ThemePalette p) {
        if (settings == null) return "";

        StringBuilder rows = new StringBuilder();
        appendContactRow(rows, p, "Phone", settings.getFooterPhone());
        appendContactRow(rows, p, "Email", settings.getFooterEmail());
        appendContactRow(rows, p, "Visit", settings.getFooterAddress());

        if (rows.length() == 0) return "";

        return """
            <div style="margin-top:24px; padding:18px 20px; background-color:%s; border:1px solid %s; border-radius:12px;">
                <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="font-size:14px;">%s</table>
            </div>
            """.formatted(p.surfaceAlt(), p.border(), rows);
    }

    private void appendContactRow(StringBuilder sb, ThemePalette p, String label, String value) {
        if (isBlank(value)) return;
        sb.append("""
            <tr>
                <td style="padding:5px 0; color:%s; width:70px; vertical-align:top;">%s</td>
                <td style="padding:5px 0; color:%s; font-weight:500;">%s</td>
            </tr>
            """.formatted(p.muted(), label, p.text(), esc(value.trim())));
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private Map<String, String> baseVars(SiteSettings settings, ThemePalette p) {
        Map<String, String> v = new HashMap<>();
        v.put("pageBg", p.pageBg());
        v.put("surface", p.surface());
        v.put("surfaceAlt", p.surfaceAlt());
        v.put("border", p.border());
        v.put("heading", p.heading());
        v.put("text", p.text());
        v.put("muted", p.muted());
        v.put("accent", p.accent());
        v.put("onAccent", p.onAccent());
        v.put("brandName", esc(brandName(settings)));

        String tagline = settings != null ? settings.getSiteTagline() : null;
        v.put("taglineBlock", isBlank(tagline) ? "" :
                "<p style=\"margin:6px 0 0 0; color:%s; font-size:13px; letter-spacing:0.5px;\">%s</p>"
                        .formatted(p.muted(), esc(tagline.trim())));

        String logoUrl = settings != null ? settings.getLogoUrl() : null;
        v.put("logoBlock", isBlank(logoUrl) || !logoUrl.startsWith("http") ? "" :
                "<img src=\"%s\" alt=\"%s\" width=\"120\" style=\"max-width:120px; height:auto; margin:0 auto 14px auto; display:block;\">"
                        .formatted(esc(logoUrl.trim()), esc(brandName(settings))));

        return v;
    }

    private ThemePalette paletteFor(SiteSettings settings) {
        if (settings == null) return ThemePalette.of(ThemePalette.DEFAULT_ID);
        return ThemePalette.resolve(settings.getThemeId(), settings.getThemeColor());
    }

    private SiteSettings loadSettings() {
        try {
            return settingsRepo.findAll().stream().findFirst().orElse(null);
        } catch (Exception e) {
            log.warn("Could not load site settings for email branding; using defaults", e);
            return null;
        }
    }

    private String brandName(SiteSettings settings) {
        if (settings != null && !isBlank(settings.getSiteName())) {
            return settings.getSiteName().trim();
        }
        return fromName;
    }

    /** Replace {{token}} placeholders. Values must already be escaped. */
    private static String render(String template, Map<String, String> vars) {
        String out = template;
        for (Map.Entry<String, String> e : vars.entrySet()) {
            out = out.replace("{{" + e.getKey() + "}}", e.getValue() == null ? "" : e.getValue());
        }
        return out;
    }

    /** Enquiry fields are customer-supplied, so they never reach the HTML raw. */
    private static String esc(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String valueOr(String value, String fallback) {
        return isBlank(value) ? fallback : value.trim();
    }
}
