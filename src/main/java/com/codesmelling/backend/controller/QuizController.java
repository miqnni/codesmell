package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.Quiz.QuizDetailDto;
import com.codesmelling.backend.dto.Quiz.QuizDto;
import com.codesmelling.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    public ResponseEntity<List<QuizDto>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDetailDto> getQuizDetail(@PathVariable Long id) throws IOException {
        return ResponseEntity.ok(quizService.getQuizDetails(id));
    }
}
