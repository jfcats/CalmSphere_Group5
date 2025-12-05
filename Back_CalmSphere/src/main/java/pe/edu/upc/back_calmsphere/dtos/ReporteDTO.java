package pe.edu.upc.back_calmsphere.dtos;

public class ReporteDTO {
    private String nombre;
    private int cantidad;

    public ReporteDTO() {
    }

    public ReporteDTO(String nombre, int cantidad) {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}