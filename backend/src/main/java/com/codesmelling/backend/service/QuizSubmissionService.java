package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.ErrorTag;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.database.tables.UserProgress;
import com.codesmelling.backend.dto.Quiz.QuizSubmissionRequestDto;
import com.codesmelling.backend.dto.User.UserAnswerDto;
import com.codesmelling.backend.repository.AppUserRepository;
import com.codesmelling.backend.repository.ErrorTagRepository;
import com.codesmelling.backend.repository.QuizRepository;
import com.codesmelling.backend.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizSubmissionService {

    private final QuizRepository quizRepository;
    private final AppUserRepository userRepository;
    private final UserProgressRepository progressRepository;
    private final ErrorTagRepository errorTagRepository;

    public void evaluateAndSaveResult(QuizSubmissionRequestDto submission) {
        AppUser user = userRepository.findByUsername(submission.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + submission.getUsername()));

        Quiz quiz = quizRepository.findById(submission.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found: ID = " + submission.getQuizId()));

        List<ErrorTag> correctTags = errorTagRepository.findByQuizId(quiz.getId());
        int totalAnswers = correctTags.size();

        Set<String> correctKeys = correctTags.stream()
                .map(tag -> tag.getFileName().trim() + ":" + tag.getLineNumber() + ":" + tag.getType())
                .collect(Collectors.toSet());

        int positive = 0;
        int negative = 0;

        for (UserAnswerDto answer : submission.getAnswers()) {
            String key = answer.getFilePath().replaceFirst("^/", "").trim() + ":" + answer.getLineNumber() + ":" + answer.getErrorTag();
            if (correctKeys.contains(key)) {
                positive++;
            } else {
                negative++;
            }
        }

        int finalScore = Math.max(0, positive - negative);
        double percentScore = totalAnswers > 0 ? ((double) finalScore / totalAnswers) * 100.0 : 0.0;


        Optional<UserProgress> existingProgressOpt = progressRepository.findByUserAndQuiz(user, quiz);

        if (existingProgressOpt.isPresent()) {
            UserProgress existingProgress = existingProgressOpt.get();
            if (finalScore > existingProgress.getCorrectAnswers()) {
                existingProgress.setCorrectAnswers(finalScore);
                existingProgress.setTotalAnswers(totalAnswers);
                existingProgress.setScorePercent(percentScore);
                existingProgress.setCompleted(true);
                progressRepository.save(existingProgress);
            }
        } else {
            UserProgress newProgress = UserProgress.builder()
                    .user(user)
                    .quiz(quiz)
                    .correctAnswers(finalScore)
                    .totalAnswers(totalAnswers)
                    .scorePercent(percentScore)
                    .completed(true)
                    .build();
            progressRepository.save(newProgress);
        }
    }



    private void updateProgress(UserProgress progress, int correct, int total, double score) {
        progress.setCorrectAnswers(correct);
        progress.setTotalAnswers(total);
        progress.setScorePercent(score);
        progress.setCompleted(true);
    }

    private Set<CorrectTag> loadCorrectTagsFromCsv(Quiz quiz) {
        File csvFile = new File("quizzes/" + quiz.getQuizName() + "/ErrorTags.csv");
        Set<CorrectTag> tags = new HashSet<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            reader.readLine(); // skip header
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(";");
                if (parts.length >= 4) {
                    int lineNum = Integer.parseInt(parts[0]);
                    String fileName = parts[1];
                    String type = parts[2];
                    tags.add(new CorrectTag(lineNum, normalize(fileName), type));
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Cannot read ErrorTags.csv", e);
        }

        return tags;
    }

    private String normalize(String path) {
        return path.replace("\\", "/").replaceFirst("^/", "");
    }

    @Value
    private static class CorrectTag {
        int lineNumber;
        String fileName;
        String type;
    }
}
