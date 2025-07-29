package com.codesmelling.backend.repository;

import com.codesmelling.backend.database.tables.GlobalTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GlobalTagRepository extends JpaRepository<GlobalTag, Long> {
    Optional<GlobalTag> findByCode(String code);
}