package com.mrbarber.repository;

import com.mrbarber.entity.HairProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HairProfileRepository extends JpaRepository<HairProfile, Long> {
    List<HairProfile> findAllByOrderByDisplayOrderAsc();
}
