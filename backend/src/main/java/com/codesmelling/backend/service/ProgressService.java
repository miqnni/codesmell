package com.codesmelling.backend.service;

import com.codesmelling.backend.config.CsvFileConfigLoader;
import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.database.tables.UserProgress;
import com.codesmelling.backend.dto.Progress.UserProgressDto;
import com.codesmelling.backend.dto.Progress.UserProgressSummaryDto;
import com.codesmelling.backend.dto.csv.UserProgressCsvDto;
import com.codesmelling.backend.repository.AppUserRepository;
import com.codesmelling.backend.repository.QuizRepository;
import com.codesmelling.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserProgressRepository progressRepository;
    private final AppUserRepository userRepository;
    private final QuizRepository quizRepository;
    private final CsvParserService parser;
    private final CsvFileConfigLoader loader;


    public List<UserProgressDto> getProgressForUser(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<UserProgress> progressList = progressRepository.findByUser(user);

        return progressList.stream()
                .map(p -> UserProgressDto.builder()
                        .quizId(p.getQuiz().getId())
                        .quizName(p.getQuiz().getQuizName())// jeśli masz `getName()`
                        .scorePercent(p.getScorePercent())
                        .completed(p.isCompleted())
                        .build())
                .collect(Collectors.toList());
    }

    public UserProgressSummaryDto getUserProgressSummary(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<UserProgress> completed = progressRepository.findByUserAndCompletedTrue(user);
        long totalQuizzes = quizRepository.count();

        return new UserProgressSummaryDto(completed.size(), (int) totalQuizzes);
    }


    public void importProgress() throws IOException {
        InputStream in = loader.load("Progress.csv");
        List<UserProgressCsvDto> dtos = parser.parse(UserProgressCsvDto.class, in);

        for (UserProgressCsvDto dto : dtos) {
            AppUser user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));
            Quiz quiz = quizRepository.findById(dto.getQuizId())
                    .orElseThrow(() -> new RuntimeException("Quiz not found: " + dto.getQuizId()));

            UserProgress progress = UserProgress.builder()
                    .correctAnswers(dto.getCorrectAnswers())
                    .totalAnswers(dto.getTotalAnswers())
                    .scorePercent(dto.getScorePercent())
                    .completed(dto.isCompleted())
                    .user(user)
                    .quiz(quiz)
                    .build();

            progressRepository.save(progress);
        }
    }
}
