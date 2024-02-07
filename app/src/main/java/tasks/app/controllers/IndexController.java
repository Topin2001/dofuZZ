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
  private TaskRepository taskRepository;

  @GetMapping(path={"/", "/tasks"})
  public String  getAllTasks(Model model) {
    model.addAttribute("tasks", taskRepository.findAll());
    return "tasks"; 
  }

    //  Les données seront tirées d'un formulaire
  @PostMapping(path="/tasks")
  public String  nouveau(@RequestParam String content,@RequestParam Category category) {
    Task task = new Task(category, content);
    taskRepository.save(task);

    return "redirect:/tasks"; 
  }
}
