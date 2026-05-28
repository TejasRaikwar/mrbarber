package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hero_slides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HeroSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subtitle;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private String primaryCtaLabel;
    private String primaryCtaHref;
    private String secondaryCtaLabel;
    private String secondaryCtaHref;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
