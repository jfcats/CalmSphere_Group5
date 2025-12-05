package pe.edu.upc.back_calmsphere.dtos;

public class ProfesionalServicioDTOList {
    private int idProfesionalServicio;
    private String nombre; // Nombre del servicio (ej: Terapia)
    private int duracionMin;
    private double precioBase;
    private int idUsuario;

    // --- NUEVOS CAMPOS ---
    private String nombreProfesional;
    private String apellidoProfesional;

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

    public String getNombreProfesional() { return nombreProfesional; }
    public void setNombreProfesional(String n) { this.nombreProfesional = n; }
    public String getApellidoProfesional() { return apellidoProfesional; }
    public void setApellidoProfesional(String a) { this.apellidoProfesional = a; }
}