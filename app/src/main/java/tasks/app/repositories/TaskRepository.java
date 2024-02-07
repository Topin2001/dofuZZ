package app.repositories;

import java.util.List;
import app.entities.Task;

import org.springframework.data.repository.CrudRepository;

public interface TaskRepository 
       extends CrudRepository<Task, Long> {
}