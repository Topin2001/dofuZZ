package app.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import app.entities.Category;


public interface CategoryRepository 
       extends CrudRepository<Category, Long> {
}