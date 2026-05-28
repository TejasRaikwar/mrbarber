package com.mrbarber.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String authorName;

    private String location;

    /** 1–5 */
    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String quote;

    /** Two-letter avatar initials, e.g. "RM". */
    private String initials;

    /** Optional avatar image. If set, takes precedence over initials. */
    private String avatarUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
