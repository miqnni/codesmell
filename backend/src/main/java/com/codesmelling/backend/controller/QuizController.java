package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.FileContentDto;
import com.codesmelling.backend.dto.Quiz.QuizContentDto;
import com.codesmelling.backend.dto.Quiz.QuizListDto;
import com.codesmelling.backend.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/list")
    public ResponseEntity<List<QuizListDto>> listAllQuizzes() {
        try {
            List<QuizListDto> result = quizService.getAvailableQuizzes();
            System.out.println(result);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            System.out.println("listowanie nie powiodło się");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{quizId}/file")
    public ResponseEntity<FileContentDto> getQuizFileContent(
            @PathVariable Long quizId,
            @RequestParam String path) {
        try {
            System.out.println(path);
            String content = quizService.getFileContentInQuiz(quizId, path);
            FileContentDto dto = new FileContentDto(path, content);
            return ResponseEntity.ok(dto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

//    @GetMapping("/content")
//    public ResponseEntity<QuizContentDto> getQuizContent() {
//        long quizId = 1;
//        try {
//            QuizContentDto content = quizService.getQuizContent(quizId);
//            System.out.println(content);
//            return ResponseEntity.ok(content);
//        } catch (IOException e) {
//            System.out.println("Zdobywanie zawartosci quizu nie powidoło sie");
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

    // tego użyć jak będzie frontend - na froncie wysyłamy z zapytaniem quizId
    @GetMapping("/content")
    public ResponseEntity<QuizContentDto> getQuizContent(@RequestParam Long quizId) {
        try {
            QuizContentDto content = quizService.getQuizContent(quizId);
               System.out.println(content);
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
