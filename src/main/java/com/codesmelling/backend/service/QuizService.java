package com.codesmelling.backend.service;

import com.codesmelling.backend.database.tables.Quiz;
import com.codesmelling.backend.dto.Quiz.QuizDto;
import com.codesmelling.backend.dto.Quiz.QuizDetailDto;
import com.codesmelling.backend.dto.Quiz.ErrorTagDto;
import com.codesmelling.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public List<QuizDto> getAllQuizzes() {
        return quizRepository.findAll().stream().map(quiz -> {
            QuizDto dto = new QuizDto();
            dto.setId(quiz.getId());
            dto.setTitle(quiz.getDirectoryPath());
            return dto;
        }).collect(toList());
    }

    public QuizDetailDto getQuizDetails(Long quizId) throws IOException {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Wczytaj kod źródłowy jako tekst
        Path codePath = Path.of("quizzes", quiz.getDirectoryPath(), "code.txt"); // np. src/main/resources/quizzes/quiz1/code.txt
        String content = Files.readString(codePath);

        // Zbuduj DTO
        QuizDetailDto dto = new QuizDetailDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getDirectoryPath());
        dto.setFileContent(content);

        List<ErrorTagDto> tags = quiz.getErrorTags().stream().map(tag -> {
            ErrorTagDto tagDto = new ErrorTagDto();
            tagDto.setLineNumber(tag.getLineNumber());
            tagDto.setTag(tag.getType().name());  // nazwa tagu
            return tagDto;
        }).collect(toList());

        dto.setErrorTags(tags);
        return dto;
    }
}
