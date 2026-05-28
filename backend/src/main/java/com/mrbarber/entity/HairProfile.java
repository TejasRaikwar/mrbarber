package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hair_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HairProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String beforeImageUrl;

    @Column(nullable = false)
    private String afterImageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
