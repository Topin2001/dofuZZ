package app.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name="spells") 
public class Spell {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "range")
    private int range;
    @Column(name = "damage")
    private int damage;
    @Column(name = "name")
    private String name;


    protected Spell() {}

    public Spell(String name, int range, int damage) {
        this.name = name;
        this.range = range;
        this.damage = damage;
    }

    @Override
    public String toString() {
        return String.format(
                "Spell[id=%d, name='%s', range='%d', damage='%d']", id, name, range, damage);
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getRange(){
        return range;
    }
    public void setRange(int range){
        this.range = range;
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
