package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Name of the Lucide icon to render (e.g. "Layers", "Scissors"). */
    @Column(nullable = false)
    private String iconName;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
