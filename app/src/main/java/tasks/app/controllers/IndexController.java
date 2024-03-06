package app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @CrossOrigin
  @GetMapping(path = { "/", "/games" })
  public ResponseEntity<?> getAllGames(Model model) {
    return ResponseEntity.ok().body(gameRepository.findAll());
  }

  @PostMapping(path = "/games")
  public ResponseEntity<?> addNewGame(@RequestParam String code) {
    Game game = new Game(code);
    gameRepository.save(game);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping(path = "/players/{playerId}/move")
  public ResponseEntity<?> movePlayer(@RequestParam int posX, @RequestParam int posY, @RequestParam String playerJwt) {
    if (playerJwt == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No JWT token provided");
    }
    if (!Player.checkJWTToken(playerJwt)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is not valid");
    }
    Long playerId = Player.getIdFromJwt(playerJwt);
    Player player = playerRepository.findById(playerId).orElse(null);
    if (player == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
    }
    Game game = gameRepository.findById(player.getGameId()).orElse(null);
    if (game == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }
    //Check the tour of game
    if (game.getNb_turns()%2 != (game.getPlayer1_id().equals(playerId) ? 0 : 1)){
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your turn");
    }
    game.setNb_turns(game.getNb_turns() + 1);

    player.setPosX(posX);
    player.setPosY(posY);
    playerRepository.save(player);

    return ResponseEntity.ok().build();
  }

  @GetMapping(path = "/players")
  public ResponseEntity<?> getAllPlayers(Model model) {
    return ResponseEntity.ok().body(playerRepository.findAll());
  }

  @GetMapping(path = "/games/{gameId}")
  public ResponseEntity<?> getGame(@RequestParam Long gameId) {
    return ResponseEntity.ok().body(gameRepository.findById(gameId).orElse(null));
  }

  @GetMapping(path = "/players/{playerId}")
  public ResponseEntity<?> getPlayer(@RequestParam Long playerId) {
    return ResponseEntity.ok().body(playerRepository.findById(playerId).orElse(null));
  }

  @PostMapping(path = "/games/{gameId}/players/{playerId}")
  public ResponseEntity<?> addPlayerToGame(@RequestParam Long gameId, @RequestParam Long playerId) {
    Game game = gameRepository.findById(gameId).orElse(null);
    if (game == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }
    Player player = playerRepository.findById(playerId).orElse(null);
    if (player == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
    }
    game.addPlayer(playerId);
    gameRepository.save(game);
    player.setGameId(gameId);
    playerRepository.save(player);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  public static class PlayerRegistrationRequest {
    private String username;
    private String password;

    public String getUsername() {
      return username;
    }

    public void setUsername(String username) {
      this.username = username;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password;
    }
  }

  @PostMapping(path = "/register")
  public ResponseEntity<?> register(@RequestBody PlayerRegistrationRequest request) {
    Player playerExists = playerRepository.findByName(request.getUsername());
    if (playerExists != null) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Player already exists");
    } else if (request.getUsername().length() < 3 || request.getPassword().length() < 3) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Username and password must be at least 3 characters long");
    } else {
      Player player = new Player(request.getUsername(), request.getPassword());
      playerRepository.save(player);
      return ResponseEntity.status(HttpStatus.CREATED).body(player.jwtToken());
    }
  }

  @PostMapping(path = "/login")
  public ResponseEntity<?> login(@RequestBody PlayerRegistrationRequest request) {
    Player player = playerRepository.findByName(request.getUsername());
    if (player == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
    }
    if (!player.getPassword().equals(request.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong password");
    }
    return ResponseEntity.ok().body(player.jwtToken());
  }
}