package com.mrbarber.repository;

import com.mrbarber.entity.ContactLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactLocationRepository extends JpaRepository<ContactLocation, Long> {
    List<ContactLocation> findAllByOrderByDisplayOrderAsc();
}
