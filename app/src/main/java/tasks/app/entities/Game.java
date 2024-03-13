package app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name="games") 
public class Game {


    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;
    @Column(name="code")
    private String code;
    @Column(name="player1_id")
    private Long player1_id;
    @Column(name="player2_id")
    private Long player2_id;
    @Column(name="nb_turns")
    private int nb_turns;
    @Column(name="winner")
    private Long winner;


    protected Game() {}

    public Game(String code) {
        this.code = code;
        this.winner = -1L;
    }

    @Override
    public String toString() {
        return String.format(
                "Game[id=%d, code='%s']", id, code);
    }

  // il va falloir mettre les getters/setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getCode(){
        return code;
    }
    public void setCode(String code){
        this.code = code;
    }
    public Long getPlayer1_id(){
        return player1_id;
    }
    public void setPlayer1_id(Long player1_id){
        this.player1_id = player1_id;
    }
    public Long getPlayer2_id(){
        return player2_id;
    }
    public void setPlayer2_id(Long player2_id){
        this.player2_id = player2_id;
    }
    public int getNb_turns(){
        return nb_turns;
    }
    public void setNb_turns(int nb_turns){
        this.nb_turns = nb_turns;
    }
    public Long getWinner(){
        return winner;
    }
    public void setWinner(Long winner){
        this.winner = winner;
    }
    public void addPlayer(Long playerId){
        if (this.player1_id == null){
            this.player1_id = playerId;
        } else if (this.player2_id == null){
            this.player2_id = playerId;
        }
    }
}   
