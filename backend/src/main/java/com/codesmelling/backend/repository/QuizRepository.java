package com.codesmelling.backend.repository;

import com.codesmelling.backend.database.tables.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByQuizName(String quizName);
    List<Quiz> findByLanguagesContaining(String language);
    List<Quiz> findByQuizNameContainingIgnoreCase(String namePart);
}