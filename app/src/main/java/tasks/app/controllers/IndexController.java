package app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.ui.Model;

import app.entities.Task;
import app.entities.Category;
import app.repositories.TaskRepository;

@Controller    
public class IndexController {
  
  @Autowired 
  private GameRepository gameRepository;

  @GetMapping(path={"/", "/games"})
  public String  getAllTasks(Model model) {
    model.addAttribute("games", taskRepository.findAll());
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
