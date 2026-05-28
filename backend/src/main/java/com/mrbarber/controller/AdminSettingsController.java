package com.mrbarber.controller;

import com.mrbarber.entity.SiteSettings;
import com.mrbarber.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final SiteSettingsRepository repo;

    @GetMapping
    public SiteSettings get() {
        return repo.findAll().stream().findFirst().orElseGet(() -> {
            SiteSettings s = SiteSettings.builder().siteName("Mr Barber").build();
            return repo.save(s);
        });
    }

    @PutMapping
    public SiteSettings update(@RequestBody SiteSettings body) {
        SiteSettings existing = get();
        existing.setSiteName(body.getSiteName());
        existing.setSiteTagline(body.getSiteTagline());
        existing.setPageTitle(body.getPageTitle());
        existing.setFaviconUrl(body.getFaviconUrl());
        existing.setLogoUrl(body.getLogoUrl());
        existing.setFooterDescription(body.getFooterDescription());
        existing.setFooterAddress(body.getFooterAddress());
        existing.setFooterPhone(body.getFooterPhone());
        existing.setFooterEmail(body.getFooterEmail());
        existing.setCopyrightText(body.getCopyrightText());
        return repo.save(existing);
    }
}
