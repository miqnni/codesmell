package com.codesmelling.backend.repository;

import com.codesmelling.backend.database.tables.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // np. wyszukiwanie quizu po katalogu
    Quiz findByDirectoryPath(String directoryPath);
}