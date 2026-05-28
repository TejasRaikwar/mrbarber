package com.mrbarber.controller;

import com.mrbarber.entity.*;
import com.mrbarber.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Single bulk endpoint the frontend hits on load to render the entire site.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicSiteController {

    private final SiteSettingsRepository settingsRepo;
    private final HeroSlideRepository heroRepo;
    private final ServiceItemRepository serviceRepo;
    private final TransformationRepository transformationRepo;
    private final HairProfileRepository profileRepo;
    private final ReviewRepository reviewRepo;
    private final ContactLocationRepository locationRepo;
    private final MarqueeItemRepository marqueeRepo;
    private final SocialLinkRepository socialRepo;
    private final NavLinkRepository navRepo;

    @GetMapping("/site")
    public Map<String, Object> site() {
        Map<String, Object> body = new HashMap<>();
        body.put("settings", settingsRepo.findAll().stream().findFirst().orElse(null));
        body.put("navLinks", navRepo.findAllByOrderByDisplayOrderAsc());
        body.put("heroSlides", heroRepo.findAllByOrderByDisplayOrderAsc());
        body.put("marqueeItems", marqueeRepo.findAllByOrderByDisplayOrderAsc());
        body.put("services", serviceRepo.findAllByOrderByDisplayOrderAsc());
        body.put("transformations", transformationRepo.findAllByOrderByDisplayOrderAsc());
        body.put("hairProfiles", profileRepo.findAllByOrderByDisplayOrderAsc());
        body.put("reviews", reviewRepo.findAllByOrderByDisplayOrderAsc());
        body.put("locations", locationRepo.findAllByOrderByDisplayOrderAsc());
        body.put("socialLinks", socialRepo.findAllByOrderByDisplayOrderAsc());
        return body;
    }

    // Individual endpoints — useful for the admin UI to refresh a single section
    @GetMapping("/settings")
    public Object settings() { return settingsRepo.findAll().stream().findFirst().orElse(null); }

    @GetMapping("/nav-links")
    public List<NavLink> navLinks() { return navRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/hero-slides")
    public List<HeroSlide> heroSlides() { return heroRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/marquee")
    public List<MarqueeItem> marquee() { return marqueeRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/services")
    public List<ServiceItem> services() { return serviceRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/transformations")
    public List<Transformation> transformations() { return transformationRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/hair-profiles")
    public List<HairProfile> hairProfiles() { return profileRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/reviews")
    public List<Review> reviews() { return reviewRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/locations")
    public List<ContactLocation> locations() { return locationRepo.findAllByOrderByDisplayOrderAsc(); }

    @GetMapping("/social-links")
    public List<SocialLink> socials() { return socialRepo.findAllByOrderByDisplayOrderAsc(); }
}
