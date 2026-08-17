package com.mrbarber.repository;

import com.mrbarber.entity.Reel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReelRepository extends JpaRepository<Reel, Long> {
    List<Reel> findAllByOrderByOrderIndexAsc();
}
