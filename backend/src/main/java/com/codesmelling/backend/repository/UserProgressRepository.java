package com.codesmelling.backend.repository;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.database.tables.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndQuizId(Long userId, Long quizId);
    List<UserProgress> findAllByUserId(Long userId);
    Optional<UserProgress> findByUserAndQuiz(AppUser user, Quiz quiz);
    List<UserProgress> findByUser(AppUser user);
    List<UserProgress> findByUserAndCompletedTrue(AppUser user);
}