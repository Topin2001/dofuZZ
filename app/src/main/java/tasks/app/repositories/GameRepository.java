package app.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import app.entities.Game;


public interface GameRepository 
       extends CrudRepository<Game, Long> {
}