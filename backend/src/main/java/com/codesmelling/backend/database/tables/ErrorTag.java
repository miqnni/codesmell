package com.codesmelling.backend.database.tables;

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

    // dodać pole na nazwe pliku (jesli zadanie jest na wiele plików to id quizu nic nam nie mówi)
    @Column(name = "file_name")
    private String fileName;

//    @Enumerated(EnumType.STRING)
//    private ErrorType type;
    @Column(name = "tag_code")
    private String type;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
}
