package app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ui.Model;

import app.entities.Game;
import app.entities.Player;
import app.repositories.PlayerRepository;
import app.repositories.GameRepository;

@Controller    
public class IndexController {
  
  @Autowired 
  private GameRepository gameRepository;

  @GetMapping(path={"/", "/games"})
  public String  getAllTasks(Model model) {
    model.addAttribute("games", gameRepository.findAll());
    return "index"; 
  }

    //  Les données seront tirées d'un formulaire
  @PostMapping(path="/games")
  public String  nouveau(@RequestParam String code) {
    Game game = new Game(code);
    gameRepository.save(game);

    return "index"; 
  }
}
