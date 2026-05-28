package com.mrbarber.bootstrap;

import com.mrbarber.config.AppProperties;
import com.mrbarber.entity.*;
import com.mrbarber.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds initial admin user + default site content matching the original
 * hardcoded frontend, so the site renders correctly on first boot.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserAccountRepository userRepo;
    private final SiteSettingsRepository settingsRepo;
    private final NavLinkRepository navRepo;
    private final HeroSlideRepository heroRepo;
    private final MarqueeItemRepository marqueeRepo;
    private final ServiceItemRepository serviceRepo;
    private final TransformationRepository transformationRepo;
    private final HairProfileRepository profileRepo;
    private final ReviewRepository reviewRepo;
    private final ContactLocationRepository locationRepo;
    private final SocialLinkRepository socialRepo;

    private final PasswordEncoder passwordEncoder;
    private final AppProperties props;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedSettings();
        seedNavLinks();
        seedHeroSlides();
        seedMarquee();
        seedServices();
        seedTransformations();
        seedHairProfiles();
        seedReviews();
        seedLocations();
        seedSocialLinks();
    }

    private void seedAdmin() {
        String username = props.getSeed().getAdminUsername();
        if (userRepo.existsByUsername(username)) return;
        UserAccount admin = UserAccount.builder()
                .username(username)
                .password(passwordEncoder.encode(props.getSeed().getAdminPassword()))
                .role(Role.ADMIN)
                .build();
        userRepo.save(admin);
        log.info("Seeded admin user '{}'", username);
    }

    private void seedSettings() {
        if (settingsRepo.count() > 0) return;
        settingsRepo.save(SiteSettings.builder()
                .siteName("MR BARBER")
                .siteTagline("Luxury Barber Studio")
                .pageTitle("Mr Barber — Premium Hair Studio")
                .footerDescription("Premium hair systems and expert styling — crafted with precision, designed around you.")
                .footerAddress("A-2/40, Shop No. 15, Main Market, Rajouri Garden, New Delhi — 110027")
                .footerPhone("+91 8700797103")
                .footerEmail("hello@mrbarber.com")
                .copyrightText("© Mr Barber. All rights reserved.")
                .build());
    }

    private void seedNavLinks() {
        if (navRepo.count() > 0) return;
        navRepo.saveAll(List.of(
                NavLink.builder().label("Home").hash("").displayOrder(0).build(),
                NavLink.builder().label("Services").hash("services").displayOrder(1).build(),
                NavLink.builder().label("Transformations").hash("transformations").displayOrder(2).build(),
                NavLink.builder().label("Profiles").hash("profiles").displayOrder(3).build(),
                NavLink.builder().label("Reviews").hash("reviews").displayOrder(4).build(),
                NavLink.builder().label("Contact").hash("contact").displayOrder(5).build()
        ));
    }

    private void seedHeroSlides() {
        if (heroRepo.count() > 0) return;
        heroRepo.saveAll(List.of(
                HeroSlide.builder()
                        .subtitle("LUXURY BARBER STUDIO")
                        .title("Premium Barber Experience")
                        .description("Sharp fades, luxury grooming, and classic barber artistry.")
                        .primaryCtaLabel("Book Appointment")
                        .primaryCtaHref("#contact")
                        .secondaryCtaLabel("Explore Services")
                        .secondaryCtaHref("#services")
                        .displayOrder(0).build()
        ));
    }

    private void seedMarquee() {
        if (marqueeRepo.count() > 0) return;
        List<String> items = List.of(
                "Premium Hair Systems",
                "Expert Styling",
                "Natural Results",
                "Crafted For You",
                "Trusted by 500+ Clients",
                "Delhi's Finest Studio"
        );
        for (int i = 0; i < items.size(); i++) {
            marqueeRepo.save(MarqueeItem.builder()
                    .text(items.get(i)).displayOrder(i).build());
        }
    }

    private void seedServices() {
        if (serviceRepo.count() > 0) return;
        record S(String title, String desc, String icon) {}
        List<S> items = List.of(
                new S("Hair Patch", "Custom-crafted hair patches that blend seamlessly with your natural hair for an undetectable finish.", "Layers"),
                new S("Hair Replacement", "Non-surgical hair replacement systems tailored to your scalp, lifestyle, and aesthetic goals.", "Repeat"),
                new S("Hair Fixing", "Secure, long-lasting hair fixing using premium-grade adhesives and professional techniques.", "Wrench"),
                new S("Hair Bonding", "Strong, breathable bonding that holds through workouts, weather, and daily wear.", "Link"),
                new S("Hair Extension", "Add length and volume with premium extensions matched to your texture and tone.", "Maximize2"),
                new S("Hair Styling", "Precision cuts and styling from expert barbers — sharp finishes that suit your face.", "Scissors"),
                new S("Hair Color", "Salon-grade colour treatments, from subtle greys coverage to bold statement tones.", "Palette")
        );
        for (int i = 0; i < items.size(); i++) {
            S s = items.get(i);
            serviceRepo.save(ServiceItem.builder()
                    .title(s.title()).description(s.desc()).iconName(s.icon())
                    .displayOrder(i).build());
        }
    }

    private void seedTransformations() {
        if (transformationRepo.count() > 0) return;
        transformationRepo.saveAll(List.of(
                Transformation.builder()
                        .title("Classic Patch Restoration")
                        .beforeImageUrl("/uploads/seed/before-1.jpg")
                        .afterImageUrl("/uploads/seed/after-1.jpg")
                        .displayOrder(0).build(),
                Transformation.builder()
                        .title("Premium Hair Replacement")
                        .beforeImageUrl("/uploads/seed/before-2.jpg")
                        .afterImageUrl("/uploads/seed/after-2.jpg")
                        .displayOrder(1).build()
        ));
    }

    private void seedHairProfiles() {
        if (profileRepo.count() > 0) return;
        profileRepo.saveAll(List.of(
                HairProfile.builder()
                        .title("Crown Area Coverage")
                        .description("Seamless density restoration for thinning crown")
                        .beforeImageUrl("/uploads/seed/profile-before-1.jpg")
                        .afterImageUrl("/uploads/seed/profile-after-1.jpg")
                        .displayOrder(0).build(),
                HairProfile.builder()
                        .title("Frontal Hairline Definition")
                        .description("Natural-looking front hairline rebuild")
                        .beforeImageUrl("/uploads/seed/profile-before-2.jpg")
                        .afterImageUrl("/uploads/seed/profile-after-2.jpg")
                        .displayOrder(1).build(),
                HairProfile.builder()
                        .title("Temple Area Blend")
                        .description("Precision fill for receding temples")
                        .beforeImageUrl("/uploads/seed/profile-before-3.jpg")
                        .afterImageUrl("/uploads/seed/profile-after-3.jpg")
                        .displayOrder(2).build()
        ));
    }

    private void seedReviews() {
        if (reviewRepo.count() > 0) return;
        record R(String name, String loc, int rating, String quote, String initials) {}
        List<R> items = List.of(
                new R("Rohan Mehta", "Mumbai", 5, "Honestly the most natural-looking result I've seen. My hairline blends so well no one can tell. Worth every rupee.", "RM"),
                new R("Arjun Khanna", "Delhi", 5, "The crown coverage is unreal. Took 5 minutes to apply before a wedding and my confidence was through the roof all night.", "AK"),
                new R("Vikram Singh", "Bengaluru", 5, "Tried three other brands before this — none compare. Holds up through workouts, humidity, even a light drizzle.", "VS"),
                new R("Sameer Kapoor", "Pune", 5, "Quick, mess-free, and the colour match is spot on. My barber recommended it and I'm now a customer for life.", "SK"),
                new R("Aditya Verma", "Hyderabad", 4, "Solid product. Took me a couple tries to get the application right, but once I did — game changer for my temples.", "AV"),
                new R("Karan Malhotra", "Chandigarh", 5, "Felt 10 years younger after the first use. The fibres genuinely lock in and don't smudge on my collar.", "KM")
        );
        for (int i = 0; i < items.size(); i++) {
            R r = items.get(i);
            reviewRepo.save(Review.builder()
                    .authorName(r.name()).location(r.loc()).rating(r.rating())
                    .quote(r.quote()).initials(r.initials())
                    .displayOrder(i).build());
        }
    }

    private void seedLocations() {
        if (locationRepo.count() > 0) return;
        ContactLocation delhi = ContactLocation.builder()
                .city("Delhi")
                .imageUrl("/uploads/seed/studio-delhi.jpg")
                .address("A-2/40, Shop No. 15,\nMain Market, Rajouri Garden,\nNew Delhi — 110027")
                .whatsapp("918700797103")
                .displayOrder(0).build();

        LocationContact c1 = LocationContact.builder()
                .label("Home Trial").phone("+91 8700797103").location(delhi).build();
        LocationContact c2 = LocationContact.builder()
                .label("Experience Center").phone("+91 9599299215").location(delhi).build();
        delhi.getContacts().add(c1);
        delhi.getContacts().add(c2);

        locationRepo.save(delhi);
    }

    private void seedSocialLinks() {
        if (socialRepo.count() > 0) return;
        socialRepo.saveAll(List.of(
                SocialLink.builder().platform("Instagram").url("https://instagram.com").displayOrder(0).build(),
                SocialLink.builder().platform("Facebook").url("https://facebook.com").displayOrder(1).build(),
                SocialLink.builder().platform("Youtube").url("https://youtube.com").displayOrder(2).build()
        ));
    }
}
