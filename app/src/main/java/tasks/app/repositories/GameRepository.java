package app.repositories;

import java.util.List;
import app.entities.Game;

import org.springframework.data.repository.CrudRepository;

public interface GameRepository 
       extends CrudRepository<Game, Long> {
        Game findByCode(String code);
}