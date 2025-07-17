package com.codesmelling.backend.controller;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping("/import")
    public String importUser() {
        AppUser user = appUserService.createStudentPiwoUser();
        return "Utworzono użytkownika: " + user.getUsername();
    }
}
