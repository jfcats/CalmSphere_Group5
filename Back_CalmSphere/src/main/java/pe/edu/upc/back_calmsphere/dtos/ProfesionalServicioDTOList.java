package pe.edu.upc.back_calmsphere.dtos;

public class ProfesionalServicioDTOList {
    private int idProfesionalServicio;
    private String nombre;
    private int duracionMin;
    private double precioBase;
    // private int idDisponibilidad;  <-- ELIMINADO
    private int idUsuario; // El doctor

    // Getters y Setters
    public int getIdProfesionalServicio() { return idProfesionalServicio; }
    public void setIdProfesionalServicio(int id) { this.idProfesionalServicio = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public int getDuracionMin() { return duracionMin; }
    public void setDuracionMin(int d) { this.duracionMin = d; }
    public double getPrecioBase() { return precioBase; }
    public void setPrecioBase(double p) { this.precioBase = p; }
    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int id) { this.idUsuario = id; }
}