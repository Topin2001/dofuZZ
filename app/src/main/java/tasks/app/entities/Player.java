package app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name="players") 
public class Player {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id")
    private Long   id;

    @Column(name="player_name")
    private String name;
    
    @Column(name="posX")
    private int  posX;
    @Column(name="posY")
    private int  posY;
    @Column(name="creation_date")
    @CreationTimestamp
    private Date   creationDate;

    protected Player() {}

    public Player(String name) {
        this.name = name;
        this.posX = 0;
        this.posY = 0;
    }

    @Override
    public String toString() {
        return String.format(
                "Player[id=%d, name='%s', posX='%d', posY='%d', creationDate='%s']", id, name, posX, posY, creationDate);
    }

  // il faut mettre les getters et les setters
  
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }
    public int getPosX(){
        return posX;
    }
    public void setPosX(int posX){
        this.posX = posX;
    }
    public int getPosY(){
        return posY;
    }
    public void setPosY(int posY){
        this.posY = posY;
    }
    public Date getCreationDate(){
        return creationDate;
    }
    public void setCreationDate(Date creationDate){
        this.creationDate = creationDate;
    }
}   
