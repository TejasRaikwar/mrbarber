package com.mrbarber.repository;

import com.mrbarber.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    List<SocialLink> findAllByOrderByDisplayOrderAsc();
}
