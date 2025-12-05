package pe.edu.upc.back_calmsphere.entities;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "Disponibilidad")
public class Disponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disponibilidad_id")
    private Integer disponibilidadId;

    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana; // 1=Lunes, 7=Domingo

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    // AQUI ESTÁ LA CLAVE: Muchos horarios pertenecen a UN servicio profesional
    @ManyToOne
    @JoinColumn(name = "id_profesional_servicio", nullable = false)
    private ProfesionalServicio profesionalServicio;

    public Disponibilidad() {}

    // Getters y Setters
    public Integer getDisponibilidadId() { return disponibilidadId; }
    public void setDisponibilidadId(Integer id) { this.disponibilidadId = id; }
    public Integer getDiaSemana() { return diaSemana; }
    public void setDiaSemana(Integer dia) { this.diaSemana = dia; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime inicio) { this.horaInicio = inicio; }
    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime fin) { this.horaFin = fin; }

    public ProfesionalServicio getProfesionalServicio() { return profesionalServicio; }
    public void setProfesionalServicio(ProfesionalServicio ps) { this.profesionalServicio = ps; }
}