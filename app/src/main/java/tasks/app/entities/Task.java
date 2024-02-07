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
@Table(name="tasks") 
public class Task {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="task_id")
    private Long   id;
    
    @ManyToOne
    @JoinColumn(name = "category")
    private Category category;
    private String content;
    @Column(name="creation_date")
    @CreationTimestamp
    private Date   creationDate;
    @Column(name="end_date")
    private Date   endDate;

    protected Task() {}

    public Task(Category category, String content ) {
        this.category = category;
        this.content  = content;
        this.creationDate     = new Date();
    }

    @Override
    public String toString() {
        return String.format(
                "Task[id=%d, content='%s', category='%s']", id, content, category);
    }

  // il faut mettre les getters et les setters
  
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category=category;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content=content;
    }
    public Date getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(Date creationDate) {
        this.creationDate=creationDate;
    }
    public Date getEndDate() {
        return endDate;
    }
    public void setEndDate(Date endDate) {
        this.endDate=endDate;
    }
}   
