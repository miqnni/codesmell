package com.codesmelling.backend.dto.Progress;

public record UserProgressSummaryDto(
        int completedCount,
        int totalCount
) {}