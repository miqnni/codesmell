package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.Quiz.QuizSubmissionRequestDto;
import com.codesmelling.backend.service.QuizSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizSubmissionController {

    private final QuizSubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<Void> submitQuiz(@RequestBody QuizSubmissionRequestDto request) {
        submissionService.evaluateAndSaveResult(request);
        return ResponseEntity.ok().build();
    }
}
