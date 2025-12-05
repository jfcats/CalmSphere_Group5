package pe.edu.upc.back_calmsphere.dtos;

import java.time.LocalTime;

public class DisponibilidadDTOList {
    private int disponibilidadId;
    private int diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    // --- CAMBIO: Agregamos el campo que faltaba ---
    private int idProfesionalServicio;

    public int getDisponibilidadId() {
        return disponibilidadId;
    }

    public void setDisponibilidadId(int disponibilidadId) {
        this.disponibilidadId = disponibilidadId;
    }

    public int getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(int diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    // --- CAMBIO: Getters y Setters REALES para el servicio ---
    public int getIdProfesionalServicio() {
        return idProfesionalServicio;
    }

    public void setIdProfesionalServicio(int idProfesionalServicio) {
        this.idProfesionalServicio = idProfesionalServicio;
    }
}