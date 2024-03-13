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
    public Long player1_id;
    @Column(name="player1X")
    public int player1X;
    @Column(name="player1Y")
    public int player1Y;
    @Column(name="player1Life")
    public int player1Life;
    @Column(name="player2_id")
    public Long player2_id;
    @Column(name="player2X")
    public int player2X;
    @Column(name="player2Y")
    public int player2Y;
    @Column(name="player2Life")
    public int player2Life;
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
    public int getPlayer1X(){
        return player1X;
    }
    public void setPlayer1X(int player1X){
        this.player1X = player1X;
    }
    public int getPlayer1Y(){
        return player1Y;
    }
    public void setPlayer1Y(int player1Y){
        this.player1Y = player1Y;
    }
    public int getPlayer1Life(){
        return player1Life;
    }
    public void setPlayer1Life(int player1Life){
        this.player1Life = player1Life;
    }
    public int getPlayer2X(){
        return player2X;
    }
    public void setPlayer2X(int player2X){
        this.player2X = player2X;
    }
    public int getPlayer2Y(){
        return player2Y;
    }
    public void setPlayer2Y(int player2Y){
        this.player2Y = player2Y;
    }
    public int getPlayer2Life(){
        return player2Life;
    }
    public void setPlayer2Life(int player2Life){
        this.player2Life = player2Life;
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
            this.player1X = 0;
            this.player1Y = 0;
            this.player1Life = 100;
        } else if (this.player2_id == null){
            this.player2_id = playerId;
            this.player2X = 9;
            this.player2Y = 9;
            this.player2Life = 100;
        }
    }
}   
