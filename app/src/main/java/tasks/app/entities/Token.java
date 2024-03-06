package app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Table(name="token")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long id;
    @Column(name = "token")
    private String token;

    protected Token() {}

    public Token(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return String.format(
                "Token[id=%d, token='%s']", id, token);
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getToken(){
        return token;
    }
    public void setToken(String token){
        this.token = token;
    }

    
}
