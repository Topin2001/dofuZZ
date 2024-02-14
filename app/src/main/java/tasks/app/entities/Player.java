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

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "player_name")
    private String name;
    @Column(name = "password")
    private String password;

    @Column(name = "posX")
    private int posX;
    @Column(name = "posY")
    private int posY;
    @Column(name = "creation_date")
    @CreationTimestamp
    private Date creationDate;

    protected Player() {
    }

    public Player(String name, String password) {
        this.name = name;
        this.password = password;
        this.posX = 0;
        this.posY = 0;
    }

    @Override
    public String toString() {
        return String.format("Player[id=%d, name='%s', posX=%d, posY=%d, creationDate=%s]", id, name, posX, posY,
                creationDate);
    }
    // il faut mettre les getters et les setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPosX() {
        return posX;
    }

    public void setPosX(int posX) {
        this.posX = posX;
    }

    public int getPosY() {
        return posY;
    }

    public void setPosY(int posY) {
        this.posY = posY;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String jwtToken() {
        private static final String SECRET_KEY = "YourSecretKeyHere";

        String jwtToken = Jwts.builder()
                .claim("name", name) // Using username as the subject
                .claim("playerId", id) // Adding playerId as a claim
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();

        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY) // Use the predetermined key
                    .build()
                    .parseClaimsJws(jwtToken);

            System.out.println("Token is valid.");
            System.out.println("Name: " + claims.getBody().get("name"));
            System.out.println("Player ID: " + claims.getBody().get("playerId"));
            // Add more checks or processing as needed
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
        }

        return jwtToken;
    }

}
