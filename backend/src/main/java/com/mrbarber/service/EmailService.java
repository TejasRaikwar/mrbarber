package com.mrbarber.service;

import com.mrbarber.entity.Enquiry;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name:Mr. Barber}")
    private String fromName;

    @Value("${app.mail.admin-email:${spring.mail.username}}")
    private String adminEmail;

    /**
     * Sends a clean acknowledgment/thank-you confirmation email to the customer.
     */
    @Async
    public void sendEnquiryConfirmationToCustomer(Enquiry enquiry) {
        if (enquiry == null || enquiry.getEmail() == null || enquiry.getEmail().trim().isEmpty()) {
            log.warn("Skipping email notification: enquiry or email is missing");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(enquiry.getEmail().trim());
            helper.setSubject("Thank you for contacting Mr. Barber!");

            String customerName = (enquiry.getName() != null && !enquiry.getName().isBlank())
                    ? enquiry.getName().trim()
                    : "Valued Customer";

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
                    <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0a09; padding: 40px 15px;">
                        <tr>
                            <td align="center">
                                <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #18181b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.6);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 32px 36px; background: linear-gradient(135deg, #1c1917 0%%, #292524 100%%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                                            <h1 style="margin: 0; font-size: 26px; color: #eab308; letter-spacing: 2px; font-weight: 800; text-transform: uppercase;">MR. BARBER</h1>
                                            <p style="margin: 6px 0 0 0; color: #a8a29e; font-size: 13px; letter-spacing: 0.5px;">Premium Grooming &amp; Salon Experience</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 36px;">
                                            <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 20px; font-weight: 600;">Hello %s,</h2>
                                            <p style="margin: 0 0 16px 0; color: #d6d3d1; font-size: 15px; line-height: 1.6;">
                                                Thank you for reaching out to us! We have successfully received your enquiry, and our team will get in touch with you shortly.
                                            </p>
                                            <p style="margin: 0 0 16px 0; color: #a8a29e; font-size: 14px; line-height: 1.6;">
                                                If you have any urgent requests or would like to schedule an immediate appointment, please feel free to call our salon directly.
                                            </p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 24px 36px; background-color: #121214; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                                            <p style="margin: 0 0 4px 0; color: #71717a; font-size: 13px;">Warm regards,</p>
                                            <p style="margin: 0; color: #eab308; font-size: 14px; font-weight: 700;">The Mr. Barber Team</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(customerName);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Enquiry confirmation email sent successfully to customer: {}", enquiry.getEmail());
        } catch (Exception e) {
            log.error("Failed to send customer confirmation email to: {}", enquiry.getEmail(), e);
        }
    }

    /**
     * Sends an email to the owner/admin containing the customer's submitted details.
     */
    @Async
    public void sendEnquiryNotificationToAdmin(Enquiry enquiry) {
        if (enquiry == null) return;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(adminEmail);
            String customerName = (enquiry.getName() != null && !enquiry.getName().isBlank())
                    ? enquiry.getName().trim()
                    : "New Customer";
            helper.setSubject("🔔 New Customer Enquiry: " + customerName);

            String formattedDate = enquiry.getSubmittedAt() != null
                    ? enquiry.getSubmittedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
                    : "Just now";

            String phone = (enquiry.getPhone() != null && !enquiry.getPhone().isBlank())
                    ? enquiry.getPhone().trim()
                    : "N/A";

            String address = (enquiry.getAddress() != null && !enquiry.getAddress().isBlank())
                    ? enquiry.getAddress().trim()
                    : "Not provided";

            String email = (enquiry.getEmail() != null && !enquiry.getEmail().isBlank())
                    ? enquiry.getEmail().trim()
                    : "Not provided";

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
                    <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0a09; padding: 40px 15px;">
                        <tr>
                            <td align="center">
                                <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #18181b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.6);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 32px 36px; background: linear-gradient(135deg, #1c1917 0%%, #292524 100%%); border-bottom: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
                                            <h1 style="margin: 0; font-size: 24px; color: #eab308; letter-spacing: 1.5px; font-weight: 800; text-transform: uppercase;">NEW ENQUIRY ALERT</h1>
                                            <p style="margin: 6px 0 0 0; color: #a8a29e; font-size: 13px;">A new customer enquiry was submitted on the website</p>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 36px;">
                                            <div style="background-color: #27272a; border-radius: 12px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.08);">
                                                <p style="margin: 0 0 16px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #eab308; font-weight: 700;">YOUR SUBMITTED DETAILS</p>
                                                <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px; border-collapse: collapse;">
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #a1a1aa; width: 30%%; vertical-align: top;">Name:</td>
                                                        <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">%s</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #a1a1aa; vertical-align: top;">Email:</td>
                                                        <td style="padding: 8px 0;"><a href="mailto:%s" style="color: #38bdf8; text-decoration: underline; font-weight: 500;">%s</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #a1a1aa; vertical-align: top;">Mobile:</td>
                                                        <td style="padding: 8px 0;"><a href="tel:%s" style="color: #eab308; text-decoration: none; font-weight: 500;">%s</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #a1a1aa; vertical-align: top;">Address:</td>
                                                        <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">%s</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0; color: #a1a1aa; vertical-align: top;">Time:</td>
                                                        <td style="padding: 8px 0; color: #d4d4d8; font-size: 13px;">%s</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 20px 36px; background-color: #121214; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
                                            <p style="margin: 0; color: #71717a; font-size: 12px;">Mr. Barber Automated Notification System</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(
                    customerName,
                    email, email,
                    phone, phone,
                    address,
                    formattedDate
                );

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Enquiry notification email sent to owner ({}) for customer: {}", adminEmail, customerName);
        } catch (Exception e) {
            log.error("Failed to send admin notification email to: {}", adminEmail, e);
        }
    }
}
