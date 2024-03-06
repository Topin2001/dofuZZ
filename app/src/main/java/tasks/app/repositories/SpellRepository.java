package app.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import app.entities.Spell;


public interface SpellRepository 
       extends CrudRepository<Spell, Long> {
       
       //Spell findById(Long id);
}