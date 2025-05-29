package ru.kata.spring.boot_security.demo.configs;

import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.service.UserService;

    @Component
    public class DataInitializer {
        private final UserService userService;
        private final PasswordEncoder passwordEncoder;

        public DataInitializer(UserService userService, PasswordEncoder passwordEncoder) {
            this.userService = userService;
            this.passwordEncoder = passwordEncoder;
        }

        @PostConstruct
        public void init() {

        }
    }
