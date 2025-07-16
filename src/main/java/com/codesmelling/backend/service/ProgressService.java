package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.UserProgress;
import com.codesmelling.backend.dto.Progress.SaveProgressRequestDto;
import com.codesmelling.backend.dto.Progress.UserProgressDto;
import com.codesmelling.backend.repository.UserProgressRepository;
import com.codesmelling.backend.repository.QuizRepository;
import com.codesmelling.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserProgressRepository progressRepository;
    private final AppUserRepository userRepository;
    private final QuizRepository quizRepository;

    public void saveProgress(String username, SaveProgressRequestDto request) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProgress progress = progressRepository
                .findByUserIdAndQuizId(user.getId(), request.getQuizId())
                .orElse(new UserProgress());

        progress.setUser(user);
        progress.setQuiz(quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found")));
        progress.setCorrectAnswers(request.getCorrectAnswers());
        progress.setTotalAnswers(request.getTotalAnswers());

        double scorePercent = request.getTotalAnswers() == 0
                ? 0.0
                : 100.0 * request.getCorrectAnswers() / request.getTotalAnswers();

        progress.setScorePercent(scorePercent);
        progress.setCompleted(true);

        progressRepository.save(progress);
    }


    public List<UserProgressDto> getUserProgress(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return progressRepository.findAllByUserId(user.getId()).stream().map(p -> {
            UserProgressDto dto = new UserProgressDto();
            dto.setQuizId(p.getQuiz().getId());
            dto.setCorrectAnswers(p.getCorrectAnswers());
            dto.setTotalAnswers(p.getTotalAnswers());
            dto.setScorePercent(p.getScorePercent());
            return dto;
        }).collect(Collectors.toList());
    }

}
