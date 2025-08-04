package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.Progress.UserProgressDto;
import com.codesmelling.backend.dto.Progress.UserProgressSummaryDto;
import com.codesmelling.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final ProgressService progressService;

    @GetMapping("/full")
    public ResponseEntity<List<UserProgressDto>> getProgress(Authentication authentication) {
        String username = authentication.getName();
        List<UserProgressDto> progress = progressService.getProgressForUser(username);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/summary")
    public ResponseEntity<UserProgressSummaryDto> getUserProgressSummary(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(progressService.getUserProgressSummary(username));
    }
}
