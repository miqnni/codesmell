package com.codesmelling.backend;

import com.codesmelling.backend.database.tables.AppUser;
import com.codesmelling.backend.dto.Auth.RegisterRequestDto;
import com.codesmelling.backend.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CodeSmellingApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodeSmellingApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner demo(AppUserRepository userRepository) {
//		return args -> {
//			AppUser user = AppUser.builder()
//					.username("janek")
//					.password("tajne123")  // na razie bez haszowania
//					.email("janek@example.com")
//					.role("ROLE_USER")
//					.build();
//			if (userRepository.findByUsername("janek").isEmpty()) {
//				userRepository.save(user);
//			}
//			//userRepository.save(user);
//			System.out.println("Zapisano użytkownika: " + user.getUsername());
//
//			// ---------------------------
//			// 2. Dodajemy Stefana przez DTO
//			// ---------------------------
//			RegisterRequestDto dto = new RegisterRequestDto();
//			dto.setUsername("StefanKowalski");
//			dto.setPassword("student123");
//			dto.setEmail("stefan@student.pl");
//
//			if (userRepository.findByUsername(dto.getUsername()).isEmpty()) {
//				AppUser stefan = AppUser.builder()
//						.username(dto.getUsername())
//						.password(dto.getPassword())
//						.email(dto.getEmail())
//						.role("ROLE_USER")
//						.build();
//				if (userRepository.findByUsername(dto.getUsername()).isEmpty()) {
//					userRepository.save(stefan);
//				}
//				//userRepository.save(stefan);
//				System.out.println("Dodano użytkownika Stefana z DTO");
//			}
//		};
//	}
}
