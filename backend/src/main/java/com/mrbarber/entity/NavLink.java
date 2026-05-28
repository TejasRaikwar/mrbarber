package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nav_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NavLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String label;

    /** Section id to scroll to on home (empty = top). */
    @Column(nullable = false)
    private String hash;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
