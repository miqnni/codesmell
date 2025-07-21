package com.codesmelling.backend.dto.ErrorTag;

import com.codesmelling.backend.database.enums.ErrorType;
import lombok.Data;

@Data
public class ErrorTagCsvDto {
    private int lineNumber;
    private ErrorType type;
    private String fileName;
    private long quizId;
}
