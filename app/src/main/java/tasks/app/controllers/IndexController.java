package app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import app.entities.Spell;
import app.repositories.PlayerRepository;
import app.repositories.GameRepository;
import app.repositories.SpellRepository;

@CrossOrigin
@Controller    
public class IndexController {

  @Autowired
  private GameRepository gameRepository;

  @Autowired
  private PlayerRepository playerRepository;

  @Autowired 
  private SpellRepository SpellRepository;

  @CrossOrigin
  @GetMapping(path = { "/", "/games" })
  public ResponseEntity<?> getAllGames(Model model) {
    return ResponseEntity.ok().body(gameRepository.findAll());
  }

  @PostMapping(path = "/games")
  public ResponseEntity<Long> addNewGame(@RequestParam String code) {
    Game game = new Game(code);
    gameRepository.save(game);

    return ResponseEntity.status(HttpStatus.CREATED).body(game.getId());
  }

  @PostMapping(path = "/players/move")
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
    Game game = gameRepository.findById(player.getGameIdFromJwt(playerJwt)).orElse(null);
    if (game == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }
    boolean isPlayer1 = game.getPlayer1_id().equals(playerId);
    // Check the tour of game
    if (game.getNb_turns() % 2 != (game.getPlayer1_id().equals(playerId) ? 0 : 1)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your turn");
    }
    game.setNb_turns(game.getNb_turns() + 1);

    // Calculate the total distance moved
    // int totalDistance = Math.abs(player.getPosX() - posX) + Math.abs(player.getPosY() - posY);
    int totalDistance = isPlayer1 ? Math.abs(game.getPlayer1X() - posX) + Math.abs(game.getPlayer1Y() - posY) : Math.abs(game.getPlayer2X() - posX) + Math.abs(game.getPlayer2Y() - posY);

    // Check if the total distance moved is more than 5 tiles
    if (totalDistance > 5) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Can't move more than 5 tiles");
    }

    // Check if the move is in the board
    if (posX < 0 || posX >= 10 || posY < 0 || posY >= 10) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid move");
    }

    if (isPlayer1) {
        game.setPlayer1X(posX);
        game.setPlayer1Y(posY);
    } else {
        game.setPlayer2X(posX);
        game.setPlayer2Y(posY);
    }

    gameRepository.save(game);

    return ResponseEntity.ok().build();
}

  @PostMapping(path = "/players/{playerId}/attack")
  public ResponseEntity<?> attackPlayer(@RequestParam int targetPosX,
      @RequestParam int targetPosY, @RequestParam String playerJwt, @RequestParam Long spellId) {
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

    Game game = gameRepository.findById(player.getGameIdFromJwt(playerJwt)).orElse(null);
    boolean isPlayer1 = game.getPlayer1_id().equals(playerId);
    if (game == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }

    // Check the turn of the game
    if (game.getNb_turns() % 2 != (game.getPlayer1_id().equals(playerId) ? 0 : 1)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your turn");
    }

    if (spellId == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No spell id provided");
    }

    // Find the spell
    Spell spell = SpellRepository.findById(spellId).orElse(null);
    
    if (spell == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spell not found");
    }

    // Find the other player in the game
    Player targetPlayer = game.getPlayer1_id().equals(playerId) ? playerRepository.findById(game.getPlayer2_id()).orElse(null) : playerRepository.findById(game.getPlayer1_id()).orElse(null);

    if (targetPlayer == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No player at the target position");
    }

    // Check if player is in range of spell
    if (isPlayer1) {
        if (Math.abs(game.getPlayer1X() - targetPosX) + Math.abs(game.getPlayer1Y() - targetPosY) > spell.getRange()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Target player is out of range");
        }

        // give damage to target player
        game.setPlayer2Life(game.getPlayer2Life() - spell.getDamage());
        if (game.getPlayer2Life() <= 0) {
            game.setWinner(playerId);
        }
    } else {
        if (Math.abs(game.getPlayer2X() - targetPosX) + Math.abs(game.getPlayer2Y() - targetPosY) > spell.getRange()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Target player is out of range");
        }

        // give damage to target player
        game.setPlayer1Life(game.getPlayer1Life() - spell.getDamage());
        if (game.getPlayer1Life() <= 0) {
            game.setWinner(playerId);
        }
    }

    // Update the number of turns
    game.setNb_turns(game.getNb_turns() + 1);

    // Save the changes
    playerRepository.save(player);
    playerRepository.save(targetPlayer);
    gameRepository.save(game);

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

  static class GameState {
    public Game game;
    public Player player1;
    public Player player2;
  }

  @GetMapping(path = "/games/{gameId}/state")
  public ResponseEntity<?> getGameState(@RequestParam Long gameId) {
    Game game = gameRepository.findById(gameId).orElse(null);
    if (game == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }
      // return the game and player positions
      GameState gameState = new GameState();
      gameState.game = game;
      gameState.player1 = game.player1_id == null ? null : playerRepository.findById(game.player1_id).orElse(null);
      gameState.player2 = game.player2_id == null ? null : playerRepository.findById(game.player2_id).orElse(null);
      return ResponseEntity.ok().body(gameState);
  }


  @GetMapping(path = "/players/{playerId}")
  public ResponseEntity<?> getPlayer(@RequestParam Long playerId) {
    return ResponseEntity.ok().body(playerRepository.findById(playerId).orElse(null));
  }

  // struc
  public class JoinGameReturn {
    public Long gameId;
    public String playerJwt;
  } 

    // Add a player to a game using its code, the player using this route is the player 2
  @PostMapping(path = "/games/join")
  public ResponseEntity<?> joinGame(@RequestParam String code, @RequestParam Long playerId) {
    Game game = gameRepository.findByCode(code);
    if (game == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Game not found");
    }
    if (game.getPlayer2_id() != null) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Game is full");
    }
    Player player = playerRepository.findById(playerId).orElse(null);
    if (player == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
    }
    game.addPlayer(playerId);

    gameRepository.save(game);

    JoinGameReturn joinGameReturn = new JoinGameReturn();
    joinGameReturn.gameId = game.getId();
    joinGameReturn.playerJwt = player.jwtToken(game.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(joinGameReturn);
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

    JoinGameReturn joinGameReturn = new JoinGameReturn();
    joinGameReturn.gameId = game.getId();
    joinGameReturn.playerJwt = player.jwtToken(game.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(joinGameReturn);
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
      return ResponseEntity.status(HttpStatus.CREATED).body(player.jwtToken(-1L));
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
    return ResponseEntity.ok().body(player.jwtToken(-1L));
  }
}