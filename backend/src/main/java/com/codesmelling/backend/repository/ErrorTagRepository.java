package com.codesmelling.backend.repository;

import com.codesmelling.backend.database.tables.ErrorTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ErrorTagRepository extends JpaRepository<ErrorTag, Long> {
    List<ErrorTag> findByQuizId(Long quizId);
}