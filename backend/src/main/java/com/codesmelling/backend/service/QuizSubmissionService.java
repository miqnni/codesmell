package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.database.tables.ErrorTag;
import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.database.tables.UserProgress;
import com.codesmelling.backend.dto.Quiz.MissingAnswerDto;
import com.codesmelling.backend.dto.Quiz.QuizEvaluationResultDto;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizSubmissionService {

    private final QuizRepository quizRepository;
    private final AppUserRepository userRepository;
    private final UserProgressRepository progressRepository;
    private final ErrorTagRepository errorTagRepository;

    public QuizEvaluationResultDto evaluateAndSaveResult(QuizSubmissionRequestDto submission) {
        AppUser user = userRepository.findByUsername(submission.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + submission.getUsername()));

        Quiz quiz = quizRepository.findById(submission.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found: ID = " + submission.getQuizId()));

        List<ErrorTag> correctTags = errorTagRepository.findByQuizId(quiz.getId());
        int totalAnswers = correctTags.size();

        Map<String, ErrorTag> correctKeyMap = correctTags.stream()
                .collect(Collectors.toMap(
                        tag -> tag.getFileName().trim() + ":" + tag.getLineNumber() + ":" + tag.getType(),
                        tag -> tag
                ));

        Set<String> correctKeys = new HashSet<>(correctKeyMap.keySet());

        List<UserAnswerDto> correctAnswers = new ArrayList<>();
        List<UserAnswerDto> incorrectAnswers = new ArrayList<>();
        Set<String> submittedKeys = new HashSet<>();

        for (UserAnswerDto answer : submission.getAnswers()) {
            String key = answer.getFilePath().replaceFirst("^/", "").trim() + ":" + answer.getLineNumber() + ":" + answer.getErrorTag();
            submittedKeys.add(key);

            if (correctKeys.contains(key)) {
                correctAnswers.add(answer);
            } else {
                incorrectAnswers.add(answer);
            }
        }

        // Oblicz brakujące odpowiedzi
        List<MissingAnswerDto> missingAnswers = correctKeys.stream()
                .filter(key -> !submittedKeys.contains(key))
                .map(key -> {
                    ErrorTag tag = correctKeyMap.get(key);
                    return MissingAnswerDto.builder()
                            .filePath(tag.getFileName().startsWith("/") ? tag.getFileName() : "/" + tag.getFileName())
                            .lineNumber(tag.getLineNumber())
                            .errorTag(tag.getType())
                            .build();
                })
                .collect(Collectors.toList());

        int finalScore = Math.max(0, correctAnswers.size() - incorrectAnswers.size());
        double percentScore = totalAnswers > 0 ? ((double) finalScore / totalAnswers) * 100.0 : 0.0;

        // Zapis do UserProgress (jak wcześniej)
        Optional<UserProgress> existingProgressOpt = progressRepository.findByUserAndQuiz(user, quiz);
        if (existingProgressOpt.isPresent()) {
            UserProgress existing = existingProgressOpt.get();
            if (finalScore > existing.getCorrectAnswers()) {
                existing.setCorrectAnswers(finalScore);
                existing.setTotalAnswers(totalAnswers);
                existing.setScorePercent(percentScore);
                existing.setCompleted(true);
                progressRepository.save(existing);
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

        return QuizEvaluationResultDto.builder()
                .correctAnswers(correctAnswers)
                .incorrectAnswers(incorrectAnswers)
                .missingAnswers(missingAnswers)
                .score(finalScore)
                .scorePercent(percentScore)
                .build();
    }



    private void updateProgress(UserProgress progress, int correct, int total, double score) {
        progress.setCorrectAnswers(correct);
        progress.setTotalAnswers(total);
        progress.setScorePercent(score);
        progress.setCompleted(true);
    }

    private Set<CorrectTag> loadCorrectTagsFromCsv(Quiz quiz) {
        File csvFile = new File("app/quizzes/" + quiz.getQuizName() + "/ErrorTags.csv");
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
