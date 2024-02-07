package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class DofuzzApplication implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DofuzzApplication.class);
  
  @Autowired
  JdbcTemplate jdbcTemplate;

  public static void main(String[] args) {
    SpringApplication.run(DofuzzApplication.class, args);
  }

  @Override
  public void run(String... strings) throws Exception {

    List<String> list = Arrays.asList(strings);
    if (list.contains("install")) {
        jdbcTemplate.execute("DROP TABLE players IF EXISTS");
        jdbcTemplate.execute("DROP TABLE games IF EXISTS");

        jdbcTemplate.execute("CREATE TABLE players(" +
                "id SERIAL, player_name VARCHAR(255), posX INTEGER, posY INTEGER, creation_date TIMESTAMP)");
        jdbcTemplate.execute("CREATE TABLE games(" +
                "id SERIAL, code VARCHAR(255), creation_date TIMESTAMP, player1_id INTEGER, player2_id INTEGER, nb_turns INTEGER)");
    }
  }
}
