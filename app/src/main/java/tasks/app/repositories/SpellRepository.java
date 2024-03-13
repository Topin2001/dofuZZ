package app.repositories;

import java.util.List;
import app.entities.Spell;

import org.springframework.data.repository.CrudRepository;

public interface SpellRepository 
       extends CrudRepository<Spell, Long> {

       Spell findByName(String name);
}