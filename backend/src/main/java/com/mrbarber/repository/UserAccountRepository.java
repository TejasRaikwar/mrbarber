package com.mrbarber.repository;

import com.mrbarber.entity.Role;
import com.mrbarber.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUsername(String username);
    boolean existsByUsername(String username);
    List<UserAccount> findAllByRole(Role role);

    @Query("SELECT COALESCE(SUM(u.salary), 0) FROM UserAccount u WHERE u.role = :role")
    BigDecimal sumSalaryByRole(@Param("role") Role role);
}
