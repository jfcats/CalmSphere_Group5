package pe.edu.upc.back_calmsphere.dtos;
import java.time.LocalTime;

public class DisponibilidadDTOInsert {
    private Integer disponibilidadId;
    private Integer diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private int idProfesionalServicio; // <--- NUEVO Y OBLIGATORIO

    // Getters y Setters
    public Integer getDisponibilidadId() { return disponibilidadId; }
    public void setDisponibilidadId(Integer id) { this.disponibilidadId = id; }
    public Integer getDiaSemana() { return diaSemana; }
    public void setDiaSemana(Integer dia) { this.diaSemana = dia; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime inicio) { this.horaInicio = inicio; }
    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime fin) { this.horaFin = fin; }
    public int getIdProfesionalServicio() { return idProfesionalServicio; }
    public void setIdProfesionalServicio(int id) { this.idProfesionalServicio = id; }
}