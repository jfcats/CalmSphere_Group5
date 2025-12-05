package pe.edu.upc.back_calmsphere.dtos;

import java.util.List;

public class RolAsignacionDTO {
    private int idUsuario;
    private List<String> roles; // Ej: ["ADMIN", "PACIENTE"]

    // Getters y Setters
    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}