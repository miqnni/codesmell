package com.codesmelling.backend.dto.Progress;

import lombok.AllArgsConstructor;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProgressDto {
    private Long quizId;
    private String quizName;
    private double scorePercent;
    private boolean completed;
}