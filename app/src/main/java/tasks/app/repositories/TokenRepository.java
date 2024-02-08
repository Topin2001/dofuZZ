package app.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import app.entities.Token;


public interface TokenRepository 
       extends CrudRepository<Token, Long> {
}