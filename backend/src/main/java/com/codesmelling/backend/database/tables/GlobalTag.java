package com.codesmelling.backend.database.tables;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "global_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // np. "TYPO"

    @Column(nullable = false)
    private String description; // np. "Typographical mistake"

    @Column(nullable = false)
    private String colorHex; // np. "#ff0000"
}

