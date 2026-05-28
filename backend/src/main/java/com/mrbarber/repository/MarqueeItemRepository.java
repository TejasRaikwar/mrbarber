package com.mrbarber.repository;

import com.mrbarber.entity.MarqueeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarqueeItemRepository extends JpaRepository<MarqueeItem, Long> {
    List<MarqueeItem> findAllByOrderByDisplayOrderAsc();
}
