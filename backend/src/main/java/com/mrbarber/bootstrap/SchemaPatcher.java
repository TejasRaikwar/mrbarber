package com.mrbarber.bootstrap;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.DependsOn;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-shot legacy-schema fixups, run during bean initialization (BEFORE any
 * data is read or written).
 *
 * Why: Hibernate `ddl-auto: update` creates new tables/columns but never
 * modifies existing column definitions. When the Role enum gained STAFF
 * after the first deploy, the existing MySQL `users.role` column stayed
 * as `enum('ADMIN')` and refused new values. This patcher normalizes the
 * column type idempotently so subsequent inserts succeed.
 *
 * @DependsOn("entityManagerFactory") guarantees Hibernate has finished its
 * own schema work before this patch runs, so we're not racing it.
 */
@Slf4j
@Component
@DependsOn("entityManagerFactory")
@RequiredArgsConstructor
public class SchemaPatcher {

    private final JdbcTemplate jdbc;

    @PostConstruct
    public void patch() {
        log.info("SchemaPatcher: checking users.role column type…");
        normalizeUsersRoleColumn();
    }

    private void normalizeUsersRoleColumn() {
        String type;
        try {
            type = jdbc.queryForObject(
                "SELECT COLUMN_TYPE FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
                String.class
            );
        } catch (Exception e) {
            log.error("SchemaPatcher: could not read users.role column type", e);
            throw new IllegalStateException("SchemaPatcher failed to read users.role column type", e);
        }

        if (type == null) {
            log.info("SchemaPatcher: users.role column does not exist yet (fresh DB) — Hibernate will create it as VARCHAR(20). Skipping.");
            return;
        }

        log.info("SchemaPatcher: current users.role type = '{}'", type);

        if (type.toLowerCase().startsWith("varchar")) {
            log.info("SchemaPatcher: users.role is already VARCHAR — no patch needed.");
            return;
        }

        try {
            jdbc.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL");
            String after = jdbc.queryForObject(
                "SELECT COLUMN_TYPE FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
                String.class
            );
            log.info("SchemaPatcher: ALTER succeeded — users.role is now '{}'", after);
        } catch (Exception e) {
            log.error("SchemaPatcher: ALTER TABLE failed", e);
            throw new IllegalStateException("SchemaPatcher failed to ALTER users.role", e);
        }
    }
}
