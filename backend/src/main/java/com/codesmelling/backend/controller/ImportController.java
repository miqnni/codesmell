package com.codesmelling.backend.controller;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.service.AppUserService;
import com.codesmelling.backend.service.ImportManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ImportController {

    private final AppUserService appUserService;

    private final ImportManagerService importManagerService;

    @GetMapping("/import")
    public ResponseEntity<String> importData() {
        try {
            importManagerService.importAll();
            return ResponseEntity.ok("Import completed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Import failed: " + e.getMessage());
        }
    }

//    @GetMapping("/import")
//    public String importUser() {
//        AppUser user = appUserService.createStudentPiwoUser();
//        return "Utworzono użytkownika: " + user.getUsername();
//    }
}
