package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.annotation.ComponentScan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@ComponentScan
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
      jdbcTemplate.execute("DROP TABLE spells IF EXISTS");
      jdbcTemplate.execute("DROP TABLE tokens IF EXISTS");
      
      jdbcTemplate.execute("CREATE TABLE players(" +
              "id SERIAL, player_name VARCHAR(255), posX INTEGER, posY INTEGER, creation_date TIMESTAMP)");
      jdbcTemplate.execute("CREATE TABLE games(" +
              "id SERIAL, game_code VARCHAR(255), creation_date TIMESTAMP)");
      jdbcTemplate.execute("CREATE TABLE spells(" +
              "id SERIAL, spell_name VARCHAR(255), damage INTEGER, cost INTEGER)");
      jdbcTemplate.execute("CREATE TABLE tokens(" +
              "token_id SERIAL, token VARCHAR(255))");

      jdbcTemplate.update("INSERT INTO spells(spell_name, damage, cost) VALUES(?, ?, ?)", "Fireball", 10, 5);
      jdbcTemplate.update("INSERT INTO spells(spell_name, damage, cost) VALUES(?, ?, ?)", "Forst", 5, 3);

  }
  }
}
