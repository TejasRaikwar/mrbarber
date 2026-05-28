package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transformations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String beforeImageUrl;

    @Column(nullable = false)
    private String afterImageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
