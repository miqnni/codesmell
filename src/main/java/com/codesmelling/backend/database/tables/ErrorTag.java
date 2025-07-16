package com.codesmelling.backend.database.tables;

import com.codesmelling.backend.database.enums.ErrorType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "error_tag")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int lineNumber;

    @Enumerated(EnumType.STRING)
    private ErrorType type;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
}
