package pe.edu.upc.back_calmsphere.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "MetodoPago")
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMetodoPago;

    @Column(name = "nombre", length = 50, nullable = false)
    private String nombre;

    @Column(name = "tipo", length = 50, nullable = false)
    private String tipo;

    @Column(name = "estado", nullable = false)
    private boolean estado;

    // === NUEVO: RELACIÓN CON USUARIO ===
    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    public MetodoPago() {
    }

    public MetodoPago(int idMetodoPago, String nombre, String tipo, boolean estado, Usuario usuario) {
        this.idMetodoPago = idMetodoPago;
        this.nombre = nombre;
        this.tipo = tipo;
        this.estado = estado;
        this.usuario = usuario;
    }

    public int getIdMetodoPago() {
        return idMetodoPago;
    }

    public void setIdMetodoPago(int idMetodoPago) {
        this.idMetodoPago = idMetodoPago;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}