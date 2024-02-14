package app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@CrossOrigin
@Controller    
public class IndexController {
  
  @Autowired 
  private GameRepository gameRepository;

  @Autowired
  private PlayerRepository playerRepository;
 
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

  @PostMapping(path="/games/{gameId}/players")
  public ResponseEntity<?> addNewPlayerToGame(@RequestParam String playerName, @RequestParam Long gameId) {
    Game game = gameRepository.findById(gameId).orElse(null);
    if (game == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }

    Player player = new Player(playerName);
    playerRepository.save(player);

    game.addPlayer(player);
    gameRepository.save(game);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping(path="/players/{playerId}/move")
  public ResponseEntity<?> movePlayer(@RequestParam int posX, @RequestParam int posY, @RequestParam Long playerId) {
    Player player = playerRepository.findById(playerId).orElse(null);
    if (player == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
    }

    player.setPosX(posX);
    player.setPosY(posY);
    playerRepository.save(player);

    return ResponseEntity.ok().build();
  }

  @GetMapping(path="/players")
    public ResponseEntity<?> getAllPlayers(Model model) {
        return ResponseEntity.ok().body(playerRepository.findAll());
    }

    @PostMapping(path="/players")
    public ResponseEntity<?> addNewPlayer(@RequestParam String name) {
        Player player = new Player(name);
        playerRepository.save(player);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping(path="/games/{gameId}")
    public ResponseEntity<?> getGame(@RequestParam Long gameId) {
        return ResponseEntity.ok().body(gameRepository.findById(gameId).orElse(null));
    }

    @GetMapping(path="/players/{playerId}")
    public ResponseEntity<?> getPlayer(@RequestParam Long playerId) {
        return ResponseEntity.ok().body(playerRepository.findById(playerId).orElse(null));
    }

    @GetMapping(path="/games/{gameId}/players")
    public ResponseEntity<?> getPlayersInGame(@RequestParam Long gameId) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
        }
        return ResponseEntity.ok().body(game.getPlayers());
    }

    @PostMapping(path="/games/{gameId}/players/{playerId}")
    public ResponseEntity<?> addPlayerToGame(@RequestParam Long gameId, @RequestParam Long playerId) {
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
        }
        Player player = playerRepository.findById(playerId).orElse(null);
        if (player == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
        }
        game.addPlayer(player);
        gameRepository.save(game);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
