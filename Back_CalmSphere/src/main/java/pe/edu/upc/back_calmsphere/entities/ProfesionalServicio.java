package pe.edu.upc.back_calmsphere.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Profesional_servicio")
public class ProfesionalServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_profesional_servicio")
    private Integer idProfesionalServicio;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre; // Ej: "Consulta Psicológica General"

    @Column(name = "duracion_min", nullable = false)
    private Integer duracionMin; // Ej: 60 minutos

    @Column(name = "precio_base", nullable = false)
    private Double precioBase;

    // RELACIÓN CON EL DOCTOR
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // RELACIÓN INVERSA (Opcional, pero útil para saber los horarios del servicio)
    // Usamos JsonIgnore para evitar bucles infinitos al listar
    @OneToMany(mappedBy = "profesionalServicio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Disponibilidad> disponibilidades;

    public ProfesionalServicio() {}

    // Getters y Setters...
    public Integer getIdProfesionalServicio() { return idProfesionalServicio; }
    public void setIdProfesionalServicio(Integer id) { this.idProfesionalServicio = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getDuracionMin() { return duracionMin; }
    public void setDuracionMin(Integer d) { this.duracionMin = d; }
    public Double getPrecioBase() { return precioBase; }
    public void setPrecioBase(Double p) { this.precioBase = p; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<Disponibilidad> getDisponibilidades() { return disponibilidades; }
    public void setDisponibilidades(List<Disponibilidad> disponibilidades) { this.disponibilidades = disponibilidades; }
}