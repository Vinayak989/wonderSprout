package com.wondersprout.api;

import java.util.List;

import com.wondersprout.catalog.AnswerRequest;
import com.wondersprout.catalog.AnswerResponse;
import com.wondersprout.catalog.Game;
import com.wondersprout.catalog.GameCatalogService;
import com.wondersprout.catalog.MemoryCard;
import com.wondersprout.catalog.PublicQuestion;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GameController {
    private final GameCatalogService catalog;

    public GameController(GameCatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/games")
    public List<Game> games() {
        return catalog.getGames();
    }

    @GetMapping("/games/{gameId}/memory-cards")
    public List<MemoryCard> memoryCards(
            @PathVariable String gameId,
            @RequestParam(defaultValue = "6-8") String ageBand
    ) {
        return catalog.getMemoryCards(gameId, ageBand);
    }

    @GetMapping("/games/{gameId}/questions")
    public List<PublicQuestion> questions(
            @PathVariable String gameId,
            @RequestParam(defaultValue = "6-8") String ageBand
    ) {
        return catalog.getQuestions(gameId, ageBand);
    }

    @PostMapping("/games/{gameId}/answer")
    public AnswerResponse answer(@PathVariable String gameId, @RequestBody AnswerRequest request) {
        return catalog.checkAnswer(gameId, request);
    }
}
