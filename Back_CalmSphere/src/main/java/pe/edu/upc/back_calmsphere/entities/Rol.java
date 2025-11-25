package pe.edu.upc.back_calmsphere.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRol;

    @Column(name = "tipoRol", length = 50, nullable = false)
    private String tipoRol;

    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;  // <--- CORREGIDO

    public Rol() {}

    public Rol(int idRol, String tipoRol, Usuario usuario) {
        this.idRol = idRol;
        this.tipoRol = tipoRol;
        this.usuario = usuario;
    }

    public int getIdRol() {
        return idRol;
    }

    public void setIdRol(int idRol) {
        this.idRol = idRol;
    }

    public String getTipoRol() {
        return tipoRol;
    }

    public void setTipoRol(String tipoRol) {
        this.tipoRol = tipoRol;
    }

    public Usuario getUsuario() {   // <--- CORREGIDO
        return usuario;
    }

    public void setUsuario(Usuario usuario) {  // <--- CORREGIDO
        this.usuario = usuario;
    }
}