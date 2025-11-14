package com.openclassrooms.bobapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.bobapp.service.JokeService;

/**
 * REST Controller for Joke API
 * Test modification to trigger Backend CI pipeline
 * This will test the complete CI/CD workflow:
 * 1. Backend CI - runs tests and uploads artifacts
 * 2. SonarQube Analysis - reuses artifacts (no re-run of tests)
 * 3. Docker Deploy - builds image and runs smoke tests
 */
@RestController
@RequestMapping("api/joke")
public class JokeController {

    private final JokeService jokeService;

    /**
     * Constructor injection for JokeService
     */
    JokeController(JokeService jokeService) {
        this.jokeService = jokeService;
    }

    /**
     * GET endpoint to retrieve a random joke
     * @return ResponseEntity containing a random joke
     */
    @GetMapping()
    public ResponseEntity<?> getRandomJokes() {
        return ResponseEntity.ok(this.jokeService.getRandomJoke());
    }
}
