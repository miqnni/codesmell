package com.codesmelling.backend.dto.Tag;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagDto {
    private String code;
    private String description;
    private String colorHex;
}