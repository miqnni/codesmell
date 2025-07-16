package com.codesmelling.backend.controller;

import com.codesmelling.backend.dto.Progress.SaveProgressRequestDto;
import com.codesmelling.backend.dto.Progress.UserProgressDto;
import com.codesmelling.backend.service.AppUserService;
import com.codesmelling.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final AppUserService userService;

    @PostMapping("/save")
    public ResponseEntity<Void> saveProgress(@RequestBody SaveProgressRequestDto request, @RequestParam String username) {
        progressService.saveProgress(username, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public ResponseEntity<List<UserProgressDto>> getUserProgress(@RequestParam String username) {
        return ResponseEntity.ok(progressService.getUserProgress(username));
    }
}
