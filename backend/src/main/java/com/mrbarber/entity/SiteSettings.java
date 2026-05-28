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
}
