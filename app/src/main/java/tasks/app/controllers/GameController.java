import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ui.Model;

import app.entities.Game;
import app.entities.Player;
import app.repositories.GameRepository;
import app.repositories.PlayerRepository;

import java.util.List;

@Controller
public class GameController {
  
  @Autowired 
  private GameRepository gameRepository;

  @Autowired 
  private PlayerRepository playerRepository;

  @GetMapping(path={"/", "/games"})
  public ResponseEntity<?> getAllGames() {
    Iterable<Game> games = gameRepository.findAll();
    return ResponseEntity.ok().body(games);
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
}
