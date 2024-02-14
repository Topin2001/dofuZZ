package app.repositories;

import java.util.List;
import app.entities.Player;

import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository 
       extends CrudRepository<Player, Long> {

       Player findByName(String name);
}