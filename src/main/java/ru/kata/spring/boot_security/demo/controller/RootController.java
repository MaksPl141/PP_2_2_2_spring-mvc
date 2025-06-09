package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

    @RestController
    public class RootController {

        @GetMapping("/")
        public ResponseEntity<Void> redirectToLogin() {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("/login.html"))
                    .build();
        }
    }

