package com.mrbarber.repository;

import com.mrbarber.entity.NavLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NavLinkRepository extends JpaRepository<NavLink, Long> {
    List<NavLink> findAllByOrderByDisplayOrderAsc();
}
