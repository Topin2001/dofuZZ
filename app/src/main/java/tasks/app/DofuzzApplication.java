package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@ComponentScan
@SpringBootApplication
public class DofuzzApplication implements CommandLineRunner {

        @Bean
        public WebMvcConfigurer corsConfigurer() {
                return new WebMvcConfigurer() {
                        @Override
                        public void addCorsMappings(CorsRegistry registry) {
                                registry.addMapping("/**")
                                                .allowedOrigins("http://localhost:3000")
                                                .allowedMethods("GET", "POST", "PUT", "DELETE");
                        }
                };
        }

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
                                        "id SERIAL, player_name VARCHAR(255), password VARCHAR(255), gameid SERIAL, posX INTEGER, posY INTEGER, life INTEGER, creation_date TIMESTAMP)");
                        jdbcTemplate.execute("CREATE TABLE games(" +
                                        "id SERIAL, code VARCHAR(255), creation_date TIMESTAMP, player1_id INTEGER, player2_id INTEGER, nb_turns INTEGER)");
                        jdbcTemplate.execute("CREATE TABLE spells(" +
                                        "id SERIAL, spell_name VARCHAR(255), damage INTEGER, cost INTEGER)");
                        jdbcTemplate.execute("CREATE TABLE tokens(" +
                                        "token_id SERIAL, token VARCHAR(255))");

                        jdbcTemplate.update("INSERT INTO spells(spell_name, damage, cost) VALUES(?, ?, ?)", "Fireball",
                                        10, 5);
                        jdbcTemplate.update("INSERT INTO spells(spell_name, damage, cost) VALUES(?, ?, ?)", "Forst", 5,
                                        3);

                }
        }
}
