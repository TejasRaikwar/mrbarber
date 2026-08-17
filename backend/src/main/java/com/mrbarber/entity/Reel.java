package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String videoUrl;

    @Column(nullable = false)
    private String publicId;

    @Column(nullable = false)
    private Integer orderIndex;
}
