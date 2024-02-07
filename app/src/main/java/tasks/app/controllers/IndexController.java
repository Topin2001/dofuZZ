package app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ui.Model;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import app.entities.Game;
import app.entities.Player;
import app.repositories.PlayerRepository;
import app.repositories.GameRepository;

@Controller    
public class IndexController {
  
  @Autowired 
  private GameRepository gameRepository;

  @GetMapping(path={"/", "/games"})
  public ResponseEntity<?> getAllGames(Model model) {
    return ResponseEntity.ok().body(gameRepository.findAll());
  }

  @PostMapping(path="/games")
  public ResponseEntity<?> addNewGame(@RequestParam String code) {
    Game game = new Game(code);
    gameRepository.save(game);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}
