package com.mrbarber.repository;

import com.mrbarber.entity.Transformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransformationRepository extends JpaRepository<Transformation, Long> {
    List<Transformation> findAllByOrderByDisplayOrderAsc();
}
