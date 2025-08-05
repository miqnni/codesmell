package com.codesmelling.backend.repository;

import com.codesmelling.backend.database.tables.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findByQuizName(String quizName);
    List<Quiz> findByLanguagesContaining(String language);
    List<Quiz> findByQuizNameContainingIgnoreCase(String namePart);

    @Query("SELECT DISTINCT l FROM Quiz q JOIN q.languages l")
    List<String> findAllDistinctLanguages();
}