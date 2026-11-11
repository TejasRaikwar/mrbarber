package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Single-row table holding global brand/site configuration.
 */
@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String siteName;

    private String siteTagline;

    /** Browser tab title. */
    private String pageTitle;

    /** URL of favicon image (uploaded). */
    private String faviconUrl;

    /** URL of main logo. */
    private String logoUrl;

    /** Footer description. */
    @Column(columnDefinition = "TEXT")
    private String footerDescription;

    /** Brand contact info shown in footer. */
    private String footerAddress;
    private String footerPhone;
    private String footerEmail;

    /** Bottom-bar copyright text. */
    private String copyrightText;

    /** Maximum number of reels allowed. */
    private Integer maxReels;

    /** Site-wide accent color (hex), admin-selectable from a preset palette. */
    @Builder.Default
    private String themeColor = "#eab308";

    /**
     * Id of the active palette, e.g. "beige" or "navy". Mirrors the registry in
     * src/lib/themes.js; the backend resolves it via ThemePalette when rendering
     * email so mail matches the site.
     */
    @Builder.Default
    private String themeId = "beige";

    // ─── Enquiry email templates (blank = built-in default) ───────────────
    // Placeholders supported in all four fields: {{customerName}}, {{brandName}},
    // {{email}}, {{phone}}, {{address}}.

    /** Subject of the confirmation email sent to the person who submitted the enquiry. */
    private String enquiryCustomerSubject;

    /** Intro message shown in that confirmation email, above the submitted-details block. */
    @Column(columnDefinition = "TEXT")
    private String enquiryCustomerMessage;

    /** Subject of the alert email sent to the salon/admin. */
    private String enquiryAdminSubject;

    /** Intro line shown under the heading in the admin alert email. */
    @Column(columnDefinition = "TEXT")
    private String enquiryAdminIntro;
}
