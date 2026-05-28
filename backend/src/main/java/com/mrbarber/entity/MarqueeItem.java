package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marquee_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarqueeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
