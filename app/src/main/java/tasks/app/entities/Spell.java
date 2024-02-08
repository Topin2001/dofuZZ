package app.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name="spell") 
public class Spell {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spell_id")
    private Long id;
    @Column(name = "cost")
    private int cost;
    @Column(name = "damage")
    private int damage;
    @Column(name = "name")
    private String name;


    protected Spell() {}

    public Spell(String name, int cost, int damage) {
        this.name = name;
        this.cost = cost;
        this.damage = damage;
    }

    @Override
    public String toString() {
        return String.format(
                "Spell[id=%d, name='%s', cost='%d', damage='%d']", id, name, cost, damage);
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getCost(){
        return cost;
    }
    public void setCost(int cost){
        this.cost = cost;
    }
    public int getDamage(){
        return damage;
    }
    public void setDamage(int damage){
        this.damage = damage;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

}
